<?php

namespace App\Http\Controllers\Api;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegiseterRequest;
use App\Http\Requests\Api\Auth\ResetPasswordRequest;
use App\Http\Requests\Api\Contact\CheckContactRequest;
use App\Http\Requests\Api\Contact\CheckUniqeContactRequest;
use App\Http\Requests\Api\OTP\VerifyOtpRequest;
use App\Http\Requests\Dashboard\auth\LogoutRequest;
use App\Mail\EmailVerification;
use App\Mail\ResetPasswordOTP;
use App\Models\OTP;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;



class AuthController extends Controller
{
    use HelperTrait;
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            $user = Auth::user();

            if ($user->is_banned) {
                Auth::logout();
                return response()->json(['message' => 'Your account is banned'], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ], 200);
        }
        return response()->json(['login failed']);
    }

    public function register(RegiseterRequest $request)
    {
        try {
            $data = $request->validated();
            $user = User::create($data);

            $user->assignRole('Customer');

            Auth::login($user);

            $token = $user->createToken('auth_token')->plainTextToken;

            $this->logAction($user->id, 'register', 'User registered: ' . $user->name . ' (ID: ' . $user->id . ')', LogsTypes::INFO->value);
            return response()->json(['message' => 'Registration successful', 'token' => $token, 'user' => $user], 200);
        } catch (\Throwable $th) {
            $this->logAction(null, 'register_error', 'Registration failed: ' . $th->getMessage(), LogsTypes::ERROR->value);
            return response()->json(['message' => 'reqgiser failed', 'throwable' => $th], 500);
        }
    }

    public function logout(LogoutRequest $request)
    {

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'logged out'], 200);
    }

    public function checkUniqeContact(CheckUniqeContactRequest $request)
    {
        Log::info($request->all());
        $data = $request->validated();
        $contact = isset($data['phone_number']) ? 'phone_number' : 'email';

        return response()->json([
            'message' => 'Contact is valid',
             $contact=> $data[$contact],
        ], 200);
    }
    public function sendOtp(CheckContactRequest $request)
    {
        $data = $request->validated();
        $contact = !empty($data['phone_number']) ? 'phone_number' : 'email';

        $otp = rand(1000, 9999);
        OTP::create([
            $contact => $data[$contact],
            'otp' => $otp,
            'expired_at' => now()->addMinutes(5),
        ]); 

        if($contact ==='email')
            Mail::to($data[$contact])->send($data['otp_type'] === 'reset_password' ? new ResetPasswordOTP($otp, User::where($contact, $data[$contact])->first()->lang ?? ($data['lang'] ?? 'en')) 
        : new EmailVerification ($otp, auth()->user()->lang ?? ($data['lang'] ?? 'en')));

        
        return response()->json(['message' => 'OTP sent successfully', $contact => $data[$contact]], 200);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $data = $request->validated();
        $contact = isset($data['phone_number']) ? 'phone_number' : 'email';

        $otpRecord = OTP::where($contact, $data[$contact])
            ->where('otp',  $data['otp'])
            ->where('expired_at', '>', now())
            ->first();
            
        if (empty($otpRecord)) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }
        if(!empty($data['otp_type']) && $data['otp_type'] === 'reset_password') {
            $user = User::where($contact, $data[$contact])->first();
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

        } 

        return response()->json(['message' => 'OTP verified successfully'], 200);
    }

    public function resetPassword(Request $request)
{
    $data = $request->validate([
        'email' => 'required_without:phone_number|email|exists:users,email',
        'phone_number' => 'required_without:email|regex:/^(\+?2)?[0-9]{13}$/|exists:users,phone_number',
        'password' => 'required|min:8|confirmed',
        'password_confirmation' => 'required|same:password',
    ]);
    $contact = isset($data['phone_number']) ? 'phone_number' : 'email';

    $user = User::where($contact, $data[$contact])->first();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->password = Hash::make($data['password']);
    $user->save();

    OTP::where($contact, $data[$contact]) ->delete();

    $this->logAction($user->id, 'reset_password', 'Password reset for user: ' . $user->email, LogsTypes::INFO->value);
    return response()->json(['message' => 'Password reset successfully'], 200);
}
}
