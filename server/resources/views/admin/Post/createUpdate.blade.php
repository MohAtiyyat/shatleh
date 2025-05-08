@extends('admin.layout.master')

@section('title', isset($post) ? 'Edit Post' : 'Create Post')
@section('Posts_Show', 'active')

@section('css')
<link rel="stylesheet" href="{{ asset('assets/customCss/form.css') }}">
<style>
    .form-container {
        background-color: #fff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }
    .header h1 {
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }
    .form-group input[type="text"],
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .form-group textarea {
        min-height: 100px;
    }
    .custom-file {
        position: relative;
        display: inline-block;
        width: 100%;
        margin-bottom: 5px;
    }
    .custom-file-input {
        position: relative;
        z-index: 2;
        width: 100%;
        height: calc(1.5em + 0.75rem + 2px);
        opacity: 0;
    }
    .custom-file-label {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1;
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0.375rem 0.75rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
    }
    .text-danger {
        color: #dc3545;
        font-size: 80%;
        margin-top: 4px;
    }
    .footer {
        margin-top: 20px;
    }
    .btn {
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
    }
    .btn-primary {
        background-color: #007bff;
        border: none;
        color: white;
    }
    .btn-secondary {
        background-color: #6c757d;
        border: none;
        color: white;
        margin-right: 10px;
    }
    .current-image {
        margin-bottom: 15px;
    }
    .current-image img {
        max-width: 200px;
        border-radius: 5px;
    }
</style>
@endsection

@section('content')
<div class="container">
    <div class="header">
        <h1>{{ isset($post) ? 'Edit Post' : 'Create New Post' }}</h1>
    </div>

    <div class="form-container">
        <form id="postForm" enctype="multipart/form-data" method="POST"
              action="{{ isset($post) ? route('dashboard.post.update', $post->id) : route('dashboard.post.store') }}">
            @csrf
            @if(isset($post))
                @method('PUT')
            @endif

            <!-- Image -->
            <div class="form-group">
                <label for="image">Image</label>

                @if(isset($post) && $post->image)
                    <div class="current-image">
                        <img src="{{ asset('storage/' . $post->image) }}" alt="Post Image">
                    </div>
                @endif

                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="image" name="image" accept="image/jpeg,image/png,image/jpg,image/webp">
                    <label class="custom-file-label" for="image">Choose file</label>
                </div>
                <small class="form-text text-muted">Upload one image, up to 2MB (JPEG, PNG, JPG, WEBP).</small>
                @error('image')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Title (English) -->
            <div class="form-group">
                <label for="title_en">Title (English)</label>
                <input type="text" id="title_en" name="title_en" placeholder="Enter title in English" required
                       value="{{ old('title_en', isset($post) ? $post->title_en : '') }}" maxlength="255">
                @error('title_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Title (Arabic) -->
            <div class="form-group">
                <label for="title_ar">Title (Arabic)</label>
                <input type="text" id="title_ar" name="title_ar" placeholder="Enter title in Arabic" required
                       value="{{ old('title_ar', isset($post) ? $post->title_ar : '') }}" maxlength="255">
                @error('title_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Content (English) -->
            <div class="form-group">
                <label for="content_en">Content (English)</label>
                <textarea required id="content_en" name="content_en" placeholder="Enter content in English" rows="4" maxlength="5000">{{ old('content_en', isset($post) ? $post->content_en : '') }}</textarea>
                @error('content_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Content (Arabic) -->
            <div class="form-group">
                <label for="content_ar">Content (Arabic)</label>
                <textarea required id="content_ar" name="content_ar" placeholder="Enter content in Arabic" rows="4" maxlength="5000">{{ old('content_ar', isset($post) ? $post->content_ar : '') }}</textarea>
                @error('content_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Category -->
            <div class="form-group">
                <label for="category_id">Category</label>
                <select id="category_id" name="category_id">
                    <option value="">Select a category (optional)</option>
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}"
                            {{ old('category_id', isset($post) ? $post->category_id : '') == $category->id ? 'selected' : '' }}>
                            {{ $category->name_ar }}
                        </option>
                    @endforeach
                </select>
                @error('category_id')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Product -->
            <div class="form-group">
                <label for="product_id">Product</label>
                <select id="product_id" name="product_id">
                    <option value="">Select a product (optional)</option>
                    @foreach($products as $product)
                        <option value="{{ $product->id }}"
                            {{ old('product_id', isset($post) ? $post->product_id : '') == $product->id ? 'selected' : '' }}>
                            {{ $product->name_ar }}
                        </option>
                    @endforeach
                </select>
                @error('product_id')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Created By -->
            <div class="form-group">
                <label for="employee_display">Created By</label>
                <input type="text" id="employee_display" name="employee_display" disabled
                       value="{{ isset($post) ? ($post->user ? $post->user->first_name . ' ' . $post->user->last_name : 'N/A') : (auth()->user() ? auth()->user()->first_name . ' ' . auth()->user()->last_name : 'N/A') }}">
            </div>

            <!-- Submit Button -->
            <div class="footer">
                <a href="{{ url()->previous() }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </a>
                <button type="submit" class="btn btn-primary">
                    {{ isset($post) ? 'Update Post' : 'Create Post' }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // File input handling
        document.querySelectorAll('.custom-file-input').forEach(input => {
            input.addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name || 'Choose file';
                e.target.nextElementSibling.textContent = fileName;
            });
        });
    });
</script>
@endsection
