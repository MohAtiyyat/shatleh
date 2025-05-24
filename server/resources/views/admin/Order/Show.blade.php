@extends('admin.layout.master')

@section('title', 'Order Details')
@section('Order_Show', 'active')

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
                                Order #{{ $order->id }} Details
                            </h2>
                            <div>
                                <a href="{{ URL::previous() }}"
                                   class="btn btn-light btn-sm mr-2 rounded-pill px-3" title="Back to All Orders">
                                    <i class="fas fa-arrow-left mr-1"></i> Back
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Body -->
                    <div class="card-body p-5 bg-light">
                        <div class="row">
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Customer Name</h5>
                                <p class="text-dark font-weight-semibold">{{ $order->customer->first_name }} {{ $order->customer->last_name }}</p>
                            </div>
                            @if($order->is_gift)
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Recipient Name</h5>
                                <p class="text-dark">{{ $order->first_name }} {{ $order->last_name }}</p>
                            </div>
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Recipient Phone</h5>
                                <p class="text-dark">{{ $order->phone_number }}</p>
                            </div>
                            @endif
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Status</h5>
                                <span class="badge badge-pill {{ $order->status == 'delivered' ? 'badge-success' : ($order->status == 'cancelled' ? 'badge-danger' : 'badge-warning') }} px-3 py-2">
                                    {{ ucfirst($order->status) }}
                                </span>
                            </div>
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Payment Info</h5>
                                @if($order->payment)
                                @include('admin.Order.payment-popout', ['payment' => $order->payment])
                                @else
                                    <p class="text-dark">No payment information available.</p>
                                @endif
                            </div>
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Address</h5>
                                @if ($order->address)
                                    @include('/components/address-popout', [
                                        'addresses' => [
                                            [
                                                'id' => $order->address->id,
                                                'title' => $order->address->city,
                                                'country' => $order->address->country ?? 'N/A',
                                                'city' => $order->address->city ?? 'N/A',
                                                'address_line' => $order->address->address_line ?? 'N/A'
                                            ]
                                        ]
                                    ])
                                @else
                                    N/A
                                @endif
                            </div>
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                <p class="text-dark">
                                    {{ \Carbon\Carbon::parse($order->created_at)->format('M d, Y H:i') }}
                                </p>
                            </div>
                            <div class="col-12 col-sm-6 mb-4">
                                <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                <p class="text-dark">
                                    {{ \Carbon\Carbon::parse($order->updated_at)->format('M d, Y H:i') }}
                                </p>
                            </div>
                        </div>
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
    .badge-warning {
        background-color: #ffc107;
        color: #212529;
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
