@extends('admin.layout.master')

@section('title', 'Product Management')
@section('Products_Show')
    active
@endsection
@section('content')
    <x-management-table
        title="Product Management"
        :headers="[
            '#', 'Image', 'Name', 'Price', 'Status', 'Availability', 'Description', 'Updated', 'Actions'
        ]"
        :items="[
            [
                'id' => 1,
                'image' => 'https://via.placeholder.com/75',
                'name' => 'Sample Product',
                'price' => '$19.99',
                'status' => 'Active',
                'availability' => 'In Stock',
                'description' => 'Short description in English.',
                'updated' => '2025-04-05',
                'actions' => true
            ],
            [
                'id' => 2,
                'image' => 'https://via.placeholder.com/75/cccccc',
                'name' => 'Premium Item',
                'price' => '$49.99',
                'status' => 'Inactive',
                'availability' => 'Out of Stock',
                'description' => 'This is our premium offering.',
                'updated' => '2025-04-02',
                'actions' => true
            ]
        ]"
        add-route="{{ route('product.create') }}"
        view-route-prefix="/product"
    />
@endsection
