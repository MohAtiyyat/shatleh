@extends('admin.layout.master')

@section('title', 'Review Details')
@section('Review_Show', 'active')

@section('content')


    <div class="container mt-4">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4>Review Details</h4>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label><strong>Review ID:</strong></label> 
                        <p>{{ $review->id }}</p>
                    </div>
                    <div class="col-md-6">
                        <label><strong>Product ID:</strong></label>
                        <p>{{ $review->product_id }}</p>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label><strong>Customer ID:</strong></label>
                        <p>{{ $review->customer_id }}</p>
                    </div>   
                    <div class="col-md-6">
                        <label><strong>Product Name (EN):</strong></label>
                        <p>{{ $review->product->name_en }}</p>
                    </div>                    
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label><strong>Customer Name:</strong></label>
                        <p>{{ $review->customer->first_name }} {{ $review->customer->last_name }}</p>
                    </div>                    
                    <div class="col-md-6">
                        <label><strong>Product Name (AR):</strong></label>
                        <p>{{ $review->product->name_ar }}</p>
                    </div>                  
                </div>            

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label><strong>Review Comment:</strong></label>
                        <p>{{ $review->text }}</p>
                    </div>  
                    <div class="col-md-6">
                        <label><strong>Rating:</strong></label>
                        <p>
                            @for ($i = 1; $i <= 5; $i++)
                                <i class="fas fa-star {{ $review->rating >= $i ? 'text-warning' : 'text-muted' }}"></i>
                            @endfor
                        </p>
                    </div>                                      
                </div> 

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label><strong>Created At:</strong></label>
                        <p>{{ $review->created_at }}</p>
                    </div>
                    <div class="col-md-6">
                        <label><strong>Updated_At:</strong></label>
                        <p>{{ $review->updated_at }}</p>
                    </div>                    
                </div> 

                <div class="row mb-3 ml-2">
                    <a href="{{ url()->previous() }}" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back
                    </a>
                    @if(auth()->user()->hasRole('Admin'))
                    <form action="{{ route('dashboard.review.delete', $review->id) }}" method="POST"
                        onsubmit="return confirm('Are you sure?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger ml-3">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </form>  
                    @endif                  
                </div>
            </div>
        </div>
    </div>
@endsection
