@extends('admin.layout.master')

@section('title', 'Create Shop')
@section('Shops_Show')
    active
@endsection
@section('content')
    <x-management-form
        title="Create New Shop"
        action=""
        method="POST"
        enctype="multipart/form-data"
        :fields="[
            ['name' => 'name', 'label' => 'Shop Name', 'type' => 'text', 'placeholder' => 'Enter shop name', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'address_id', 'label' => 'Address', 'type' => 'select', 'options' => $addresses ?? [], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'details', 'label' => 'Details', 'type' => 'textarea', 'placeholder' => 'Enter shop details', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'owner_phone_number', 'label' => 'Owner Phone Number', 'type' => 'text', 'placeholder' => 'Enter owner phone number', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'owner_name', 'label' => 'Owner Name', 'type' => 'text', 'placeholder' => 'Enter owner name', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'is_partner', 'label' => 'Partner Status', 'type' => 'select', 'options' => [1 => 'Partner', 0 => 'Not Partner'], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'accept' => 'image/*', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'value' => $employee_name ?? '', 'disabled' => true, 'aria-disabled' => 'true']
        ]"
        :errors="$errors ?? []"
    />
@endsection
