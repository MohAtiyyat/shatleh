<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Post\StorePostRequest;
use App\Http\Requests\Dashboard\Post\UpdatePostRequest;
use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'id');
        $direction = $request->query('direction', 'asc');
        $search = $request->query('search');

        $sortableColumns = ['id', 'title_en', 'title_ar', 'created_at'];
        $sort = in_array($sort, $sortableColumns) ? $sort : 'id';
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'asc';

        $query = Post::with(['category', 'user', 'product']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', '%' . $search . '%')
                  ->orWhere('title_ar', 'like', '%' . $search . '%');
            });
        }

        $posts = $query->orderBy($sort, $direction)->paginate(10);

        return view('admin.Post.index', compact('posts'));
    }

    public function create()
    {
        $categories = Category::where('parent_id', null)->get();
        $products = Product::all();
        return view('admin.post.createUpdate', compact('categories', 'products'));
    }

    public function store(StorePostRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($data + ['user_id' => auth()->id()]);

        return redirect()->route('dashboard.post.index')->with('success', 'Post created successfully.');
    }

    public function edit($id)
    {
        $post = Post::with(['category', 'user', 'product'])->findOrFail($id);
        $categories = Category::where('parent_id', null)->get();
        $products = Product::all();
        return view('admin.post.createUpdate', compact('post', 'categories', 'products'));
    }

    public function update(UpdatePostRequest $request, $id)
    {
        $post = Post::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post->update($data);

        return redirect()->route('dashboard.post.index')->with('success', 'Post updated successfully.');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();

        return redirect()->route('dashboard.post.index')->with('success', 'Post deleted successfully.');
    }

    public function show($id)
    {
        $post = Post::with(['category', 'user', 'product'])->findOrFail($id);
        return view('admin.post.show', compact('post'));
    }
}
