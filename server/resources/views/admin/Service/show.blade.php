@extends('admin.layout.master')

@section('title', 'Service Details')
@section('Services_Show', 'active')

@section('content')
    <div class="content py-1 item">
        <div class="">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-md-12">
                    <div class="card border-0 shadow-lg rounded-lg overflow-hidden">
                        <div class="card-header bg-gradient-success text-white p-4">
                            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                                <h2 class="mb-0 font-weight-bold text-capitalize">
                                    {{ $service->name_en ?? 'Service Details' }} / {{ $service->name_ar ?? '' }}
                                </h2>
                                <div class="d-flex flex-column flex-md-row justify-content-md-end align-items-md-center">
                                    <a href="{{ URL::previous() }}"
                                       class="btn btn-light btn-sm mb-2 mb-md-0 mr-md-2 rounded-pill px-3"
                                       title="Back to Services">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    @if(auth()->user()->hasAnyRole('Admin|Employee'))
                                    <a href="{{ route('dashboard.service.create') }}"
                                       class="btn btn-light btn-sm rounded-pill px-3"
                                       title="Add New Service">
                                        <i class="fas fa-plus mr-1"></i> New
                                    </a>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-5 bg-light">
                            <div class="row">
                                <div class="col-12 col-md-5 mb-4">
                                    @if($service->image)
                                        <div id="serviceImageCarousel" class="carousel slide" data-ride="carousel">
                                            <div class="carousel-inner">
                                                <img src="{{ asset($service->image) }}"
                                                        loading="lazy"
                                                        alt="{{ $service->name_en . ' ' . $service->name_ar }}"
                                                        class="rounded-lg shadow-sm img-fluid">
                                            </div>
                                        </div>
                                    @else
                                        <img src="https://placehold.co/350"
                                             loading="lazy"
                                             alt="{{ $service->name_en . ' ' . $service->name_ar }}"
                                             class="rounded-lg shadow-sm img-fluid">
                                    @endif
                                </div>
                                <div class="col-12 col-md-7">
                                    <div class="row">
                                        <div class="col-12 col-sm-6 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Status</h5>
                                            @php
                                                $statusMap = [
                                                    '1' => 'Active',
                                                    '0' => 'Inactive',
                                                    '2' => 'Draft'
                                                ];
                                                $status = $statusMap[$service->status] ?? 'N/A';
                                            @endphp
                                            <span class="badge badge-pill {{ $status === 'Active' ? 'badge-success' : ($status === 'Inactive' ? 'badge-danger' : 'badge-secondary') }} px-3 py-2">
                                                {{ $status }}
                                            </span>
                                        </div>
                                        <div class="col-12 col-sm-6 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Service ID</h5>
                                            <p class="text-dark mb-0">#{{ $service->id ?? 'N/A' }}</p>
                                        </div>
                                        <div class="col-12 col-sm-6 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Requested Times</h5>
                                            <p class="text-dark mb-0">{{ $requestedTimes ?? 0 }}</p>
                                        </div>
                                        <div class="col-12 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Description (English)</h5>
                                            <p class="text-dark">{{ $service->description_en ?? 'No description available' }}</p>
                                        </div>
                                        <div class="col-12 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Description (Arabic)</h5>
                                            <p class="text-dark text-right" dir="rtl">
                                                {{ $service->description_ar ?? 'لا يوجد وصف متاح' }}
                                            </p>
                                        </div>
                                        <div class="col-12 col-sm-6 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                            <p class="text-dark mb-0">
                                                {{ \Carbon\Carbon::parse($service->created_at)->format('M d, Y H:i') }}
                                            </p>
                                        </div>
                                        <div class="col-12 col-sm-6 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                            <p class="text-dark mb-0">
                                                {{ \Carbon\Carbon::parse($service->updated_at)->format('M d, Y H:i') }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @if(auth()->user()->hasAnyRole('Admin|Employee'))
                        <div class="card-footer bg-light border-top-0 p-4 d-flex flex-column flex-md-row justify-content-end align-items-md-center">
                            <a href="{{ route('dashboard.service.edit', $service->id) }}"
                               class="btn btn-outline-primary btn-sm mb-2 mb-md-0 mr-md-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i> Edit Service
                            </a>
                            <button type="button"
                                    class="btn btn-outline-danger btn-sm rounded-pill px-4"
                                    data-toggle="modal"
                                    data-target="#deleteServiceModal">
                                <i class="fas fa-trash mr-2"></i> Delete
                            </button>
                        </div>
                        <div class="modal fade" id="deleteServiceModal" tabindex="-1" aria-labelledby="deleteServiceModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="deleteServiceModalLabel">Confirm Deletion</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        Are you sure you want to delete the service "{{ $service->name_en ?? 'this service' }}"? This action cannot be undone.
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary rounded-pill px-3" data-dismiss="modal">Cancel</button>
                                        <form action="{{ route('dashboard.service.destroy', $service->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger rounded-pill px-3">Delete</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endif
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
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            padding: 0.5rem 1rem;
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
            padding: 2rem !important;
        }
        .card-header h2 {
            font-size: clamp(1.5rem, 3vw, 1.8rem);
        }
        h5.text-muted {
            font-size: clamp(0.9rem, 2vw, 1rem);
            color: #6c757d !important;
        }
        p.text-dark {
            font-size: clamp(0.9rem, 2.5vw, 1rem);
            color: #343a40 !important;
        }
        .carousel-item img {
            max-height: 350px;
            object-fit: cover;
            width: 100%;
            transition: all 0.3s ease;
        }
        @media (max-width: 767.98px) {
            .card-body {
                padding: 1.5rem !important;
            }
            .carousel-item img {
                max-height: 250px;
            }
            .card-header h2 {
                font-size: clamp(1.2rem, 2.5vw, 1.4rem);
            }
        }
        @media (max-width: 575.98px) {
            .card-body {
                padding: 1rem !important;
            }
            .carousel-item img {
                max-height: 200px;
            }
        }
    </style>
@endsection
