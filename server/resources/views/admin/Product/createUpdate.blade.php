@extends('admin.layout.master')

@section('title', 'Create Product')
@section('Products_Show')
    active
@endsection
@section('content')
    <x-management-form
        title="Create New Product"
        action=""
        method="POST"
        enctype="multipart/form-data"
        :fields="[
            ['name' => 'name_en', 'label' => 'Name (English)', 'type' => 'text', 'placeholder' => 'Enter English name', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'name_ar', 'label' => 'Name (Arabic)', 'type' => 'text', 'placeholder' => 'Enter Arabic name', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'price', 'label' => 'Price', 'type' => 'number', 'placeholder' => 'Enter price (e.g., 99.99)', 'step' => '0.01', 'min' => '0', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'accept' => 'image/*', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'description_en', 'label' => 'Description (English)', 'type' => 'textarea', 'placeholder' => 'Enter English description', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'description_ar', 'label' => 'Description (Arabic)', 'type' => 'textarea', 'placeholder' => 'Enter Arabic description', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['active' => 'Active', 'inactive' => 'Inactive', 'draft' => 'Draft'], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'availability', 'label' => 'Availability', 'type' => 'select', 'options' => ['in_stock' => 'In Stock', 'out_of_stock' => 'Out of Stock', 'pre_order' => 'Pre-order'], 'required' => true, 'aria-required' => 'true']
        ]"
        :errors="$errors ?? []"
    />
@endsection
