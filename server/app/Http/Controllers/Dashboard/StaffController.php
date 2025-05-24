<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Staff\StoreStaffRequest;
use App\Http\Requests\Dashboard\Staff\UpdateStaffRequest;
use App\Models\Log;
use App\Models\Specialty;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Support\Arr;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    use HelperTrait;
    public function index() {
        if(auth()->user()->hasRole('Admin')){ 
            $records = User::with('roles', 'addresses','specialties')->get()->filter(
                fn ($user) => $user->roles->contains(fn ($role) => in_array($role->name, ['Expert', 'Employee']))
            );
        }
        else {
            $records = User::with('roles', 'addresses','specialties')->get()->filter(
                fn ($user) => $user->roles->contains(fn ($role) => in_array($role->name, ['Expert']))
            );
        }

        return view('admin.Staff.index', compact('records'));
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
        $specialties = Specialty::select('id', 'name_ar')->get();

        $this->logAction(auth()->id(), 'create_staff', 'Accessed staff creation page', LogsTypes::INFO->value);
        return view('admin.Staff.createUpdate', compact('roles', 'specialties'));
    }

    public function edit($id) {
        $staff = User::with('roles', 'addresses', 'specialties')->find($id);
        $roles = Role::whereIn('name', ['Expert', 'Employee'])->get();
        $specialties = Specialty::select('id', 'name_ar')->get();
        return view('admin.Staff.createUpdate', compact('staff', 'roles', 'specialties'));
    }
    public function store(StoreStaffRequest $request) {
        $data = $request->validated();

        $data['password'] = '1234';
        $data['password'] = bcrypt($data['password']);

        $staff = User::create(Arr::except($data, ['role']));

        $staff->assignRole($data['role']);
        if ($data['role'] === 'Expert' && isset($data['specialties'])) {
            $staff->specialties()->sync($data['specialties']);
        }
        return redirect()->route('dashboard.staff')->with('success', __('Staff created successfully.'));

    }
    public function update(UpdateStaffRequest $request, $id) {
        $data = $request->validated();
        $staff = User::find($id);
        if ($staff) {
            $staff->update(Arr::except($data, ['role']));
            $staff->syncRoles($data['role']);

            if ($data['role'] === 'Expert' && isset($data['specialties'])) {
                $staff->specialties()->sync($data['specialties']);
            } else {
                $staff->specialties()->detach(); // Remove specialties if role changed
            }
            $this->logAction(auth()->id(), 'update_staff', 'Staff updated: ' . $staff->name, LogsTypes::INFO->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff updated successfully.'));
        }
        $this->logAction(auth()->id(), 'update_staff', 'Staff update failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
    public function delete($id) {
        $staff = \App\Models\User::find($id);
        if ($staff) {
            $staff->delete();
            $this->logAction(auth()->id(), 'delete_staff', 'Staff deleted: ' . $staff->name, LogsTypes::WARNING->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff deleted successfully.'));
        }
        $this->logAction(auth()->id(), 'delete_staff', 'Staff deletion failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
    public function ban($id) {
        $staff = User::find($id);
        if ($staff) {
            $staff->update(['is_banned' => !$staff->is_banned]);

            $this->logAction(auth()->id(), 'toggle_ban_staff', 'Staff ' . ($staff->is_banned ? 'banned' : 'unbanned') . ': ' . $staff->name, LogsTypes::WARNING->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff banned successfully.'));
        }

        $this->logAction(auth()->id(), 'toggle_ban_staff', 'Staff ban failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }

    public function resetPassword($id) {
        $staff = User::find($id);
        if ($staff) {
            $staff->update(['password' => bcrypt('1234')]);
            $this->logAction(auth()->id(), 'reset_staff_password', 'Staff password reset: ' . $staff->name, LogsTypes::INFO->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff password reset successfully.'));
        }
        $this->logAction(auth()->id(), 'reset_staff_password', 'Staff password reset failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
}
