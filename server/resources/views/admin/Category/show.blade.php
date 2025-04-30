@extends('admin.layout.master')

@section('title', 'Category Details')
@section('Categories_Show', 'active')

@section('content')
<div class="container mt-4">
    <div class="card">
        <div class="card-header bg-primary text-white">
            <h4>Category Details</h4>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label><strong>ID:</strong></label>
                    <p>{{ $category->id }}</p>
                </div>
                <div class="col-md-6">
                    <p>
                        @if ($category->parent_id)
                            <label><strong>Parent Category:</strong></label>
                            <a href="{{ route('dashboard.category.show', $category->parent_id) }}">
                                {{ $category->parent?->name_ar ?? 'Parent ID: ' . $category->parent_id }}
                            </a>
                        @else
                            <label><strong>SubCategories:</strong></label>
                            <x-subcategory-popout
                                :subcategories="$subcategories"
                                :category-id="$category->id"
                                title="Subcategories of {{ $category->name_ar }}"
                            />
                        @endif
                    </p>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label><strong>Name (EN):</strong></label>
                    <p>{{ $category->name_en }}</p>
                </div>
                <div class="col-md-6">
                    <label><strong>Name (AR):</strong></label>
                    <p>{{ $category->name_ar }}</p>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label><strong>Description (EN):</strong></label>
                    <p>{{ $category->description_en }}</p>
                </div>
                <div class="col-md-6">
                    <label><strong>Description (AR):</strong></label>
                    <p>{{ $category->description_ar }}</p>
                </div>
            </div>

            @if ($category->image)
            <div class="mb-3">
                <label><strong>Image:</strong></label><br>
                <img src="{{ asset('storage/' . $category->image) }}" class="img-thumbnail" style="max-width: 300px;" alt="Category Image">
            </div>
            @endif

            <div class="row mb-3">
                <div class="col-md-6">
                    <label><strong>Created At:</strong></label>
                    <p>{{ $category->created_at?->format('Y-m-d H:i') }}</p>
                </div>
                <div class="col-md-6">
                    <label><strong>Updated At:</strong></label>
                    <p>{{ $category->updated_at?->format('Y-m-d H:i') }}</p>
                </div>
            </div>

            <div class="mt-4">
                <a href="{{ route('dashboard.category.create') }}" class="btn btn-success mr-2">
                    <i class="fas fa-plus"></i> Create New
                </a>
                <a href="{{ route('dashboard.category.edit', $category->id) }}" class="btn btn-primary mr-2">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <form action="{{ route('dashboard.category.destroy', $category->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this category?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger mr-2">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </form>
                <a href="{{ url()->previous() }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
