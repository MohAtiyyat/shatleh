<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    public function index() {
        $users = Role::where('name', 'expert') ->orWhere('name', 'employee')->loadMissing('users')->toRawSql();
        dd($users);
        return view('admin.Staff.all');
    }
}
