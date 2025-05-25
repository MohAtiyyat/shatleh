@extends('admin.layout.master')

@section('title', isset($shop) ? 'Edit Shop' : 'Create Shop')
@section('Shops_Show', 'active')

@section('content')
    <div class="management-form-page">
        <div class="container">
            <div class="header">
                <h1>{{ isset($shop) ? 'Edit Shop' : 'Create New Shop' }}</h1>
            </div>

            <div class="form-container">
                <form id="managementForm" enctype="multipart/form-data" method="POST" action="{{ isset($shop) ? route('dashboard.shop.update', $shop->id) : route('dashboard.shop.store') }}">
                    @csrf
                    @if(isset($shop))
                        @method('PUT')
                    @endif

                    <!-- Image Field -->
                    <div class="form-group">
                        <label for="image">Image</label>
                        @if(isset($shop) && $shop->image && is_string($shop->image))
                            <div class="mb-3">
                                <label>Current Image</label>
                                <div>
                                    <img src="{{ $shop->image }}" alt="Current Image" style="max-width: 200px; height: auto; border-radius: 0.35rem;">
                                </div>
                            </div>
                        @endif
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="image" name="image" accept="image/jpeg,image/png,image/jpg,image/webp">
                                <label class="custom-file-label" for="image">Choose file</label>
                            </div>
                        </div>
                        <small class="form-text text-muted">Upload one image, up to 2MB (JPEG, PNG, JPG, WEBP).</small>
                        @error('image')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Shop Name Field -->
                    <div class="form-group">
                        <label for="name">Shop Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter shop name" required maxlength="255" value="{{ old('name', $shop->name ?? '') }}">
                        @error('name')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Owner Name Field -->
                    <div class="form-group">
                        <label for="owner_name">Owner Name</label>
                        <input type="text" id="owner_name" name="owner_name" placeholder="Enter owner name" required maxlength="255" value="{{ old('owner_name', $shop->owner_name ?? '') }}">
                        @error('owner_name')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Owner Phone Number Field -->
                    <div class="form-group">
                        <label for="owner_phone_number">Owner Phone Number</label>
                        <input type="text" id="owner_phone_number" name="owner_phone_number" placeholder="Enter owner phone number" required maxlength="20" value="{{ old('owner_phone_number', $shop->owner_phone_number ?? '') }}">
                        @error('owner_phone_number')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Address Field -->
                    <div class="form-group">
                        <label for="address_id">Address</label>
                        <select id="address_id" name="address_id" required style="width: 60%">
                            @foreach($addresses ?? [] as $value => $label)
                                <option value="{{ $value }}" {{ old('address_id', $shop->address_id ?? '') == $value ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                        <button style="width: fit-content" id="create_address" name="create_address" type="button" >Add</button>
                        @error('address_id')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    
                    <!-- Partner Status Field -->
                    <div class="form-group">
                        <label for="is_partner">Partner Status</label>
                        <select id="is_partner" name="is_partner" required>
                            <option value="1" {{ old('is_partner', $shop->is_partner ?? '') == 1 ? 'selected' : '' }}>Partner</option>
                            <option value="0" {{ old('is_partner', $shop->is_partner ?? '') == 0 ? 'selected' : '' }}>Not Partner</option>
                        </select>
                        @error('is_partner')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Details Field -->
                    <div class="form-group">
                        <label for="details">Details</label>
                        <textarea id="details" name="details" placeholder="Enter shop details" required maxlength="500" class="big" rows="3">{{ old('details', $shop->details ?? '') }}</textarea>
                        @error('details')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Added By Field -->
                    <div class="form-group">
                        <label for="employee_display">Added By</label>
                        <input type="text" id="employee_display" name="employee_display" value="{{ isset($shop) ? $shop->employee->first_name . ' ' . $shop->employee->last_name : auth()->user()->first_name . ' ' . auth()->user()->last_name ?? 'N/A' }}" disabled>
                    </div>

                    <div class="footer">
                        <button type="submit" class="btn btn-primary">
                            {{ isset($shop) ? 'Update Shop' : 'Create Shop' }}
                        </button>
                    </div>
                </form>
                <!-- Address Modal -->
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
                                <form id="address-form" method="POST" action="{{ route('dashboard.address.store') }}">
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
                                        <button type="button" onclick="document.getElementById('address-form').submit()" class="btn btn-primary">Create Address</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
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
        document.querySelectorAll('.custom-file-input').forEach(input => {
            input.addEventListener('change', function(e) {
                const files = e.target.files;
                const label = e.target.nextElementSibling;
                if (files.length > 1) {
                    label.textContent = `${files.length} files selected`;
                } else {
                    label.textContent = files[0]?.name || 'Choose file';
                }
            });
        });


        document.getElementById('create_address').addEventListener('click', function () {
            document.getElementById('addressModal').classList.add('show');
            const modal = document.getElementById('addressModal');
            setTimeout(() => {
                const addressForm = document.getElementById('address-form');
                console.log(addressForm); // Debugging
                
            }, 1000); // Delay to ensure the modal is fully rendered
            // Function to close modal
            function closeModal() {
                console.log('Closing modal'); // Debugging
                modal.classList.remove('show');
                modal.style.display = 'none';
                addressForm.reset(); // Reset form
            }

            // Handle X and Close buttons
            document.querySelectorAll('[data-dismiss="modal"]').forEach(button => {
                button.addEventListener('click', function () {
                    closeModal();
                });
            });

            // Handle clicking outside the modal
            window.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeModal();
                }
            });

            // Handle address form submission
        //     addressForm.addEventListener('submit', function (e) {
        //         e.preventDefault(); // Prevent default form submission
        //         const formData = new FormData(addressForm);

        //         fetch(addressForm.action, {
        //             method: 'POST',
        //             body: formData,
        //             headers: {
        //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        //                 'Accept': 'application/json'
        //             }
        //         })
        //         .then(response => {
        //             if (!response.ok) {
        //                 throw new Error('Network response was not ok');
        //             }
        //             return response.json();
        //         })
        //         .then(data => {
        //             if (data.success) {
        //                 // Add new address to the dropdown
        //                 const select = document.getElementById('address_id');
        //                 const option = document.createElement('option');
        //                 option.value = data.address.id;
        //                 option.text = data.address.title; // Adjust based on your address label format
        //                 option.selected = true;
        //                 select.appendChild(option);
        //                 closeModal(); // Close the modal
        //             } else {
        //                 alert('Failed to create address: ' + (data.message || 'Unknown error'));
        //             }
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //             alert('An error occurred while creating the address.');
        //         });
        //     });
        });
    </script>
@endsection
