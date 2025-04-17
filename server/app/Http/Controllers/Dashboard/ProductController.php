<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\AllProductRequest;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Product\ShowProductRequest;
use App\Http\Requests\Dashboard\Product\StoreProductRequest;
use App\Http\Requests\Dashboard\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(AllProductRequest $request){

        $products = Product::all();

        return view('admin.Product.all', compact('products'));
    }

    public function create(){
        return view('admin.Product.createUpdate');
    }

    public function store(StoreProductRequest $request){


        $data = $request->all();
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image'] = Storage::url($imagePath); // Saves full URL, e.g., "http://example.com/storage/products/image.jpg"
        }
        Product::create($data);

        return redirect()->route('dashboard.product');
    }

    public function edit(Product $product){
        return view('admin.Product.createUpdate', compact('product'));
    }

    public function update(UpdateProductRequest $request, Product $product){
        $data = $request->validated();

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully'], 200);
    }

    public function show(ShowProductRequest $product){
        return view('admin.Product.show', compact('product'));
    }

    public function delete(DeleteProductRequest $product){
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }


}
