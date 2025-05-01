<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegiseterRequest;
use App\Http\Requests\Dashboard\auth\LogoutRequest;
use App\Mail\EmailVerification;
use App\Models\OTP;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mail;

class AuthController extends Controller
{
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
            ], 200);
        }
        return response()->json(['login failed']);
    }

    public function register(RegiseterRequest $request){
        try {
        $data = $request->validated();
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone_number' => $data['phone_number'],
            'language' => $data['language'],
            'ip_country_id' => $data['ip_country_id']
        ]);

        $user->assignRole('customer');

        Auth::login($user);

        $token = $user->createToken('auth_token')->plainTextToken;

        $otp = rand(1000, 9999);
        OTP::create([
            'otp' => $otp,
            'email' => $user->email,
            'expired_at' => now()->addMinutes(5),
        ]);
        Mail::to($user->email)->send(new EmailVerification($otp, $user->language));

        return response()->json(['message' => 'Registration successful', 'token' => $token], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'reqgiser failed', 'throwable' => $th], 500);
        }
    }

    public function logout(LogoutRequest $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('dashboard/login');
    }
}
