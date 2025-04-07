@extends('admin.layout.master')

@section('title')
    Product_Create
@endsection

@section('css')
@endsection
@section('productsCreate')
    active
@endsection
@section('title_page1')
    Create
@endsection
@section('title_page2')
    Product
@endsection

@section('title_div')
    Add Product
@endsection
@section('content')
    <div class="container m-aut">
        <div class="">
            {{-- <div class="card-header">
            <h3 class="card-title">Add Activity</h3>
          </div> --}}
            <!-- /.card-header -->
            <!-- form start -->
            <form action="{{route('admin.products.store')}}" method="POST" enctype="multipart/form-data">
                {{-- @method('PATCH') --}}
                @csrf
                <div class="card-body">
                    <div class="form-group">
                        <label for="exampleSelectRounded0">Category <code></code></label>
                        <select class="custom-select rounded-0" id="exampleSelectRounded0" name="name_category"
                            class="@error('select') is-invalid @enderror">
                            @foreach ($category as $value)
                                <option value="{{ $value->id }}">{{ $value->name_category }}</option>
                            @endforeach
                        </select>
                        @error('select')
                            <div class="alert alert-danger">{{ $message }}</div>
                        @enderror
                    </div>
                      <div class="form-group">
                        <label for="exampleSelectRounded0">Unit <code></code></label>
                        <select class="custom-select rounded-0" id="exampleSelectRounded0" name="unit" class="@error('unit') is-invalid @enderror">
                            <option value="retail">retail</option>
                            <option value="weight">weight</option>
                         </select>
                                          @error('unit')
                                          <div class="alert alert-danger">{{ $message }}</div>
                                      @enderror
                    </div>



                    <div class="form-group">
                        <label for="exampleInputEmail1">Name</label>
                        <input type="text" name="namepro" class="form-control" id="" placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Price</label>
                        <input type="text" name="price" class="form-control" id="" placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Short description</label>
                        <input type="text" name="short_description" class="form-control" id="" placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Long description</label>
                        <input type="text" name="long_description" class="form-control" id="" placeholder="">
                    </div>
                    <div class="form-group">
                        <label>Image</label>

                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="exampleInputFile" name="image">
                                <label class="custom-file-label" for="exampleInputFile">Choose file image</label>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- /.card-body -->

                <div class="card-footer">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>

        </div>
        <div>
        @endsection
        @section('scripts')
        @endsection
