<?php

namespace App\Http\Controllers\Api;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegiseterRequest;
use App\Http\Requests\Api\CheckMobileRequest;
use App\Http\Requests\Api\OTP\VerifyOtpRequest;
use App\Http\Requests\Dashboard\auth\LogoutRequest;
use App\Models\OTP;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


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

    public function checkMobile(CheckMobileRequest $request)
    {
        $data = $request->validated();

        return response()->json([
            'message' => 'Mobile number is valid',
            'mobile' => $data['mobile']
        ], 200);
    }
    public function sendOtp(CheckMobileRequest $request)
    {
        $data = $request->validated();

        $otp = rand(1000, 9999);
        OTP::create([
            'mobile' => $data['mobile'],
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]); 
        return response()->json(['message' => 'OTP sent successfully', 'mobile' => $data['mobile']], 200);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $data = $request->validated();

        $otpRecord = OTP::where('mobile', $data['mobile'])
            ->where('otp', $data['otp'])
            ->where('expires_at', '>', now())
            ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        return response()->json(['message' => 'OTP verified successfully'], 200);
    }
}
