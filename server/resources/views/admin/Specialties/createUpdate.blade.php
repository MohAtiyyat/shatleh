@extends('admin.layout.master')

@section('title', isset($specialty) ? 'Edit Specialty' : 'Create Specialty')
@section('Specialties_Show', 'active')

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
        <h1>{{ isset($specialty) ? 'Edit Specialty' : 'Create New Specialty' }}</h1>
    </div>

    <div class="form-container">
        <form id="specialtyForm" method="POST"
              action="{{ isset($specialty) ? route('dashboard.specialties.update', $specialty->id) : route('dashboard.specialties.store') }}">
            @csrf
            @if(isset($specialty))
                @method('PUT')
            @endif

            <!-- Name (English) -->
            <div class="form-group">
                <label for="name_en">Name (English)</label>
                <input type="text" id="name_en" name="name_en" placeholder="Enter English name" required
                       value="{{ old('name_en', isset($specialty) ? $specialty->name_en : '') }}" maxlength="255">
                @error('name_en')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Name (Arabic) -->
            <div class="form-group">
                <label for="name_ar">Name (Arabic)</label>
                <input type="text" id="name_ar" name="name_ar" placeholder="Enter Arabic name" required
                       value="{{ old('name_ar', isset($specialty) ? $specialty->name_ar : '') }}" maxlength="255">
                @error('name_ar')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>

            <!-- Submit Button -->
            <div class="footer">
                <a href="{{ Route('dashboard.specialties.index') }}" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back
                </a>
                <button type="submit" class="btn btn-primary">
                    {{ isset($specialty) ? 'Update Specialty' : 'Create Specialty' }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
