@extends('admin.layout.master')

@section('title', 'View Address')
@section('Addresses_Show', 'active')

@section('content')
    <div class="container">
        <h1>Address Details</h1>
        <div class="card">
            <div class="card-body">
                <p><strong>ID:</strong> {{ $address->id }}</p>
                <p><strong>Title:</strong> {{ $address->title ?? 'N/A' }}</p>
                <p><strong>Country:</strong> {{ $address->country->name_en ?? 'N/A' }} {{ $address->country->name_ar ?? 'غ/م' }}</p>
                <p><strong>City:</strong> {{ $address->city ?? 'N/A' }}</p>
                <p><strong>Address Line:</strong> {{ $address->address_line ?? 'N/A' }}</p>
                <p><strong>User:</strong> {{ $address->user->first_name ?? 'N/A' }} {{ $address->user->last_name ?? 'N/A' }}</p>
                <p><strong>Updated:</strong> {{ $address->updated_at ? \Carbon\Carbon::parse($address->updated_at)->toDateString() : 'N/A' }}</p>
                <a href="{{ route('dashboard.Address.index') }}" class="btn btn-secondary">Back</a>
                <a href="{{ route('dashboard.Address.edit', $address->id) }}" class="btn btn-primary">Edit</a>
            </div>
        </div>
    </div>
@endsection
