@extends('admin.layout.master')

@section('title', isset($staff) ? 'Edit Staff' : 'Create Staff')
@section('Staff_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($staff) ? 'Edit Staff' : 'Create New Staff'"
        :action="isset($staff) ? route('dashboard.staff.update', $staff->id) : route('dashboard.staff.store')"
        :method="isset($staff) ? 'PUT' : 'POST'"
        enctype="multipart/form-data"
        :item="$staff ?? null"
        :fields="[
            ['name' => 'role', 'label' => 'Role', 'type' => 'select', 'options' => $roles->pluck('name', 'name') ?? [], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'first_name', 'label' => ' First name', 'type' => 'text', 'placeholder' => 'Enter staff first name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'last_name', 'label' => ' Last name', 'type' => 'text', 'placeholder' => 'Enter staff last name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'email', 'label' => 'Email', 'type' => 'text', 'placeholder' => 'Enter staff email', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'phone_number', 'label' => 'Staff Phone Number', 'type' => 'text', 'placeholder' => 'Enter staff phone number', 'required' => true, 'aria-required' => 'true', 'maxlength' => 20],
        ]"
        :errors="$errors"
    />
@endsection
