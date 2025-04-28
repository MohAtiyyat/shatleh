@extends('admin.layout.master')

@section('title', isset($customer) ? 'Edit Customer' : 'Create Customer')
@section('Customers_Show', 'active')

@section('content')
        <x-management-form
            :title="isset($customer) ? 'Edit Customer' : 'Create New Customer'"
            :action="isset($customer) ? route('dashboard.customer.update', $customer->id) : route('dashboard.customer.store')"
            :method="isset($customer) ? 'PUT' : 'POST'"
            :item="isset($customer) ? $customer->user : null"
            :fields="[
                ['name' => 'first_name', 'label' => 'First Name', 'type' => 'text', 'placeholder' => 'Enter first name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
                ['name' => 'last_name', 'label' => 'Last Name', 'type' => 'text', 'placeholder' => 'Enter last name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
                ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'placeholder' => 'Enter email address', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
                ['name' => 'phone_number', 'label' => 'Phone Number', 'type' => 'text', 'placeholder' => 'Enter phone number', 'required' => true, 'aria-required' => 'true', 'maxlength' => 20],
            ]"
            :errors="$errors"
        />

@endsection
