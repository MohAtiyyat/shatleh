@extends('admin.layout.master')

@section('title', 'Product Details')
@section('Products_Show')
    active
@endsection
@section('content')

<?php
    $product = $product ?? [
        'id' => '',
        'name_en' => 'N/A',
        'name_ar' => 'N/A',
        'price' => 'N/A',
        'image' => 'https://via.placeholder.com/400',
        'description_en' => 'No description available',
        'description_ar' => 'No description available',
        'status' => 'N/A',
        'availability' => 'N/A',
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
                                <h2 class="mb-0 font-weight-bold">{{ $product['name_en'] ?? 'Product Details' }} / {{ $product['name_ar'] ?? '' }}</h2>
                                <div>
                                    <a href="{{ url('/dashboard/product') }}"
                                       class="btn btn-light btn-sm mr-2"
                                       title="Back to Products">
                                        <i class="fas fa-arrow-left"></i> Back
                                    </a>
                                    <a href="{{ route('product.create') }}"
                                       class="btn btn-light btn-sm"
                                       title="Add New Product">
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
                                        <img src="{{ $product['image'] }}"
                                             alt="{{ $product['name_en'] }}"
                                             class="img-fluid rounded-lg shadow-sm"
                                             style="max-height: 400px; object-fit: cover; width: 100%;">
                                    </div>
                                </div>
                                <!-- Details Section -->
                                <div class="col-md-7">
                                    <div class="pl-md-4 pt-4 pt-md-0">
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Price</h5>
                                            <p class="h4 text-dark font-weight-semibold">{{ $product['price'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Availability</h5>
                                            <p class="text-{{ $product['availability'] === 'In Stock' ? 'success' : 'danger' }} font-weight-medium">
                                                {{ $product['availability'] }}
                                            </p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Status</h5>
                                            <p class="text-dark">{{ $product['status'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Description (English)</h5>
                                            <p class="text-dark">{{ $product['description_en'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Description (Arabic)</h5>
                                            <p class="text-dark">{{ $product['description_ar'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Product ID</h5>
                                            <p class="text-dark">#{{ $product['id'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Created At</h5>
                                            <p class="text-dark">{{ $product['created_at'] }}</p>
                                        </div>
                                        <div class="mb-4">
                                            <h5 class="text-muted font-weight-bold">Updated At</h5>
                                            <p class="text-dark">{{ $product['updated_at'] }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <a href="{{ url('/dashboard/product/' . $product['id']) }}/edit"
                               class="btn btn-outline-primary btn-lg mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i>Edit Product
                            </a>
                            <form action="{{ url('/dashboard/product/' . $product['id']) }}"
                                  method="POST"
                                  style="display: inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="btn btn-outline-danger btn-lg rounded-pill px-4"
                                        onclick="return confirm('Are you sure you want to delete this product?')">
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
