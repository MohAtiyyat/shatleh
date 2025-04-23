@extends('admin.layout.master')

@section('title', isset($address) ? 'Edit Address' : 'Create Address')
@section('Addresses_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($address) ? 'Edit Address' : 'Create New Address'"
        :action="isset($address) ? route('dashboard.Address.update', $address->id) : route('dashboard.Address.store')"
        :method="isset($address) ? 'PUT' : 'POST'"
        :item="$address ?? null"
        :fields="[
            ['name' => 'title', 'label' => 'Title', 'type' => 'text', 'placeholder' => 'Enter address title (e.g., Home, Office)', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'country_id', 'label' => 'Country', 'type' => 'select', 'options' => $countries ?? [], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'city', 'label' => 'City', 'type' => 'text', 'placeholder' => 'Enter city', 'required' => true, 'aria-required' => 'true', 'maxlength' => 255],
            ['name' => 'address_line', 'label' => 'Address Line', 'type' => 'textarea', 'placeholder' => 'Enter full address', 'required' => true, 'aria-required' => 'true', 'maxlength' => 500],
            ['name' => 'shop_id', 'label' => 'Shop', 'type' => 'select', 'options' => $shops ?? []]
        ]"
        :errors="$errors"
    />
@endsection
