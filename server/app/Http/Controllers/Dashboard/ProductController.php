<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Product\ShowProductRequest;
use App\Http\Requests\Dashboard\Product\StoreProductRequest;
use App\Http\Requests\Dashboard\Product\UpdateProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(){
        $products = Product::all();

        return view('admin.Product.all', compact('products'));
    }

    public function store(StoreProductRequest $request){
        $data = $request->validated();

        $product = Product::create($data);

        return response()->json(['message' => 'Registration successful', 'product_name' => $product->name_ar], 200);
    }

    public function update(UpdateProductRequest $request, Product $product){
        $data = $request->validated();

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully'], 200);
    }

    public function show(ShowProductRequest $product){
        return view('admin.Product.show', compact('product'));
    }

    public function destroy(DeleteProductRequest $product){
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }


}
