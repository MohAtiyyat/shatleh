<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Catrgory\DeleteCategoryRequest;
use App\Http\Requests\Dashboard\Catrgory\StoreCategoryRequest;
use App\Http\Requests\Dashboard\Catrgory\UpdateCategoryRequest;
use App\Models\Category;
use Dotenv\Util\Str;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('media')->latest()->paginate(10);

        return view('admin.Category.index', compact('categories'));
    }

    public function show()
    {

        return view('dashboard.categories.show');
    }
    public function create()
    {

        return view('dashboard.categories.create');
    }
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        if ($request->hasFile('image')) {
            $category->addMedia($request->file('image'))->toMediaCollection('categories');
        }
        $category->save();
        return redirect()->route('dashboard.category')->with('success', 'Category created successfully');
    }

    public function edit()
    {
        return view('dashboard.categories.edit');
    }
    public function update(UpdateCategoryRequest $request)
    {
        Category::where('id', $request->id)->update($request->validated());
        return view('dashboard.categories.update');
    }
    public function delete(DeleteCategoryRequest $request)
    {
        $category = Category::find($request->id);
        if ($category) {
            $category->delete();
            return redirect()->route('dashboard.category')->with('success', 'Category deleted successfully');
        }
        return redirect()->route('dashboard.category')->with('error', 'Category not found');
    }

}
