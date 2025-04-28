@extends('admin.layout.master')

@section('title', isset($staff) ? 'Edit Staff' : 'Create Staff')
@section('Staff_Show', 'active')

@section('content')
    <x-management-form
    :title="isset($staff) ? 'Edit Staff' : 'Create New Staff'"
    :action="isset($staff) ? route('dashboard.staff.update', $staff->id) : route('dashboard.staff.store')"
    :method="isset($staff) ? 'PUT' : 'POST'"
    :item="$staff ?? null"
    :fields="[
        ['name' => 'role', 'label' => 'Role', 'type' => 'select', 'options' =>isset($staff) ? $staff->roles->pluck('name', 'name')->toArray() + $roles->pluck('name', 'name')->toArray() : $roles->pluck('name', 'name')->toArray(), 'required' => true],
        ['name' => 'first_name', 'label' => 'First Name', 'type' => 'text', 'placeholder' => 'Enter staff first name', 'required' => true],
        ['name' => 'last_name', 'label' => 'Last Name', 'type' => 'text', 'placeholder' => 'Enter staff last name', 'required' => true],
        ['name' => 'email', 'label' => 'Email', 'type' => 'text', 'placeholder' => 'Enter staff email', 'required' => true],
        ['name' => 'phone_number', 'label' => 'Phone Number', 'type' => 'text', 'placeholder' => 'Enter staff phone number', 'required' => true],
    ]"
    :specialties="$specialties"
    :errors="$errors"
/>

@endsection
