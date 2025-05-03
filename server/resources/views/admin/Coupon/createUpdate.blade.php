@extends('admin.layout.master')

@section('title', isset($coupon) ? 'Edit Coupon' : 'Create Coupon')
@section('Coupon_Show', 'active')

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
    .form-group input[type="date"],
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
</style>
@endsection

@section('content')
<div class="container">
    <div class="header">
        <h1>{{ isset($coupon) ? 'Edit Coupon' : 'Create New Coupon' }}</h1>
    </div>

    <div class="form-container">
        <form id="couponForm" method="POST"
              action="{{ isset($coupon) ? route('dashboard.coupon.update', $coupon->id) : route('dashboard.coupon.store') }}">
            @csrf
            @if(isset($coupon))
                @method('PUT')
            @endif

            <!-- Amount -->
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" id="amount" name="amount" placeholder="Enter amount" step="1" required
                       value="{{ old('amount', isset($coupon) ? $coupon->amount : '') }}">
                @error('amount')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Code -->
            <div class="form-group">
                <label for="code">Code</label>
                <input type="text" id="code" name="code" placeholder="Enter code" required
                       value="{{ old('code', isset($coupon) ? $coupon->code : '') }}" maxlength="50">
                @error('code')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Title -->
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" placeholder="Enter title" required
                       value="{{ old('title', isset($coupon) ? $coupon->title : '') }}" maxlength="255">
                @error('title')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Is Active -->
            <div class="form-group">
                <label for="is_active">Is Active</label>
                <select id="is_active" name="is_active" required>
                    <option value="1" {{ old('is_active', isset($coupon) ? ($coupon->is_active ? 'selected' : '') : '') }}>Yes</option>
                    <option value="0" {{ old('is_active', isset($coupon) ? (!$coupon->is_active ? 'selected' : '') : '') }}>No</option>
                </select>
                @error('is_active')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Expiry Date -->
            <div class="form-group">
                <label for="expire_date">Expiry Date</label>
                <input type="date" id="expire_date" name="expire_date" required
                       value="{{ old('expire_date', isset($coupon) ? $coupon->expire_date : '') }}">
                @error('expire_date')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Quantity -->
            <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" required
                       value="{{ old('quantity', isset($coupon) ? $coupon->quantity : '') }}" min="0">
                @error('quantity')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Country -->
            <div class="form-group">
                <label for="country_id">Country</label>
                <select id="country_id" name="country_id" required>
                    @foreach ($countries as $country)
                        <option value="{{ $country->id }}" {{ old('country_id', isset($coupon) ? ($coupon->country_id == $country->id ? 'selected' : '') : '') }}>
                            {{ $country->name_en }}
                        </option>
                    @endforeach
                </select>
                @error('country_id')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Used Count (Read-only) -->
            @if(isset($coupon))
                <div class="form-group">
                    <label for="used_count">Used Count</label>
                    <input type="number" id="used_count" name="used_count" readonly
                           value="{{ $coupon->used_count ?? 0 }}">
                </div>
            @endif

            <!-- Submit Button -->
            <div class="footer">
                <a href="{{ url()->previous() }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </a>
                <button type="submit" class="btn btn-primary">
                    {{ isset($coupon) ? 'Update Coupon' : 'Create Coupon' }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
