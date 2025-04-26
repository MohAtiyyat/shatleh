@extends('admin.layout.master')

@section('title', 'Staff Details')
@section('Staff_Show', 'active')

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
                                    {{  $record->id .'. '.$record->roles->pluck('name')[0] ?? 'N/A' }} / {{ $record->first_name . ' ' . $record->last_name  ?? 'Staff Details'  }}
                                </h2>
                                <div>
                                    <a href="{{URL::previous() }}"
                                       class="btn btn-light btn-sm mr-2 rounded-pill px-3"
                                       title="Back to Product Shops">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    <a href="{{ route('dashboard.staff.create') }}"
                                       class="btn btn-light btn-sm rounded-pill px-3"
                                       title="Add New Staff">
                                        <i class="fas fa-plus mr-1"></i> New
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Body -->
                        <div class="card-body p-5 bg-light">

                            <div class="details-wrapper">
                                <div class="row">
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Specialties</h5>
                                        <p class="h4 text-dark mb-0">
                                            {{ $record->specialties[0] ?? 'N/A' }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Address</h5>
                                        <a class="text-dark mb-0" href="{{ route('dashboard.address.show', $record->address->id) }}">{{ $record->Address->city ?? 'N/A' }}</a>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Email</h5>
                                        <p class="h4 text-dark mb-0">
                                            {{ $record->email ?? 'N/A' }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Phone Number</h5>
                                        <p class="text-dark mb-0">{{ $record->phone_number ?? 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Register date</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($record->created_at)->format('M d, Y') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Last modife date</h5>
                                        <p class="text-dark mb-0">
                                            {{ \Carbon\Carbon::parse($record->updated_at)->format('M d, Y') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            <a href="{{ route('dashboard.staff.edit', $record->id) }}"
                               class="btn btn-outline-primary btn-md mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i> Edit Staff
                            </a>
                            <form action="{{ route('dashboard.productShop.destroy', $record->id) }}"
                                  method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="btn btn-outline-danger btn-md rounded-pill px-4"
                                        onclick="return confirm('Are you sure you want to delete this product shop record?')">
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
