@extends('admin.layout.master')

@section('title', 'Shop Details')
@section('Shops_Show', 'active')

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
                                    {{ $shop->name ?? 'Shop Details' }}
                                </h2>
                                <div>
                                    <a href="{{ URL::previous() }}"
                                       class="btn btn-light btn-sm mr-2 rounded-pill px-3"
                                       title="Back to Shops">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    <a href="{{ route('dashboard.shop.create') }}"
                                       class="btn btn-light btn-sm rounded-pill px-3"
                                       title="Add New Shop">
                                        <i class="fas fa-plus mr-1"></i> New
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">
                            <!-- Image Section (Top-Left with Wrapping) -->
                            <div class="image-wrapper float-left mr-4 mb-4">
                                <img src="{{ $shop->image ?? 'https://placehold.co/350' }}"
                                     alt="{{ $shop->name }}"
                                     class="rounded-lg shadow-sm"
                                     style="max-height: 350px; object-fit: cover; width: 100%; max-width: 350px;">
                            </div>
                            <!-- Details Section (Wrapping Around Image) -->
                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Shop Name</h5>
                                        <p class="text-dark">{{ $shop->name ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Partner Status</h5>
                                        <span class="badge badge-pill {{ $shop->is_partner ? 'badge-success' : 'badge-danger' }} px-3 py-2">
                                            {{ $shop->is_partner ? 'Partner' : 'Not Partner' }}
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Owner Name</h5>
                                        <p class="text-dark">{{ $shop->owner_name ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Owner Phone Number</h5>
                                        <p class="text-dark">{{ $shop->owner_phone_number ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Employee</h5>
                                        <p class="text-dark">{{ $shop->employee->first_name ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Shop ID</h5>
                                        <p class="text-dark">#{{ $shop->id ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Details</h5>
                                        <p class="text-dark">{{ $shop->details ?? 'No details available' }}</p>
                                    </div>
                                    <div class="col-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Products Count</h5>
                                        <a href="{{ route('dashboard.productShop', ['search' => $shop->name]) }}">
                                            <p>
                                                {{ $shop->products->count() ?? 'N/A' }}
                                            </p>
                                        </a>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Address</h5>
                                        <a href="{{ route('dashboard.address.show', $shop->address->id) }}">
                                            <p>
                                                {{ $shop->address ? ($shop->address->address_line . ', ' . $shop->address->city . ', ' . $shop->address->state . ', ' . $shop->address->country ->name_en) : 'N/A' }}
                                            </p>
                                        </a>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($shop->created_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($shop->updated_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <a href="{{ route('dashboard.shop.edit', $shop->id) }}"
                               class="btn btn-outline-primary btn-md mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i> Edit Shop
                            </a>
                            <form action="{{ route('dashboard.shop.destroy', $shop->id) }}"
                                  method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="btn btn-outline-danger btn-md rounded-pill px-4"
                                        onclick="return confirm('Are you sure you want to delete this shop?')">
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
        .bg-gradient-success {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
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
            overflow: hidden;
        }
        .clearfix {
            clear: both;
        }
    </style>
@endsection
