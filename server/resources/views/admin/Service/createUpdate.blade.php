@extends('admin.layout.master')

@section('title', isset($item) ? 'Edit Service' : 'Create Service')
@section('Services_Show', 'active')

@section('content')
    <x-management-form
        :title="isset($item) ? 'Edit Service' : 'Create New Service'"

        :action="isset($item) ? route('dashboard.service.update', $item->id) : route('dashboard.service.create')"
        :method="isset($item) ? 'PUT' : 'POST'"
        enctype="multipart/form-data"
        :item="$item ?? null"
        :fields="[
            ['name' => 'name_en', 'label' => 'Name (English)', 'type' => 'text', 'placeholder' => 'Enter English name', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'name_ar', 'label' => 'Name (Arabic)', 'type' => 'text', 'placeholder' => 'Enter Arabic name', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'image', 'label' => 'Image', 'type' => 'file', 'accept' => 'image/*', 'multiple' => false, 'required' => !isset($item), 'aria-required' => !isset($item) ? 'true' : 'false'],
            ['name' => 'description_en', 'label' => 'Description (English)', 'type' => 'textarea', 'placeholder' => 'Enter English description', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'description_ar', 'label' => 'Description (Arabic)', 'type' => 'textarea', 'placeholder' => 'Enter Arabic description', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['1' => 'Active', '0' => 'Inactive', '2' => 'Draft'], 'required' => true, 'aria-required' => 'true'],
        ]"
        :errors="$errors ?? []"
    />
@endsection
