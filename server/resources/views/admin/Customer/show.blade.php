@extends('admin.layout.master')

@section('title', 'Customer Details')
@section('Customers_Show', 'active')

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
                                    {{ $customer->first_name }} {{ $customer->last_name }}
                                </h2>
                                <div>
                                    <a href="{{ route('dashboard.customer.index') }}"
                                        class="btn btn-light btn-sm mr-2 rounded-pill px-3" title="Back to Customers">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    @if (auth()->user()->hasRole('Admin'))
                                    <a href="{{ route('dashboard.customer.create') }}"
                                    class="btn btn-light btn-sm rounded-pill px-3" title="Add New Customer">
                                    <i class="fas fa-plus mr-1"></i> New
                                    </a>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">
                            <!-- Details Section -->
                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Full Name</h5>
                                        <p class="text-dark">{{ $customer->first_name }}
                                            {{ $customer->last_name }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Email</h5>
                                        <p class="text-dark">{{ $customer->email }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Phone Number</h5>
                                        <p class="text-dark">{{ $customer->phone_number }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Balance</h5>
                                        <p class="text-dark">{{ number_format($customer->balance, 2) }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Banned Status</h5>
                                        <span
                                            class="badge badge-pill {{ $customer->is_banned ? 'badge-danger' : 'badge-success' }} px-3 py-2">
                                            {{ $customer->is_banned ? 'Banned' : 'Active' }}
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Orders Count</h5>
                                        <a href="{{ route('dashboard.order', ['search' => $customer->first_name . ' ' . $customer->last_name]) }}"
                                            class="text-dark">{{ $ordersCount ?? '0' }} <input type="button" value="view orders" class="btn btn-sm btn-success ml-2 px-3"></a>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Cart Items</h5>
                                        @if ($cartItems->isEmpty())
                                            <p class="text-dark">No items in cart</p>
                                        @else
                                            <ul class="list-group">
                                                @foreach ($cartItems as $item)
                                                    <li class="list-group-item">{{ $item->product->name_en ?? 'N/A' }}
                                                        (Qty: {{ $item->quantity }})</li>
                                                @endforeach
                                                <li class="list-group-item bg-success text-white text-center font-weight-bold"><a href="{{ route('dashboard.cart.index', ['search' => $customer->first_name . ' ' . $customer->last_name]) }}"
                                            class="text-dark">view cart</a></li>
                                            </ul>
                                        @endif
                                    </div>
                                    <!-- Default Address Section -->
                                    <div class="col-2 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Default Address</h5>
                                        @if ($defaultAddress)
                                            @include('components.address-popout', [
                                                'addresses' => [$defaultAddress],
                                                'prefix' => 'default-'
                                            ])
                                        @else
                                            <p>No default address set.</p>
                                        @endif
                                    </div>

                                    <!-- All Addresses Section -->
                                    <div class="col-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Addresses</h5>
                                        @if ($addresses && count($addresses))
                                            @include('components.address-popout', [
                                                'addresses' => $addresses,
                                                'prefix' => 'all-'
                                            ])
                                        @else
                                            <p>No addresses available.</p>
                                        @endif
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($customer->created_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($customer->updated_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            @if (auth()->user()->hasRole('Admin'))
                                <a href="{{ route('dashboard.customer.edit', $customer->id) }}"
                                    class="btn btn-outline-primary btn-md mr-3 rounded-pill px-4">
                                    <i class="fas fa-edit mr-2"></i> Edit Customer
                                </a>
                                <form action="{{ route('dashboard.customer.destroy', $customer->id) }}" method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-outline-danger btn-md rounded-pill px-4"
                                    onclick="return confirm('Are you sure you want to delete this customer?')">
                                    <i class="fas fa-trash mr-2"></i> Delete
                                    </button>
                                </form>
                            @endif
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

        .btn-outline-primary,
        .btn-outline-danger {
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

        .list-group-item {
            font-size: 1rem;
        }
    </style>
@endsection
