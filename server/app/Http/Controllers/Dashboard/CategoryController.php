<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Catrgory\StoreCategoryRequest;
use App\Http\Requests\Dashboard\Catrgory\UpdateCategoryRequest;
use App\Jobs\MainToSubCategoryJob;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    use HelperTrait;
    public function index()
    {
        $categories = Category::whereNull('parent_id')->get();
        $subcategories = Category::whereNotNull('parent_id')->get();
        return view('admin.Category.index', compact('categories', 'subcategories'));
    }

    public function show($category)
    {
        $category = Category::findOrFail($category);
        $subcategories = collect(); // Empty collection by default
        if ($category->parent_id == null) {
            $subcategories = Category::where('parent_id', $category->id)->get();
        }
        return view('admin.Category.show', compact('category', 'subcategories'));
    }

    public function create()
    {
        $parents = Category::whereNull('parent_id')->get();
        return view('admin.Category.createUpdate', compact('parents'));
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }
        Category::create($data);
        
        $this->logAction(auth()->id(), 'create_category', 'Category created: ' . $data['name_ar'] . ' (ID: ' . $data['id'] . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.category')->with('success', 'Category created successfully.');
    }

    public function edit($category)
    {
        $category = Category::findOrFail($category);
        $parents = Category::whereNull('parent_id')->where('id', '!=', $category->id)->get();
        return view('admin.Category.createUpdate', compact('category', 'parents'));
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();

        if ($category->parent_id == null && $data['parent_id'] != null) {
            MainToSubCategoryJob::dispatch($category->id, $data['parent_id'])->onQueue('default');
        }
        if ($request->hasFile('image')) {

            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);

        $this->logAction(auth()->id(), 'update_category', 'Category updated: ' . $data['name_ar'] . ' (ID: ' . $category->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.category')->with('success', 'Category updated successfully.');
    }

    public function destroy($category)
    {
        $category = Category::findOrFail($category);
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();

        $this->logAction(auth()->id(), 'delete_category', 'Category deleted: ' . $category->name_ar . ' (ID: ' . $category->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.category')->with('success', 'Category deleted successfully.');
    }
}
