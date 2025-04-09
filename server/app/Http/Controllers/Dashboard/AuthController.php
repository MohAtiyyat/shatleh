<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller

{
    public function Login(LoginRequest $request)
    {
        $data = $request->validated();
        if (Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            return view('admin.layout.master');
        }
        return view('admin.login.login');
    }

    
}
