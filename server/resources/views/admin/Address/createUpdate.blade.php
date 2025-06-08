@extends('admin.layout.master')

@section('title', 'Create Address')
@section('Addresses_Show', 'active')

@section('content')
    <div class="modal fade" id="addressModal" tabindex="-1" role="dialog" aria-labelledby="addressModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addressModalLabel">Create New Address</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="addressForm" method="POST" action="{{ route('dashboard.address.store') }}">
                        @csrf

                        <!-- Address Title Field -->
                        <div class="form-group">
                            <label for="title">Address Title</label>
                            <input type="text" id="title" name="title" placeholder="Enter address title" required maxlength="255" value="{{ old('title') }}">
                            @error('title')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Country Field -->
                        <div class="form-group">
                            <label for="country_id">Country</label>
                            <select id="country_id" name="country_id" required>
                                @foreach($countries ?? [] as $value => $label)
                                    <option value="{{ $value }}" {{ old('country_id') == $value ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                            @error('country_id')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- City Field -->
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" name="city" placeholder="Enter city name" required maxlength="255" value="{{ old('city') }}">
                            @error('city')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Address Line Field -->
                        <div class="form-group">
                            <label for="address_line">Address Line</label>
                            <input type="text" id="address_line" name="address_line" placeholder="Enter address line" required maxlength="255" value="{{ old('address_line') }}">
                            @error('address_line')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Create Address</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/customCss/form.css') }}">
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1050;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        .modal.show {
            display: block;
        }
        .modal-dialog {
            margin: 1.75rem auto;
            max-width: 500px;
        }
        .modal-content {
            background-color: #fff;
            border: 1px solid rgba(0,0,0,0.2);
            border-radius: 0.3rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }
        .modal-header {
            padding: 15px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-title {
            margin: 0;
            font-size: 1.25rem;
        }
        .modal-body {
            padding: 15px;
        }
        .modal-footer {
            padding: 15px;
            border-top: 1px solid #e5e5e5;
            text-align: right;
        }
        .close {
            font-size: 1.5rem;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            opacity: 0.5;
            background: none;
            border: none;
        }
        .close:hover {
            opacity: 0.75;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }
        .text-danger {
            color: #dc3545;
            font-size: 0.875rem;
        }
        .btn {
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
        }
        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-secondary {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
    </style>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Show the modal on page load
            const modal = document.getElementById('addressModal');
            modal.classList.add('show');

            // Handle close button
            document.querySelector('.close').addEventListener('click', function () {
                modal.classList.remove('show');
                window.history.back();
            });

            // Handle clicking outside the modal to close
            window.addEventListener('click', function (event) {
                if (event.target === modal) {
                    modal.classList.remove('show');
                    window.history.back();
                }
            });
        });
    </script>
@endsection
