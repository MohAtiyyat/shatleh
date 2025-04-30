<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegiseterRequest;
use App\Http\Requests\Dashboard\auth\LogoutRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
                'user' => $user
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

        return response()->json(['message' => 'Registration successful', 'token' => $token , 'user' => $user], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'reqgiser failed', 'throwable' => $th], 500);
        }
    }

    public function logout(LogoutRequest $request){
        
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'logged out'], 200);
    }
}
