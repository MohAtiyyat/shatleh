<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\AllProductRequest;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Product\ShowProductRequest;
use App\Http\Requests\Dashboard\Product\StoreProductRequest;
use App\Http\Requests\Dashboard\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use HelperTrait;
    public function index(AllProductRequest $request)
    {
        $products = Product::all();
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
                $imagePath = $image->store('images/products', 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
            $data['image'] = $imagePaths;
        } else {
            $data['image'] = [];
        }

        $product = Product::create($data);

        // Handle category assignments
        if ($request->has('categories')) {
            $product->categories()->sync($request->input('categories'));
        }

        $this->logAction(auth()->id(), 'create_product', 'Product created: ' . $product->name_en . ' (ID: ' . $product->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.product')->with('success', 'Product created successfully.');
    }

    public function edit($id)
    {
        $item = Product::with('categories')->findOrFail($id);
        $categories = Category::get();
        return view('admin.Product.createUpdate', compact('item', 'categories'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        try {
            // Handle image updates
            $imagePaths = $request->input('existing_images', []); // Images to keep

            // Delete images that were removed
            if ($product->image && is_array($product->image)) {
                foreach ($product->image as $oldImage) {
                    if (!in_array($oldImage, $imagePaths)) {
                        $oldImagePath = ltrim(parse_url($oldImage, PHP_URL_PATH), '/');
                        if (Storage::disk('public')->exists($oldImagePath)) {
                            Storage::disk('public')->delete($oldImagePath);
                        }
                    }
                }
            }

            // Add new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePath = $image->store('images/products', 'public');
                    $imagePaths[] = Storage::url($imagePath);
                }
            }

            $data['image'] = !empty($imagePaths) ? $imagePaths : [];

            $product->update($data);

            // Handle category assignments
            if ($request->has('categories')) {
                $product->categories()->sync($request->input('categories'));
            }

            $this->logAction(auth()->id(), 'update_product', 'Product updated: ' . $data['name_en'] . ' (ID: ' . $product->id . ')', LogsTypes::INFO->value);
            return redirect()->route('dashboard.product')->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            $this->logAction(auth()->id(), 'update_product_error', 'Error updating product: ' . $e->getMessage(), LogsTypes::ERROR->value);
            return redirect()->back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    public function show($product)
    {
       $product = Product::with([
            'reviews' => function ($query) {
                $query->select('id', 'product_id', 'rating');
            },
            'shops' => function ($query) {
                $query->take(3);
            },
            'categories'
        ])
        ->withCount('reviews')
        ->findOrFail($product);

        $ratingSum = $product->reviews->sum('rating');
        return view('admin.Product.show', compact('product', 'ratingSum'));
    }

    public function delete(DeleteProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        if ($product->image && is_array($product->image)) {
            foreach ($product->image as $image) {
                $oldImagePath = ltrim(parse_url($image, PHP_URL_PATH), '/');
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }
        }
        $product->delete();

        $this->logAction(auth()->id(), 'delete_product', 'Product deleted: ' . $product->name_en . ' (ID: ' . $product->id . ')', LogsTypes::WARNING->value);
        return redirect()->route('dashboard.product')->with('success', 'Product deleted successfully.');
    }

    public function productShops(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);
        $shops = $product->shops()->paginate(50);
        return view('admin.Product.productshops', compact('shops', 'product'));
    }
}
