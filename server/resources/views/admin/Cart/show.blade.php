@extends('admin.layout.master')

@section('title', 'Cart Details')
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
                                    {{ $user->first_name }} {{ $user->last_name }} Cart
                                </h2>
                                <div>
                                    <a href="{{ URL::previous() }}"
                                        class="btn btn-light btn-sm mr-2 rounded-pill px-3" title="Back to All Carts">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">
                            <!-- Details Section -->
                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Email</h5>
                                        <p class="text-dark">{{ $user->email }}</p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Cart Items</h5>
                                        @if ($cart->isEmpty())
                                            <p class="text-dark">No items in cart</p>
                                        @else
                                            <ul class="list-group">
                                                @foreach ($cart as $item)
                                                    <li class="list-group-item">
                                                        <h3><a href="{{ route('dashboard.product.show', $item->product->id) }}">{{ $item->product->name_en ?? 'N/A' }}</a></h3>
                                                        <h5 class="text-muted">Total Price: {{ $item->product->price * $item->quantity / 100 }} JOD</h5>
                                                        <p style="justify-self: end;">quantity: {{ $item->quantity }}</p>
                                                     </li>
                                                @endforeach
                                            </ul>
                                        @endif
                                    </div>
                                    
                                    
                                </div>
                            </div>
                            <div class="clearfix"></div>
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
