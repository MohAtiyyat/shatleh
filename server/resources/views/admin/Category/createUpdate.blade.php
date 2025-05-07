@extends('admin.layout.master')

@section('title', isset($category) ? 'Edit Category' : 'Create Category')
@section('Categories_Show', 'active')

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
    #parent_id_container {
        display: none;
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
        <h1>{{ isset($category) ? 'Edit Category' : 'Create New Category' }}</h1>
    </div>

    <div class="form-container">
        <form id="categoryForm" enctype="multipart/form-data" method="POST"
              action="{{ isset($category) ? route('dashboard.category.update', $category->id) : route('dashboard.category.store') }}">
            @csrf
            @if(isset($category))
                @method('PUT')
            @endif

            <!-- Category Type -->
            <div class="form-group">
                <label for="category_type">Category Type</label>
                <select id="category_type" name="category_type" required>
                    <option value="main" {{ old('category_type', isset($category) && $category->parent_id === null ? 'selected' : '') }}>Main Category</option>
                    <option value="sub" {{ old('category_type', isset($category) && $category->parent_id !== null ? 'selected' : '') }}>Subcategory</option>
                </select>
                @error('category_type')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Parent Category (shown conditionally) -->
            <div class="form-group" id="parent_id_container">
                <label for="parent_id">Parent Category</label>
                <select id="parent_id" name="parent_id">
                    <option value="">Select Parent Category</option>
                    @foreach($parents as $parent)
                        <option value="{{ $parent->id }}"
                            {{ old('parent_id', isset($category) ? $category->parent_id : '') == $parent->id ? 'selected' : '' }}>
                            {{ $parent->name_ar }}
                        </option>
                    @endforeach
                </select>
                @error('parent_id')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Name (English) -->
            <div class="form-group">
                <label for="name_en">Name (English)</label>
                <input type="text" id="name_en" name="name_en" placeholder="Enter English name" required
                       value="{{ old('name_en', isset($category) ? $category->name_en : '') }}" maxlength="255">
                @error('name_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Name (Arabic) -->
            <div class="form-group">
                <label for="name_ar">Name (Arabic)</label>
                <input type="text" id="name_ar" name="name_ar" placeholder="Enter Arabic name" required
                       value="{{ old('name_ar', isset($category) ? $category->name_ar : '') }}" maxlength="255">
                @error('name_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Description (English) -->
            <div class="form-group">
                <label for="description_en">Description (English)</label>
                <textarea id="description_en" name="description_en" placeholder="Enter English description" rows="4">{{ old('description_en', isset($category) ? $category->description_en : '') }}</textarea>
                @error('description_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Description (Arabic) -->
            <div class="form-group">
                <label for="description_ar">Description (Arabic)</label>
                <textarea id="description_ar" name="description_ar" placeholder="Enter Arabic description" rows="4">{{ old('description_ar', isset($category) ? $category->description_ar : '') }}</textarea>
                @error('description_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Image -->
            <div class="form-group">
                <label for="image">Image</label>

                @if(isset($category) && $category->image)
                    <div class="current-image">
                        <img src="{{ asset('storage/' . $category->image) }}" alt="Category Image">
                    </div>
                @endif

                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="image" name="image" accept="image/*">
                    <label class="custom-file-label" for="image">Choose file</label>
                </div>
                <small class="form-text text-muted">Upload one image, up to 2MB (JPEG, PNG, JPG).</small>
                @error('image')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Submit Button -->
            <div class="footer">
                <a href="{{ url()->previous() }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </a>
                <button type="submit" class="btn btn-primary">
                    {{ isset($category) ? 'Update Category' : 'Create Category' }}
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

        // Category type handling
        const categoryTypeSelect = document.getElementById('category_type');
        const parentContainer = document.getElementById('parent_id_container');
        const parentSelect = document.getElementById('parent_id');

        function toggleParentCategory() {
            if (categoryTypeSelect.value === 'sub') {
                parentContainer.style.display = 'block';
                parentSelect.setAttribute('required', true);
            } else {
                parentContainer.style.display = 'none';
                parentSelect.removeAttribute('required');
                parentSelect.value = '';
            }
        }

        categoryTypeSelect.addEventListener('change', toggleParentCategory);

        // Initialize on page load
        toggleParentCategory();
    });
</script>
@endsection
