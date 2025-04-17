@extends('admin.layout.master')

@section('title', 'Product Management')
@section('Products_Show', 'active')

@section('content')
    <x-management-table
        title="Product Management"
        :headers="[
            '#', 'Image', 'Name (EN)', 'Name (AR)', 'Price', 'Status', 'Availability', 'Description (EN)', 'Description (AR)', 'Updated', 'Actions'
        ]"
        :items="$products"
        add-route="{{ route('dashboard.product.create') }}"
        view-route-prefix="/dashboard/product"
    />
@endsection
