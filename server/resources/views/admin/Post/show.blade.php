@extends('admin.layout.master')

@section('title', 'Post Details')
@section('Posts_Show', 'active')

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
                                    {{ $post->title_en }}
                                </h2>
                                <div>
                                    <a href="{{ route('dashboard.post.index') }}"
                                        class="btn btn-light btn-sm mr-2 rounded-pill px-3" title="Back to Posts">
                                        <i class="fas fa-arrow-left mr-1"></i> Back
                                    </a>
                                    @if(auth()->user()->hasAnyRole('Admin|Expert'))
                                    <a href="{{ route('dashboard.post.create') }}"
                                        class="btn btn-light btn-sm rounded-pill px-3" title="Add PollsAdd New Post">
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
                                        <h5 class="text-muted font-weight-semibold mb-2">Title (English)</h5>
                                        <p class="text-dark">{{ $post->title_en }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Title (Arabic)</h5>
                                        <p class="text-dark">{{ $post->title_ar }}</p>
                                    </div>
                                    @if($post->image)
                                        <div class="col-12 mb-4">
                                            <h5 class="text-muted font-weight-semibold mb-2">Image</h5>
                                            <img src="{{ asset('storage/' . $post->image) }}" alt="Post Image" class="img-fluid rounded" style="max-width: 300px;">
                                        </div>
                                    @endif
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Category</h5>
                                        <p class="text-dark">{{ $post->category ? $post->category->name_ar : 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Product</h5>
                                        <p class="text-dark">{{ $post->product ? $post->product->name_ar : 'N/A' }}</p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created By</h5>
                                        <p class="text-dark">
                                            {{ $post->user ? $post->user->first_name . ' ' . $post->user->last_name : 'N/A' }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Created At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($post->created_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 col-sm-6 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Updated At</h5>
                                        <p class="text-dark">
                                            {{ \Carbon\Carbon::parse($post->updated_at)->format('M d, Y H:i') }}
                                        </p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Content (English)</h5>
                                        <p class="text-dark">{!! nl2br(e($post->content_en)) !!}</p>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <h5 class="text-muted font-weight-semibold mb-2">Content (Arabic)</h5>
                                        <p class="text-dark">{!! nl2br(e($post->content_ar)) !!}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <!-- Footer -->
                        <div class="card-footer bg-light border-top-0 p-4 d-flex justify-content-end align-items-center">
                            @if(auth()->user()->hasAnyRole('Admin|Expert'))
                            <a href="{{ route('dashboard.post.edit', $post->id) }}"
                                class="btn btn-outline-primary btn-md mr-3 rounded-pill px-4">
                                <i class="fas fa-edit mr-2"></i> Edit Post
                            </a>
                            <form action="{{ route('dashboard.post.destroy', $post->id) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-outline-danger btn-md rounded-pill px-4"
                                    onclick="return confirm('Are you sure you want to delete this post?')">
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
    </style>
@endsection
