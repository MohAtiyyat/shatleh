<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait UserRoleTrait
{
    public function admin()
    {
        return (Auth::check() && Auth::user()->hasRole('Admin'));
    }

    public function expert()
    {
        return (Auth::check() && Auth::user()->hasAnyRole('Admin|Expert'));
    }
    public function employee()
    {
        return (Auth::check() && Auth::user()->hasAnyRole('Admin|Employee'));
    }

    public function allDashboardUsers()
    {
        return (Auth::check() && Auth::user()->hasAnyRole('Admin|Expert|Employee'));
    }

}