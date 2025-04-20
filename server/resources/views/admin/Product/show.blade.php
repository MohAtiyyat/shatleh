@extends('admin.layout.master')

@section('title', 'Product Details')
@section('Products_Show', 'active')

@section('content')
    <div class="content py-1 item">
        <div class="">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-md-12">
                    <div class="card border-0 shadow-lg rounded-lg overflow-hidden">
                        <!-- Header -->
                        <div class="card-header bg-gradient-success text-white p-4">
                            <div class="d-flex justify-content-between align-items-center">
                                <h2 class="mb-0 font-weight-bold text-capitalize">
                                    {{ $product['name_en'] ?? 'Product Details' }} / {{ $product['name_ar'] ?? '' }}
                                </h2>
                                <div>
                                    <a href="{{ url('/dashboard/product') }}"
                                       class="btn btn-light btn-sm mr-2 rounded-pill px-3"
                                       title="Back to Products">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    <a href="{{ route('product.create') }}"
                                       class="btn btn-light btn-sm rounded-pill px-3"
                                       title="Add New Product">
                                        <i class="fas fa-plus mr-1"></i> New
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">
                            <!-- Image Section (Top-Left with Wrapping) -->
                            <div class="image-wrapper float-left mr-4 mb-4">
                                <!--the image will be fixed soon-->
                                <img src="https://placehold.co/350"
                                     alt="{{ $product['name_en'] . $product['name_ar'] }}"
                                     class="rounded-lg shadow-sm"
                                     style="max-height: 350px; object-fit: cover; width: 100%; max-width: 350px;">
                            </div>
                            <!-- Details Section (Wrapping Around Image) -->
                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Price</h5>
                                        <p class="h4 text-dark font-weight-bold mb-0">
                                            ${{ number_format($product['price'] ?? 0, 2) }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Availability</h5>
                                        @php
                                            $availabilityMap = [
                                                '1' => 'In Stock',
                                                '0' => 'Out of Stock',
                                                '2' => 'Pre-order'
                                            ];
                                            $availability = $availabilityMap[$product['availability']] ?? 'N/A';
                                        @endphp
                                        <span class="badge badge-pill {{ $availability === 'In Stock' ? 'badge-success' : ($availability === 'Out of Stock' ? 'badge-danger' : 'badge-warning') }} px-3 py-2">
                                            {{ $availability }}
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Status</h5>
                                        @php
                                            $statusMap = [
                                                '1' => 'Active',
                                                '0' => 'Inactive',
                                                '2' => 'Draft'
                                            ];
                                            $status = $statusMap[$product['status']] ?? 'N/A';
                                        @endphp
                                        <span class="badge badge-pill {{ $status === 'Active' ? 'badge-success' : ($status === 'Inactive' ? 'badge-danger' : 'badge-secondary') }} px-3 py-2">
                                            {{ $status }}
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Product ID</h5>
                                        <p class="text-dark mb-0">#{{ $product['id'] ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Description (English)</h5>
                                        <p class="text-dark">{{ $product['description_en'] ?? 'No description available' }}</p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Description (Arabic)</h5>
                                        <p class="text-dark text-right" dir="rtl">
                                            {{ $product['description_ar'] ?? 'لا يوجد وصف متاح' }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($product['created_at'])->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($product['updated_at'])->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <a href="{{ route('dashboard.product.edit', $product['id']) }}"
                               class="btn btn-outline-primary btn-md mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i> Edit Product
                            </a>
                            <form action="{{ route('dashboard.product.destroy', $product['id']) }}"
                                  method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="btn btn-outline-danger btn-md rounded-pill px-4"
                                        onclick="return confirm('Are you sure you want to delete this product?')">
                                    <i class="fas fa-trash mr-2"></i> Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .bg-gradient-primary {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        .btn-outline-primary, .btn-outline-danger {
            transition: all 0.3s ease;
            border-width: 2px;
        }
        .btn-outline-primary:hover {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }
        .btn-outline-danger:hover {
            background-color: #dc3545;
            color: white;
            border-color: #dc3545;
        }
        .rounded-lg {
            border-radius: 0.75rem !important;
        }
        .badge-pill {
            border-radius: 50rem;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .badge-success {
            background-color: #28a745;
            color: white;
        }
        .badge-danger {
            background-color: #dc3545;
            color: white;
        }
        .badge-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .badge-secondary {
            background-color: #6c757d;
            color: white;
        }
        .card-body {
            background-color: #f8f9fa;
        }
        h5.text-muted {
            font-size: 1rem;
            color: #6c757d !important;
        }
        p.text-dark {
            font-size: 1.1rem;
            color: #343a40 !important;
        }

        .image-wrapper {
            float: left;
        }
        .details-wrapper {
            overflow: hidden; /* Ensures the details wrap around the floated image */
        }
        .clearfix {
            clear: both; /* Clears the float to ensure the footer isn't affected */
        }
    </style>
@endsection
