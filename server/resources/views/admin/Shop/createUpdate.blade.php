@extends('admin.layout.master')

@section('title', isset($shop) ? 'Edit Shop' : 'Create Shop')
@section('Shops_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($shop) ? 'Edit Shop' : 'Create New Shop'"
        :action="isset($shop) ? route('dashboard.Shop.update', $shop->id) : route('dashboard.Shop.store')"
        :method="isset($shop) ? 'PUT' : 'POST'"
        enctype="multipart/form-data"
        :item="$shop ?? null"
        :fields="[
            ['name' => 'name', 'label' => 'Shop Name', 'type' => 'text', 'placeholder' => 'Enter shop name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'address_id', 'label' => 'Address', 'type' => 'select', 'options' => $addresses ?? [], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'details', 'label' => 'Details', 'type' => 'textarea', 'placeholder' => 'Enter shop details', 'required' => true, 'aria-required' => 'true', 'maxlength' => 500],
            ['name' => 'owner_phone_number', 'label' => 'Owner Phone Number', 'type' => 'text', 'placeholder' => 'Enter owner phone number', 'required' => true, 'aria-required' => 'true', 'maxlength' => 20],
            ['name' => 'owner_name', 'label' => 'Owner Name', 'type' => 'text', 'placeholder' => 'Enter owner name', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'is_partner', 'label' => 'Partner Status', 'type' => 'select', 'options' => [1 => 'Partner', 0 => 'Not Partner'], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'employee_id', 'label' => 'Employee', 'type' => 'hidden', 'value' => auth()->id(), 'required' => true, 'aria-required' => 'true'],
            ['name' => 'employee_display', 'label' => 'Assigned Employee', 'type' => 'text', 'value' => auth()->user()->first_name ?? 'N/A', 'disabled' => true, 'aria-disabled' => 'true'],
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'accept' => 'image/jpeg,image/png,image/jpg,image/webp', 'required' => false, 'aria-required' => 'false']
        ]"
        :errors="$errors ?? []"
    />
@endsection
