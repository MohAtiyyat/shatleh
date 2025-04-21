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

        $products = Product::paginate(50);

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

    public function edit( $id){
        $item = Product::findOrFail($id);

        return view('admin.Product.createUpdate', compact('item'));
    }

    public function update(UpdateProductRequest $request, Product $id){
        $data = $request->validated();

        $id->update($data);

        return redirect()->route('dashboard.product');
    }

    public function show($product){
        $product = Product::findOrFail($product);
        return view('admin.Product.show', compact('product'));
    }

   public function delete(DeleteProductRequest $request, $id)
    {
        // The ID is validated by DeleteProductRequest
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('dashboard.product')->with('success', 'Product deleted successfully.');
    }
}
