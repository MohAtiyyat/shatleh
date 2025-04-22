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

    public function store(StoreProductRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $data['image'] = Storage::url($imagePath); // Save URL to image column
    }

    Product::create($data);

    return redirect()->route('dashboard.product')->with('success', 'Product created successfully.');
}

    public function edit( $id){
        $item = Product::findOrFail($id);

        return view('admin.Product.createUpdate', compact('item'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        try {
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($product->image) {
                    $oldImagePath = ltrim(parse_url($product->image, PHP_URL_PATH), '/storage/');
                    Storage::disk('public')->delete($oldImagePath);
                }
                // Store new image
                $imagePath = $request->file('image')->store('products', 'public');
                $data['image'] = Storage::url($imagePath);
            }

            $product->update($data);

            return redirect()->route('dashboard.product')->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    public function show($product){
        $product = Product::findOrFail($product);
        return view('admin.Product.show', compact('product'));
    }

    public function delete(DeleteProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            $imagePath = ltrim(parse_url($product->image, PHP_URL_PATH), '/storage/');
            Storage::disk('public')->delete($imagePath);
        }
        $product->delete();

        return redirect()->route('dashboard.product')->with('success', 'Product deleted successfully.');
    }
}
