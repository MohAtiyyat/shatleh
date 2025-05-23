@extends('admin.layout.master')

@section('title', isset($shop) ? 'Edit Shop' : 'Create Shop')
@section('Shops_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($shop) ? 'Edit Shop' : 'Create New Shop'"
        :action="isset($shop) ? route('dashboard.shop.update', $shop->id) : route('dashboard.shop.store')"
        :method="isset($shop) ? 'PUT' : 'POST'"
        enctype="multipart/form-data"
        :item="$shop ?? null"
        :fields="[
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'accept' => 'image/jpeg,image/png,image/jpg,image/webp', 'required' => false, 'aria-required' => 'false'],
            ['name' => 'name', 'label' => 'Shop Name', 'type' => 'text', 'placeholder' => 'Enter shop name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'owner_name', 'label' => 'Owner Name', 'type' => 'text', 'placeholder' => 'Enter owner name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'owner_phone_number', 'label' => 'Owner Phone Number', 'type' => 'text', 'placeholder' => 'Enter owner phone number', 'required' => true, 'aria-required' => 'true', 'maxlength' => 20],
            ['name' => 'address_id', 'label' => 'Address', 'type' => 'select', 'options' => $addresses ?? [], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'is_partner', 'label' => 'Partner Status', 'type' => 'select', 'options' => [1 => 'Partner', 0 => 'Not Partner'], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'details', 'label' => 'Details', 'type' => 'textarea', 'placeholder' => 'Enter shop details', 'required' => true, 'aria-required' => 'true', 'maxlength' => 500],
            ['name' => 'employee_display', 'label' => 'Added By', 'type' => 'text', 'value' => isset($shop) ? $shop->employee->first_name . ' ' . $shop->employee->last_name : auth()->user()->first_name  . ' ' . auth()->user()->last_name ?? 'N/A', 'disabled' => true, 'aria-disabled' => 'true']
        ]"
        :errors="$errors"
    />
@endsection
