<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Staff\StoreStaffRequest;
use App\Http\Requests\Dashboard\Staff\UpdateStaffRequest;
use App\Mail\NewPassword;
use App\Mail\NewStaff;
use App\Models\Log;
use App\Models\Specialty;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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

        $password = Str::random(8); 
        $data['password'] = bcrypt($password);

        $staff = User::create(Arr::except($data, ['role']));

        $staff->assignRole($data['role']);
        if ($data['role'] === 'Expert' && isset($data['specialties'])) {
            $staff->specialties()->sync($data['specialties']);
        }

        Mail::to($staff->email)->send(new NewStaff(
            $staff, 
            $password,
        ));
        $this->logAction(auth()->id(), 'create_staff', 'Staff created: ' . $staff->name, LogsTypes::INFO->value);

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

            $this->logAction(auth()->id(), 'toggle_ban_staff', 'Staff ' . ($staff->is_banned ? 'banned' : 'unbanned') . ': ' . $staff->first_name . ' ' . $staff->last_name, LogsTypes::WARNING->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff banned successfully.'));
        }

        $this->logAction(auth()->id(), 'toggle_ban_staff', 'Staff ban failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }

    public function resetPassword($id) {
        $staff = User::find($id);
        if ($staff) {
            $newPassword = Str::random(8); // You can generate a random password here if needed
            $staff->update(['password' => bcrypt($newPassword)]);

            Mail::to($staff->email)->send(new NewPassword(newPassword: $newPassword, lang: $staff->lang));            $this->logAction(auth()->id(), 'reset_staff_password', 'Staff password reset: ' . $staff->name, LogsTypes::INFO->value);
            return redirect()->route('dashboard.staff')->with('success', __('Staff password reset successfully.'));
        }
        $this->logAction(auth()->id(), 'reset_staff_password', 'Staff password reset failed: Staff not found with ID ' . $id, LogsTypes::ERROR->value);
        return redirect()->route('dashboard.staff')->with('error', __('Staff not found.'));
    }
}
