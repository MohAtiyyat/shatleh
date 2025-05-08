<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use function PHPUnit\Framework\isEmpty;


class AuthController extends Controller

{
    public function Login(LoginRequest $request)
    {
        if(Auth::check()){
            Auth::logout();
        }
        $attributes = $request->validated();
        $user = User::where("email", $attributes["email"])->first();

        if(!isEmpty($user)&&$user->is_banned==1){
            return response()->json([
                'message' => 'Your account has been banned.',
            ], 403);
        }

        if (! Auth::attempt($attributes)) {
            return response()->json([
                'email' => 'Sorry, those credentials do not match.',
                ], 422);
        }

        request()->session()->regenerate();


        return redirect('/dashboard/home')->with('success', 'Login successful');
    }


    public function Logout()
    {
        Auth::logout();
        return redirect('/dashboard/login');
    }


    public function register(Request $request)
    {
        try {
            $data = $request->validated();

            $user = User::create($data);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
