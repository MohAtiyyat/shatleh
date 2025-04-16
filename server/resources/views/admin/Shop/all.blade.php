@extends('admin.layout.master')

@section('title', 'Shop Management')
@section('Shops_Show')
    active
@endsection

@section('content')
<?php
    // Fallback shops array if none provided
    $shops = $shops ?? collect([[
        'id' => 1,
        'name' => 'N/A',
        'details' => 'N/A',
        'owner_phone_number' => 'N/A',
        'owner_name' => 'N/A',
        'is_partner' => false,
        'image' => 'https://via.placeholder.com/75',
        'employee' => ['name' => 'N/A'],
        'address' => [
            'id' => 0,
            'title' => 'N/A',
            'country' => 'N/A',
            'city' => 'N/A',
            'address_line' => 'N/A'
        ],
        'updated_at' => 'N/A',
        'actions' => true
    ]]);
?>
    <x-management-table
        title="Shop Management"
        :headers="[
            '#', 'Image', 'Shop Name', 'Details', 'Owner Name', 'Owner Phone', 'Partner', 'Employee', 'Address', 'Updated', 'Actions'
        ]"
        :items="$shops->map(function ($shop) {
            return [
                'id' => $shop['id'],
                'image' => $shop['image'] ?? 'https://via.placeholder.com/75',
                'name' => $shop['name'],
                'details' => $shop['details'],
                'owner_name' => $shop['owner_name'],
                'owner_phone' => $shop['owner_phone_number'],
                'is_partner' => $shop['is_partner'] ? 'Yes' : 'No',
                'employee' => $shop['employee']['name'] ?? 'N/A',
                'address' => view('admin.shop.partials.address-popout', ['address' => $shop['address']])->render(),
                'updated' => $shop['updated_at'] !== 'N/A' ? \Carbon\Carbon::parse($shop['updated_at'])->format('Y-m-d') : 'N/A',
                'actions' => $shop['actions'] ?? true,
            ];
        })->toArray()"
        add-route="{{ route('shop.create') }}"
        view-route-prefix="/dashboard/shop"
    />
@endsection
