@extends('admin.layout.master')

@section('title', isset($item) ? 'Edit Product' : 'Create Product')
@section('Products_Show', 'active')

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
    .form-group input[type="number"],
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-sizing: border-box;
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
    .btn-danger {
        background-color: #dc3545;
        border: none;
        color: white;
    }
    .image-preview-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
    }
    .image-preview {
        position: relative;
        width: 150px;
        text-align: center;
    }
    .image-preview img {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        border: 1px solid #ddd;
    }
    .image-preview .delete-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
    }
    .image-preview p {
        margin: 5px 0 0;
        font-size: 12px;
        word-break: break-all;
    }
    .new-image-preview {
        border: 2px dashed #007bff;
        padding: 5px;
        background: #f8f9fa;
    }
    .category-checkboxes {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
    }
    .subcategory-checkboxes {
        padding-left: 20px;
        margin-top: 5px;
    }
    .category-checkboxes label {
        display: block;
        margin-bottom: 5px;
        cursor: pointer;
        font-size: 14px;
    }
    .category-checkboxes input[type="checkbox"] {
        margin-right: 8px;
        vertical-align: middle;
    }
</style>
@endsection

@section('content')
<div class="container">
    <div class="header">
        <h1>{{ isset($item) ? 'Edit Product' : 'Create New Product' }}</h1>
    </div>

    <div class="form-container">
        <form id="productForm" enctype="multipart/form-data" method="POST"
              action="{{ isset($item) ? route('dashboard.product.update', $item->id) : route('dashboard.product.store') }}">
            @csrf
            @if(isset($item))
                @method('PUT')
            @endif

            <!-- Name (English) -->
            <div class="form-group">
                <label for="name_en">Name (English)</label>
                <input type="text" id="name_en" name="name_en" placeholder="Enter English name" required
                       value="{{ old('name_en', isset($item) ? $item->name_en : '') }}" maxlength="255">
                @error('name_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Name (Arabic) -->
            <div class="form-group">
                <label for="name_ar">Name (Arabic)</label>
                <input type="text" id="name_ar" name="name_ar" placeholder="Enter Arabic name" required
                       value="{{ old('name_ar', isset($item) ? $item->name_ar : '') }}" maxlength="255" dir="rtl">
                @error('name_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Price -->
            <div class="form-group">
                <label for="price">Price</label>
                <input type="number" id="price" step="0.01" name="price" placeholder="Enter price" min="0" required
                       value="{{ old('price', isset($item) ? $item->price : '') }}">
                @error('price')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Images -->
            <div class="form-group">
                <label for="images">Images</label>
                @if(isset($item) && is_array($item->image) && !empty($item->image))
                    <div class="image-preview-container">
                        @foreach($item->image as $index => $image)
                            <div class="image-preview" data-index="{{ $index }}">
                                <img src="{{ $image }}" alt="Current Image">
                                <button type="button" class="delete-btn" onclick="deleteImage({{ $index }})">×</button>
                                <p>{{ basename($image) }}</p>
                                <input type="hidden" name="existing_images[]" value="{{ $image }}" data-index="{{ $index }}">
                            </div>
                        @endforeach
                    </div>
                @endif
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="images" name="images[]" accept="image/jpeg,image/png,image/jpg"
                           multiple {{ isset($item) ? '' : 'required' }}>
                    <label class="custom-file-label" for="images">Choose images</label>
                </div>
                <small class="form-text text-muted">Upload up to 5 images, each up to 2MB (JPEG, PNG, JPG).</small>
                <div class="image-preview-container" id="new-images-preview"></div>
                @error('images.*')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Categories -->
            <div class="form-group">
                <label for="categories">Categories <span class="text-danger">*</span></label>
                <div class="category-checkboxes">
                    @php
                        $mainCategories = $categories->whereNull('parent_id');
                        $selectedCategoryIds = isset($item) && $item->categories ? $item->categories->pluck('id')->toArray() : old('categories', []);
                    @endphp
                    @foreach($mainCategories as $mainCategory)
                        <div>
                            <label for="main-category-{{ $mainCategory->id }}">
                                <input type="checkbox" 
                                       id="main-category-{{ $mainCategory->id }}"
                                       name="categories[]" 
                                       value="{{ $mainCategory->id }}" 
                                       class="main-category-checkbox"
                                       data-category-id="{{ $mainCategory->id }}"
                                       {{ in_array($mainCategory->id, $selectedCategoryIds) ? 'checked' : '' }}>
                                {{ $mainCategory->name_ar }} / {{ $mainCategory->name_en }}
                            </label>
                            <div class="subcategory-checkboxes" id="subcategories-{{ $mainCategory->id }}"
                                 style="display: {{ in_array($mainCategory->id, $selectedCategoryIds) ? 'block' : 'none' }};">
                                @php
                                    $subCategories = $categories->where('parent_id', $mainCategory->id);
                                @endphp
                                @foreach($subCategories as $subCategory)
                                    <label for="sub-category-{{ $subCategory->id }}">
                                        <input type="checkbox" 
                                               id="sub-category-{{ $subCategory->id }}"
                                               name="categories[]" 
                                               value="{{ $subCategory->id }}"
                                               {{ in_array($subCategory->id, $selectedCategoryIds) ? 'checked' : '' }}>
                                        {{ $subCategory->name_ar }} / {{ $subCategory->name_en }}
                                    </label>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
                @error('categories')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Description (English) -->
            <div class="form-group">
                <label for="description_en">Description (English)</label>
                <textarea id="description_en" name="description_en" placeholder="Enter English description" rows="4" required>{{ old('description_en', isset($item) ? $item->description_en : '') }}</textarea>
                @error('description_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Description (Arabic) -->
            <div class="form-group">
                <label for="description_ar">Description (Arabic)</label>
                <textarea id="description_ar" name="description_ar" placeholder="Enter Arabic description" rows="4" required dir="rtl">{{ old('description_ar', isset($item) ? $item->description_ar : '') }}</textarea>
                @error('description_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Status -->
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status" required>
                    <option value="active" {{ old('status', isset($item) ? $item->status : '') == '1' ? 'selected' : '' }}>Active</option>
                    <option value="inactive" {{ old('status', isset($item) ? $item->status : '') == '0' ? 'selected' : '' }}>Inactive</option>
                </select>
                @error('status')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Availability -->
            <div class="form-group">
                <label for="availability">Availability</label>
                <select id="availability" name="availability" required>
                    <option value="1" {{ old('availability', isset($item) ? $item->availability : '') == '1' ? 'selected' : '' }}>In Stock</option>
                    <option value="0" {{ old('availability', isset($item) ? $item->availability : '') == '0' ? 'selected' : '' }}>Out of Stock</option>
                </select>
                @error('availability')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Submit Button -->
            <div class="footer">
                <a href="{{ route('dashboard.product') }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Products
                </a>
                <button type="submit" class="btn btn-primary">
                    {{ isset($item) ? 'Update Product' : 'Create Product' }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // File input handling for new image previews
        const fileInput = document.getElementById('images');
        const previewContainer = document.getElementById('new-images-preview');
        const label = fileInput.nextElementSibling;

        fileInput.addEventListener('change', function(e) {
            previewContainer.innerHTML = ''; // Clear previous previews
            const files = e.target.files;
            label.textContent = files.length > 0 ? `${files.length} file(s) selected` : 'Choose images';

            Array.from(files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const div = document.createElement('div');
                        div.className = 'image-preview new-image-preview';
                        div.innerHTML = `
                            <img src="${e.target.result}" alt="New Image">
                            <p>${file.name}</p>
                        `;
                        previewContainer.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Delete existing image
        window.deleteImage = function(index) {
            if (confirm('Are you sure you want to delete this image?')) {
                const container = document.querySelector(`.image-preview[data-index="${index}"]`);
                const hiddenInput = document.querySelector(`input[name="existing_images[]"][data-index="${index}"]`);
                if (container) {
                    container.remove();
                }
                if (hiddenInput) {
                    hiddenInput.remove();
                }
            }
        };

        // Initialize subcategory visibility for pre-checked main categories
        document.querySelectorAll('.main-category-checkbox').forEach(checkbox => {
            const subContainer = document.getElementById(`subcategories-${checkbox.dataset.categoryId}`);
            if (subContainer) {
                subContainer.style.display = checkbox.checked ? 'block' : 'none';
            }

            // Toggle subcategories on change
            checkbox.addEventListener('change', function () {
                if (subContainer) {
                    subContainer.style.display = this.checked ? 'block' : 'none';
                }
            });
        });

        // Client-side validation for categories
        document.getElementById('productForm').addEventListener('submit', function (e) {
            const checkedCategories = document.querySelectorAll('input[name="categories[]"]:checked');
            if (checkedCategories.length === 0) {
                e.preventDefault();
                alert('Please select at least one category.');
                document.querySelector('.category-checkboxes').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
</script>
@endsection 