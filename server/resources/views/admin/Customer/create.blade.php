@extends('admin.layout.master')

@section('title', 'Create Customer')

@section('content')
    <x-management-form
        title="Create New Customer"
        action="''"
        method="POST"
        :fields="[
            ['name' => 'name', 'label' => 'Full Name', 'type' => 'text', 'placeholder' => 'Enter customer name', 'required' => true],
            ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'placeholder' => 'Enter email address', 'required' => true],
            ['name' => 'phone', 'label' => 'Phone Number', 'type' => 'text', 'placeholder' => 'Enter phone number', 'required' => true],
            ['name' => 'address', 'label' => 'Address', 'type' => 'text', 'placeholder' => 'Enter customer address', 'required' => false],
            ['name' => 'city', 'label' => 'City', 'type' => 'text', 'placeholder' => 'Enter city', 'required' => false],
            ['name' => 'country', 'label' => 'Country', 'type' => 'select', 'options' => [
                'us' => 'United States',
                'uk' => 'United Kingdom',
                'ca' => 'Canada',
                'other' => 'Other'
            ], 'required' => true],
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => [
                'active' => 'Active',
                'inactive' => 'Inactive'
            ], 'required' => true]
        ]"
    />
@endsection
