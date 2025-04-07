@extends('admin.layout.master')

@section('title')
    Product Details
@endsection

@section('css')
    <style>
        .product-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .card {
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .card-header {
            background-color: #f8f9fa;
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .btn-back {
            margin-right: 10px;
        }
    </style>
@endsection

@section('productsShow')
    active
@endsection

@section('title_page1')
    Dashboard
@endsection

@section('title_page2')
    Products
@endsection

@section('title_div')
    Product Details
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Product ID: 1</h5>
                        <div>
                            <a href="{{ url('/product') }}" class="btn btn-secondary btn-sm btn-back">Back to List</a>
                            <button type="button" class="btn btn-success btn-sm">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="https://via.placeholder.com/300" alt="Product Image" class="product-image">
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <span class="detail-label">Name (English):</span>
                                    <p>Sample Product</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Name (Arabic):</span>
                                    <p>منتج عينة</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Price:</span>
                                    <p>$19.99</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Status:</span>
                                    <p><span class="badge bg-success">Active</span></p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Availability:</span>
                                    <p><span class="badge bg-primary">In Stock</span></p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Description (English):</span>
                                    <p>Short description in English about this sample product.</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Description (Arabic):</span>
                                    <p>وصف قصير بالعربية عن هذا المنتج العينة.</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Created At:</span>
                                    <p>2025-04-01 10:00:00</p>
                                </div>
                                <div class="mb-3">
                                    <span class="detail-label">Updated At:</span>
                                    <p>2025-04-05 15:30:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <!-- No additional scripts needed for this static page -->
@endsection
