@extends('admin.layout.master')

@section('title', 'Order Details')
@section('Order_Show', 'active')

@section('content')
    <div class="content py-1 item">
        <div class="col-lg-10 col-md-12">
            <div class="card border-0 shadow-lg rounded-lg overflow-hidden">
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
                <div class="card-body p-5 bg-light">
                    <div class="row">
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Customer Name</h5>
                            <p class="text-dark font-weight-semibold">{{ $order->customer->user->first_name }} {{ $order->customer->user->last_name }}</p>
                        </div>
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Recipient Name</h5>
                            <p class="text-dark">{{ $order->first_name }} {{ $order->last_name }}</p>
                        </div>
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Recipient Phone</h5>
                            <p class="text-dark">{{ $order->recipient_phone }}</p>
                        </div>
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Status</h5>
                            <span class="badge badge-pill {{ $order->status == 'delivered' ? 'badge-success' : ($order->status == 'cancelled' ? 'badge-danger' : 'badge-warning') }} px-3 py-2">
                                {{ ucfirst($order->status) }}
                            </span>
                        </div>
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Payment Info</h5>
                            @include('admin.Order.payment-popout', ['payment' => $order->payment])
                        </div>
                        <div class="col-12 col-sm-6 mb-4">
                            <h5 class="text-muted font-weight-semibold mb-2">Address</h5>
                            @include('/components/address-popout', ['addresses' => [$order->address]])
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

