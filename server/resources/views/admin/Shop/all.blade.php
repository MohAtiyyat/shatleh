@extends('admin.layout.master')

@section('title', 'Shop Management')
@section('Shops_Show', 'active')

@section('content')
    <x-management-table
        title="Shop Management"
        :headers="[
            '#', 'Image', 'Shop Name', 'Details', 'Owner Name', 'Owner Phone', 'Partner', 'Employee', 'Address', 'Updated', 'Actions'
        ]"
        :items="$shops"
        :Route="'dashboard.Shop'"
    />
@endsection
