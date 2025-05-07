<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\AllProductRequest;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Product\ShowProductRequest;
use App\Http\Requests\Dashboard\Product\StoreProductRequest;
use App\Http\Requests\Dashboard\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(AllProductRequest $request)
    {
        $products = Product::paginate(50);

        return view('admin.Product.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('admin.Product.createUpdate', compact('categories'));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        // Handle multiple image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('product_images', 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
            $data['image'] = $imagePaths;
        }

        $product = Product::create($data);

        // Handle category assignments
        if ($request->has('categories')) {
            $product->categories()->sync($request->input('categories'));
        }

        return redirect()->route('dashboard.product')->with('success', 'Product created successfully.');
    }

    public function edit($id)
    {
        $item = Product::findOrFail($id);
        $categories = Category::all();
        return view('admin.Product.createUpdate', compact('item', 'categories'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        try {
            // Handle multiple image uploads
            if ($request->hasFile('images')) {
                // Delete old images if they exist
                if ($product->image) {
                    foreach ($product->image as $oldImage) {
                        $oldImagePath = ltrim(parse_url($oldImage, PHP_URL_PATH), '/storage/');
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
                // Store new images
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $imagePath = $image->store('product_images', 'public');
                    $imagePaths[] = Storage::url($imagePath);
                }
                $data['image'] = $imagePaths;
            }

            $product->update($data);

            // Handle category assignments
            if ($request->has('categories')) {
                $product->categories()->sync($request->input('categories'));
            }

            return redirect()->route('dashboard.product')->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    public function show($product)
    {
        $product = Product::with(['shops' => function ($query) {
            $query->take(3);
        }, 'categories'])->findOrFail($product);
        return view('admin.Product.show', compact('product'));
    }

    public function delete(DeleteProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            foreach ($product->image as $image) {
                $imagePath = ltrim(parse_url($image, PHP_URL_PATH), '/storage/');
                Storage::disk('public')->delete($imagePath);
            }
        }
        $product->delete();

        return redirect()->route('dashboard.product')->with('success', 'Product deleted successfully.');
    }

    public function productShops(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);
        $shops = $product->shops()->paginate(50);
        return view('admin.Product.productshops', compact('shops', 'product'));
    }
}
