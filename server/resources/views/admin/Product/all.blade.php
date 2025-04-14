@extends('admin.layout.master')

@section('title', 'Product Management')
@section('Products_Show')
    active
@endsection
@section('content')
<?php
    // Fallback products array if none provided by the route
    $products = $products ?? [
        [
            'id' => '1',
            'image' => 'https://via.placeholder.com/75',
            'name_en' => 'N/A',
            'name_ar' => 'N/A',
            'price' => 'N/A',
            'status' => 'N/A',
            'availability' => 'N/A',
            'description_en' => 'No description available',
            'description_ar' => 'No description available',
            'updated_at' => 'N/A',
            'actions' => true
        ]
    ];
    // Convert $products to a collection for mapping
    $products = collect($products);
?>
    <x-management-table
        title="Product Management"
        :headers="[
            '#', 'Image', 'Name (EN)', 'Name (AR)', 'Price', 'Status', 'Availability', 'Description (EN)', 'Description (AR)', 'Updated', 'Actions'
        ]"
        :items="$products->map(function ($product) {
            return [
                'id' => $product['id'] ?? 'N/A',
                'image' => $product['image'] ?? 'https://via.placeholder.com/75',
                'name_en' => $product['name_en'] ?? 'N/A',
                'name_ar' => $product['name_ar'] ?? 'N/A',
                'price' => $product['price'] && is_numeric($product['price']) ? '$' . number_format($product['price'], 2) : 'N/A',
                'status' => $product['status'] ?? 'N/A',
                'availability' => $product['availability'] ?? 'N/A',
                'description_en' => $product['description_en'] ?? 'No description available',
                'description_ar' => $product['description_ar'] ?? 'No description available',
                'updated' => $product['updated_at'] && $product['updated_at'] !== 'N/A' ? \Carbon\Carbon::parse($product['updated_at'])->format('Y-m-d') : 'N/A',
                'actions' => $product['actions'] ?? true
            ];
        })->toArray()"
        add-route="{{ route('product.create') }}"
        view-route-prefix="/dashboard/product"
    />
@endsection
