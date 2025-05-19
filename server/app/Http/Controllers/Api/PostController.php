<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('category')->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'title_en' => $post->title_en,
                'title_ar' => $post->title_ar,
                'content_en' => $post->content_en,
                'content_ar' => $post->content_ar,
                'category_id' => $post->category_id,
                'category_en' => $post->category ? $post->category->name_en : null,
                'category_ar' => $post->category ? $post->category->name_ar : null,
                'product_id' => $post->product_id,
                'product_en' => $post->product ? $post->product->name_en : null,
                'product_ar' => $post->product ? $post->product->name_ar : null,
                'image' => $post->image ? asset('storage/' . $post->image) : null,
            ];
        });
        return response()->json($posts);
    }

    public function show($id)
    {
        $post = Post::with('category')->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json([
            'id' => $post->id,
            'title_en' => $post->title_en,
            'title_ar' => $post->title_ar,
            'content_en' => $post->content_en,
            'content_ar' => $post->content_ar,
            'category_id' => $post->category_id,
            'category_en' => $post->category ? $post->category->name_en : null,
            'category_ar' => $post->category ? $post->category->name_ar : null,
            'product_id' => $post->product_id,
            'product_en' => $post->product ? $post->product->name_en : null,
            'product_ar' => $post->product ? $post->product->name_ar : null,
            'image' => $post->image ? asset('storage/' . $post->image) : null,
        ]);
    }

    public function bookmarksToggle($postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);

        if ($user->bookmarks()->where('post_id', $post->id)->exists()) {
            $user->bookmarks()->detach($post->id);
            return response()->json(['bookmarked' => false]);
        } else {
            $user->bookmarks()->attach($post->id);
            return response()->json(['bookmarked' => true]);
        }
    }
}
