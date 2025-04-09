@extends('admin.layout.master')

@section('title', 'Create Product')

@section('content')
    <x-management-form
        title="Create New Product"
        action="''"
        method="POST"
        :fields="[
            ['name' => 'name_en', 'label' => 'Name (English)', 'type' => 'text', 'placeholder' => 'Enter English name', 'required' => true],
            ['name' => 'name_ar', 'label' => 'Name (Arabic)', 'type' => 'text', 'placeholder' => 'Enter Arabic name', 'required' => true, 'dir' => 'rtl'],
            ['name' => 'price', 'label' => 'Price', 'type' => 'text', 'placeholder' => 'Enter price (e.g., 99.99)', 'required' => true],
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'required' => true],
            ['name' => 'description_en', 'label' => 'Description (English)', 'type' => 'text', 'placeholder' => 'Enter English description', 'required' => true],
            ['name' => 'description_ar', 'label' => 'Description (Arabic)', 'type' => 'text', 'placeholder' => 'Enter Arabic description', 'required' => true, 'dir' => 'rtl'],
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['active' => 'Active', 'inactive' => 'Inactive', 'draft' => 'Draft'], 'required' => true],
            ['name' => 'availability', 'label' => 'Availability', 'type' => 'select', 'options' => ['in_stock' => 'In Stock', 'out_of_stock' => 'Out of Stock', 'pre_order' => 'Pre-order'], 'required' => true]
        ]"
    />
@endsection
