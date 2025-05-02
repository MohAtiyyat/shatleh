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
        $products = Product::all();

        return view('admin.Product.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::whereNull('parent_id')->get();
        $subcategories = Category::whereNotNull('parent_id')->get();

        // Group subcategories by their parent category
        $groupedSubcategories = $subcategories->groupBy('parent_id')->map(function ($group) {
            return $group->pluck('name_ar', 'id');
        });

        return view('admin.Product.createUpdate', compact('categories', 'groupedSubcategories'));
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

        // Handle main category
        if ($request->has('categories')) {
            $mainCategoryIds = $request->input('categories');
            // Convert to array if not already
            if (!is_array($mainCategoryIds)) {
                $mainCategoryIds = [$mainCategoryIds];
            }

            // Add main category to the sync array
            $categoryIds = $mainCategoryIds;

            // Handle subcategories if present
            if ($request->has('sub_categories')) {
                $subCategoryIds = $request->input('sub_categories');
                // Convert to array if not already
                if (!is_array($subCategoryIds)) {
                    $subCategoryIds = [$subCategoryIds];
                }
                // Merge main categories with subcategories
                $categoryIds = array_merge($categoryIds, $subCategoryIds);
            }

            // Sync all categories (main + sub)
            $product->categories()->sync($categoryIds);
        }

        return redirect()->route('dashboard.product')->with('success', 'Product created successfully.');
    }

    public function edit($id)
    {
        $item = Product::with('categories')->findOrFail($id);
        $categories = Category::whereNull('parent_id')->get();
        $subcategories = Category::whereNotNull('parent_id')->get();

        $groupedSubcategories = $subcategories->groupBy('parent_id')->map(function ($group) {
            return $group->pluck('name_ar', 'id');
        });

        // Get the main category (first category with no parent_id)
        $selectedMainCategory = $item->categories->whereNull('parent_id')->first();
        $selectedSubCategories = $item->categories->whereNotNull('parent_id')->pluck('id')->toArray();

        return view('admin.Product.createUpdate', compact(
            'item',
            'categories',
            'groupedSubcategories',
            'selectedMainCategory',
            'selectedSubCategories'
        ));
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

            // Handle categories
            if ($request->has('categories')) {
                $mainCategoryIds = $request->input('categories');
                // Convert to array if not already
                if (!is_array($mainCategoryIds)) {
                    $mainCategoryIds = [$mainCategoryIds];
                }

                // Add main category to the sync array
                $categoryIds = $mainCategoryIds;

                // Handle subcategories if present
                if ($request->has('sub_categories')) {
                    $subCategoryIds = $request->input('sub_categories');
                    // Convert to array if not already
                    if (!is_array($subCategoryIds)) {
                        $subCategoryIds = [$subCategoryIds];
                    }
                    // Merge main categories with subcategories
                    $categoryIds = array_merge($categoryIds, $subCategoryIds);
                }

                // Sync all categories (main + sub)
                $product->categories()->sync($categoryIds);
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
        $subcategories = Category::where('parent_id', $product->categories->first()->id)->get();
        return view('admin.Product.show', compact('product', 'subcategories'));
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
