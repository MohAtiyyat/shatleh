<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Staff\StoreStaffRequest;
use App\Http\Requests\Dashboard\Staff\UpdateStaffRequest;
use App\Models\User;
use Illuminate\Support\Arr;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    public function index() {
        $records = User::with('roles', 'addresses')->get()->filter(
            fn ($user) => $user->roles->contains(fn ($role) => in_array($role->name, ['Expert', 'Employee']))
        ); 
        return view('admin.Staff.all', compact('records'));
    }
    public function show($id) {
        $record = User::with('roles', 'addresses', 'specialties')->find($id);
        if ($record) {
            return view('admin.Staff.show', compact('record'));
        }
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }

    public function create() {
        $roles = Role::select('name')->whereIn('name', ['Expert', 'Employee'])->get();
        return view('admin.Staff.createUpdate', compact('roles'));
    }

    public function edit($id) {
        $staff = User::with('roles', 'addresses')->find($id);
        $roles = Role::whereIn('name', ['Expert', 'Employee'])->get();
        return view('admin.Staff.createUpdate', compact('staff', 'roles'));
    }
    public function store(StoreStaffRequest $request) {
        $data = $request->validated();

        $data['password'] = '1234';
        $data['password'] = bcrypt($data['password']);

        $staff = User::create(Arr::except($data, ['role']));

        $staff->assignRole($data['role']);

        return redirect()->route('dashboard.staff')->with('success', __('Staff created successfully.'));
     
    }
    public function update(UpdateStaffRequest $request, $id) {
        $data = $request->validated();
        $staff = User::find($id);
        if ($staff) {
            $staff->update(Arr::except($data, ['role']));
            $staff->syncRoles($data['role']);
            return redirect()->route('dashboard.staff')->with('success', __('Staff updated successfully.'));
        }
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
    public function delete($id) {
        $staff = \App\Models\User::find($id);
        if ($staff) {
            $staff->delete();
            return redirect()->route('dashboard.staff')->with('success', __('Staff deleted successfully.'));
        }
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
    public function ban($id) {
        $staff = User::find($id);
        if ($staff) {
            $staff->update(['is_banned' => !$staff->is_banned]);
            return redirect()->route('dashboard.staff')->with('success', __('Staff banned successfully.'));
        }
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }

    public function resetPassword($id) {
        $staff = User::find($id);
        if ($staff) {
            $staff->update(['password' => bcrypt('1234')]);
            return redirect()->route('dashboard.staff')->with('success', __('Staff password reset successfully.'));
        }
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
}
