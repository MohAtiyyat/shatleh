@extends('admin.layout.master')

@section('title', 'Service Request Details')
@section('ServiceRequests_Show', 'active')

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
                                    Service Request #{{ $serviceRequest->id }}
                                </h2>
                                <div>
                                    <a href="{{ URL::previous() }}"
                                       class="btn btn-light btn-sm rounded-pill px-3 shadow-sm hover-scale"
                                       title="Back to Service Requests">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">
                            <!-- Image Section -->
                            <div class="image-wrapper float-left mr-4 mb-4">
                                @if($serviceRequest->image)
                                    <img src="{{ asset('storage/' . $serviceRequest->image) }}"
                                         alt="Service Request #{{ $serviceRequest->id }}"
                                         class="rounded-lg shadow-sm"
                                         style="max-height: 350px; object-fit: cover; width: 100%; max-width: 350px;">
                                @else
                                    <img src="https://placehold.co/350"
                                         alt="Service Request #{{ $serviceRequest->id }}"
                                         class="rounded-lg shadow-sm"
                                         style="max-height: 350px; object-fit: cover; width: 100%; max-width: 350px;">
                                @endif
                            </div>
                            <!-- Details Section -->
                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Customer</h5>
                                        <p class="text-dark mb-0">
                                            <a href="{{ route('dashboard.customer.index', ['search' => $serviceRequest->customer->email]) }}">
                                                {{ $serviceRequest->customer?->first_name }} {{ $serviceRequest->customer?->last_name }}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Service</h5>
                                        <p class="text-dark mb-0">
                                            <a href="{{ route('dashboard.service', ['search' => $serviceRequest->service->name]) }}">
                                                {{ $serviceRequest->service?->name_en }}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Customer Email</h5>
                                        <p class="text-dark mb-0">
                                            <a href="mailto:{{ $serviceRequest->customer?->email }}">
                                                {{ $serviceRequest->customer?->email ?? 'N/A' }}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Customer Phone</h5>
                                        <p class="text-dark mb-0">
                                           {{$serviceRequest->customer?->phone_number}}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Status</h5>
                                        <span class="badge badge-pill {{ $serviceRequest->status === 'completed' ? 'badge-success' : ($serviceRequest->status === 'pending' ? 'badge-warning' : 'badge-primary') }} px-3 py-2">
                                            {{ ucfirst($serviceRequest->status) }}
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Assigned Expert</h5>
                                        <p class="text-dark mb-0">
                                            {{ $serviceRequest->expert ? $serviceRequest->expert->first_name . ' ' . $serviceRequest->expert->last_name : 'Not Assigned' }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Managed By</h5>
                                        <p class="text-dark mb-0">
                                            <a href="{{ route('dashboard.staff', ['search' => $serviceRequest->employee?->email]) }}">
                                                {{ $serviceRequest->employee?->first_name }} {{ $serviceRequest->employee?->last_name }}
                                            </a>
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Service Request ID</h5>
                                        <p class="text-dark mb-0">#{{ $serviceRequest->id }}</p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Address</h5>
                                        @include('/components/address-popout', [
                                            'addresses' => [$serviceRequest->address]
                                        ])
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Details</h5>
                                        <p class="text-dark">{{ $serviceRequest->details ?? 'No details provided' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($serviceRequest->created_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($serviceRequest->updated_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <form method="POST" action="{{ route('dashboard.service-request.assign', $serviceRequest->id) }}" class="mr-3">
                                @csrf
                                <div class="input-group">
                                    <select name="expert_id" class="form-select shadow-sm custom-select">
                                        <option value="">Assign Expert</option>
                                        @foreach($experts as $id => $name)
                                            <option value="{{ $id }}" {{ $serviceRequest->expert && $serviceRequest->expert->id == $id ? 'selected' : '' }}>
                                                {{ $name }}
                                            </option>
                                        @endforeach
                                    </select>
                                    <div "'input-group-append">
                                        <button type="submit" class="btn btn-outline-primary btn-md rounded-pill px-4 shadow-sm hover-scale">
                                            <i class="fas fa-user-plus mr-2"></i> Assign
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <form method="POST" action="{{ route('dashboard.service-request.update', $serviceRequest->id) }}">
                                @csrf
                                @method('PATCH')
                                <div class="input-group">
                                    <select name="status" class="form-select shadow-sm custom-select">
                                        <option value="pending" {{ $serviceRequest->status === 'pending' ? 'selected' : '' }}>Pending</option>
                                        <option value="inProgress" {{ $serviceRequest->status === 'inProgress' ? 'selected' : '' }}>In Progress</option>
                                        <option value="completed" {{ $serviceRequest->status === 'completed' ? 'selected' : '' }}>Completed</option>
                                    </select>
                                    <div class="input-group-append">
                                        <button type="submit" class="btn btn-outline-primary btn-md rounded-pill px-4 shadow-sm hover-scale">
                                            <i class="fas fa-sync-alt mr-2"></i> Update Status
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Include Tailwind CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

    <style>
        .bg-gradient-success {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        }
        .btn-outline-primary {
            border: 2px solid #007bff;
            color: #007bff;
            background-color: transparent;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        .btn-outline-primary:hover {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
            transform: translateY(-2px);
        }
        .btn-outline-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
            z-index: -1;
        }
        .btn-outline-primary:hover::before {
            left: 100%;
        }
        .hover-scale {
            transition: transform 0.2s ease;
        }
        .hover-scale:hover {
            transform: scale(1.05);
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
        .badge-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .badge-primary {
            background-color: #007bff;
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
        /* Enhanced Dropdown Styles */
        .custom-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23343a40' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E") no-repeat right 0.75rem center/12px 12px;
            @apply border border-gray-300 rounded-l-lg bg-white text-gray-700 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-48;
        }
        .custom-select:hover {
            @apply border-blue-400 bg-gray-50;
        }
        .custom-select:focus {
            @apply shadow-lg transform scale-105;
        }
        .input-group-append .btn {
            @apply rounded-r-lg;
        }
    </style>
@endsection
