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
        :Route="'dashboard.product'"
    />
@endsection
