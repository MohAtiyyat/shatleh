@extends('admin.layout.master')

@section('title', isset($item) ? 'Edit Product Shop' : 'Create Product Shop')
@section('ProductShop_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($item) ? 'Edit Product Shop' : 'Create New Product Shop'"
        :action="isset($item) ? route('dashboard.productShop.update', $item['id']) : route('dashboard.productShop.store')"
        :method="isset($item) ? 'PUT' : 'POST'"
        :item="$item ?? null"
        :fields="[
            ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => $products->pluck('name_en', 'id')->toArray(), 'required' => true, 'aria-required' => 'true'],
            ['name' => 'shop_id', 'label' => 'Shop', 'type' => 'select', 'options' => $shops->pluck('name', 'id')->toArray(), 'required' => true, 'aria-required' => 'true'],
            ['name' => 'cost', 'label' => 'Cost', 'type' => 'number', 'placeholder' => 'Enter cost (e.g., 99.99)', 'step' => '0.01', 'min' => '0', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'employee_id', 'label' => 'Employee', 'type' => 'hidden', 'value' => auth()->id(), 'required' => true, 'aria-required' => 'true'],
            ['name' => 'employee_display', 'label' => 'Assigned Employee', 'type' => 'text', 'value' => auth()->user()->first_name . ' ' . auth()->user()->last_name ?? 'N/A', 'disabled' => true, 'aria-disabled' => 'true']
        ]"
        :errors="$errors ?? []"
    />
@endsection
