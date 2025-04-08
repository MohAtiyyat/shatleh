@extends('admin.layout.master')

@section('title')
    Product Management
@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/customCss/form.css') }}">
@endsection

@section('content')
    <div class="product-create-page">
        <div class="container">
            <div class="header">
                <h1>Create New Product</h1>
            </div>

            <div class="form-container">
                <form id="productForm" enctype="multipart/form-data">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name_en">Name (English) *</label>
                            <input type="text" id="name_en" name="name_en" required placeholder="Enter English name">
                        </div>
                        <div class="form-group">
                            <label for="name_ar">Name (Arabic) *</label>
                            <input type="text" id="name_ar" name="name_ar" required placeholder="Enter Arabic name" dir="rtl">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="price">Price *</label>
                        <input type="text" id="price" name="price" required placeholder="Enter price (e.g., 99.99)">
                    </div>

                    <div class="form-group">
                        <label>Image *</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="image" name="image" required>
                                <label class="custom-file-label" for="image">Choose product image</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="description_en">Description (English) *</label>
                            <input type="text" id="description_en" name="description_en" required placeholder="Enter English description">
                        </div>
                        <div class="form-group">
                            <label for="description_ar">Description (Arabic) *</label>
                            <input type="text" id="description_ar" name="description_ar" required placeholder="Enter Arabic description" dir="rtl">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="status">Status *</label>
                            <select id="status" name="status" required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="availability">Availability *</label>
                            <select id="availability" name="availability" required>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="pre_order">Pre-order</option>
                            </select>
                        </div>
                    </div>

                    <div class="footer">
                        <button type="submit" class="btn btn-primary">Create Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Update file input label
        document.getElementById('image').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || 'Choose product image';
            document.querySelector('.custom-file-label').textContent = fileName;
        });

        // Form submission handler
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            console.log('Product Data:', Object.fromEntries(formData));
            alert('Product created successfully! Check console for form data.');
        });
    </script>
@endsection
