@extends('admin.layout.master')

@section('title', 'Shop Details')
@section('Shops_Show')
    active
@endsection
@section('content')

<?php
    $shop = $shop ?? [
        'id' => '',
        'name' => 'N/A',
        'details' => 'No details available',
        'owner_name' => 'N/A',
        'owner_phone_number' => 'N/A',
        'is_partner' => false,
        'address_id' => 'N/A',
        'employee_id' => 'N/A',
        'image' => null,
        'created_at' => 'N/A',
        'updated_at' => 'N/A'
    ];
?>
    <div class="content">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-md-12">
                    <div class="card border-0 shadow-lg rounded-lg overflow-hidden">
                        <!-- Header -->
                        <div class="card-header bg-gradient-primary text-white p-4">
                            <div class="d-flex justify-content-between align-items-center">
                                <h2 class="mb-0 font-weight-bold">{{ $shop['name'] ?? 'Shop Details' }}</h2>
                                <div>
                                    <a href="{{ url('/dashboard/shop') }}"
                                       class="btn btn-light btn-sm mr-2"
                                       title="Back to Shops">
                                        <i class="fas fa-arrow-left"></i> Back
                                    </a>
                                    <a href="{{ route('shop.create') }}"
                                       class="btn btn-light btn-sm"
                                       title="Add New Shop">
                                        <i class="fas fa-plus"></i> New
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-white">
                            <div class="row">
                                <!-- Image Section -->
                                <div class="col-md-5">
                                    <div class="position-relative text-center">
                                        <img src="{{ $shop['image'] ?? 'https://via.placeholder.com/400' }}"
                                             alt="{{ $shop['name'] }}"
                                             class="img-fluid rounded-lg shadow-sm"
                                             style="max-height: 400px; object-fit: cover; width: 100%;">
                                    </div>
                                </div>
                                <!-- Details Section -->
                                <div class="col-md-7">
                                    <div class="pl-md-4 pt-4 pt-md-0">
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Shop Name</h5>
                                            <p class="h4 text-dark font-weight-semibold">{{ $shop['name'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Details</h5>
                                            <p class="text-dark">{{ $shop['details'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Owner Name</h5>
                                            <p class="text-dark">{{ $shop['owner_name'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Owner Phone Number</h5>
                                            <p class="text-dark">{{ $shop['owner_phone_number'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Partner Status</h5>
                                            <p class="text-{{ $shop['is_partner'] ? 'success' : 'danger' }} font-weight-medium">
                                                {{ $shop['is_partner'] ? 'Partner' : 'Not Partner' }}
                                            </p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Address ID</h5>
                                            <p class="text-dark">{{ $shop['address_id'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Employee ID</h5>
                                            <p class="text-dark">{{ $shop['employee_id'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Shop ID</h5>
                                            <p class="text-dark">#{{ $shop['id'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Created At</h5>
                                            <p class="text-dark">{{ $shop['created_at'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Updated At</h5>
                                            <p class="text-dark">{{ $shop['updated_at'] }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <a href="{{ url('/dashboard/shop/' . $shop['id']) }}/edit"
                               class="btn btn-outline-primary btn-lg mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i>Edit Shop
                            </a>
                            <form action="{{ url('/dashboard/shop/' . $shop['id']) }}"
                                  method="POST"
                                  style="display: inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="btn btn-outline-danger btn-lg rounded-pill px-4"
                                        onclick="return confirm('Are you sure you want to delete this shop?')">
                                    <i class="fas fa-trash mr-2"></i>Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .bg-gradient-primary {
            background: linear-gradient(135deg, #007bff 0%, #0057b3 100%);
        }
        .btn-outline-primary, .btn-outline-danger {
            transition: all 0.3s ease;
        }
        .btn-outline-primary:hover {
            background-color: #007bff;
            color: white;
        }
        .btn-outline-danger:hover {
            background-color: #dc3545;
            color: white;
        }
        .rounded-lg {
            border-radius: 0.75rem !important;
        }
        .badge-pill {
            border-radius: 50rem;
        }
    </style>
@endsection
