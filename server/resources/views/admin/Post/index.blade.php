@extends('admin.layout.master')

@section('title', 'Post Management')
@section('Posts_Show', 'active')

@section('content')
<style>
    .card {
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        transition: transform 0.2s;
    }
    .card-header {
        background: linear-gradient(90deg, #4e73df, #224abe);
        color: white;
        border-radius: 10px 10px 0 0;
        padding: 1.5rem;
    }
    .btn-primary {
        background-color: #4e73df;
        border-color: #4e73df;
        transition: background-color 0.3s;
    }
    .btn-primary:hover {
        background-color: #2e59d9;
        border-color: #2e59d9;
    }
    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    .table th, .table td {
        vertical-align: middle;
    }
    .table-hover tbody tr:hover {
        background-color: #f8f9fa;
    }
    .dropdown-menu {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .search-form .input-group {
        max-width: 400px;
    }
    .search-form .form-control {
        border-radius: 20px 0 0 20px;
    }
    .search-form .btn {
        border-radius: 0 20px 20px 0;
    }
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
</style>

<div class="container-fluid py-4">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Post Management</h5>
        </div>
        <div class="card-body">
            <!-- Search Form and Create Button -->
            <div class="header-container mb-4">
                <div class="search-form">
                    <form action="{{ route('dashboard.post.index') }}" method="GET" class="input-group">
                        <input type="text" name="search" class="form-control" placeholder="Search by title..." value="{{ request('search') }}">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                <a href="{{ route('dashboard.post.create') }}" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i> Create New Post
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>
                                <a href="{{ request()->fullUrlWithQuery(['sort' => 'id', 'direction' => request('sort') === 'id' && request('direction') === 'asc' ? 'desc' : 'asc', 'search' => request('search')]) }}">
                                    ID
                                    @if(request('sort') === 'id')
                                        <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }}"></i>
                                    @else
                                        <i class="fas fa-sort"></i>
                                    @endif
                                </a>
                            </th>
                            <th>
                                <a href="{{ request()->fullUrlWithQuery(['sort' => 'title_en', 'direction' => request('sort') === 'title_en' && request('direction') === 'asc' ? 'desc' : 'asc', 'search' => request('search')]) }}">
                                    Title (EN)
                                    @if(request('sort') === 'title_en')
                                        <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }}"></i>
                                    @else
                                        <i class="fas fa-sort"></i>
                                    @endif
                                </a>
                            </th>
                            <th>
                                <a href="{{ request()->fullUrlWithQuery(['sort' => 'title_ar', 'direction' => request('sort') === 'title_ar' && request('direction') === 'asc' ? 'desc' : 'asc', 'search' => request('search')]) }}">
                                    Title (AR)
                                    @if(request('sort') === 'title_ar')
                                        <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }}"></i>
                                    @else
                                        <i class="fas fa-sort"></i>
                                    @endif
                                </a>
                            </th>
                            <th>Category</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>
                                <a href="{{ request()->fullUrlWithQuery(['sort' => 'created_at', 'direction' => request('sort') === 'created_at' && request('direction') === 'asc' ? 'desc' : 'asc', 'search' => request('search')]) }}">
                                    Created At
                                    @if(request('sort') === 'created_at')
                                        <i class="fas fa-sort-{{ request('direction') === 'asc' ? 'up' : 'down' }}"></i>
                                    @else
                                        <i class="fas fa-sort"></i>
                                    @endif
                                </a>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($posts as $post)
                            <tr>
                                <td>{{ $post->id }}</td>
                                <td>{{ Str::limit($post->title_en, 30) }}</td>
                                <td>{{ Str::limit($post->title_ar, 30) }}</td>
                                <td>{{ $post->category ? $post->category->name_ar : 'N/A' }}</td>
                                <td>{{ $post->user ? $post->user->first_name . ' ' . $post->user->last_name : 'N/A' }}</td>
                                <td>{{ $post->product ? $post->product->name_ar : 'N/A' }}</td>
                                <td>{{ $post->created_at->format('Y-m-d H:i') }}</td>
                                <td>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="{{ route('dashboard.post.edit', $post->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                            <li><a class="dropdown-item" href="{{ route('dashboard.post.show', $post->id) }}"><i class="fas fa-eye"></i> Show</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <form action="{{ route('dashboard.post.destroy', $post->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this post?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="text-center">No posts found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if($posts->hasPages())
                <div class="d-flex justify-content-center">
                    {{ $posts->appends(request()->query())->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
