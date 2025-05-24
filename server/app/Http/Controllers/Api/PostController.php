<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $posts = Post::with('category')
            ->select('posts.*')
            ->when($userId, function ($query) use ($userId) {
                $query->selectRaw('EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.post_id = posts.id AND bookmarks.user_id = ?) as bookmarked', [$userId]);
            }, function ($query) {
                $query->selectRaw('0 as bookmarked');
            })
            ->get()
            ->map(function ($post) {
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
                    'bookmarked' => (bool) $post->bookmarked,
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

        $user = Auth::user();
        $bookmarked = $user ? $user->bookmarks()->where('post_id', $post->id)->exists() : false;

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
            'bookmarked' => $bookmarked,
        ]);
    }

    public function bookmarksToggle($postId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Authentication required to bookmark posts'], 401);
        }

        $post = Post::find($postId);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $isBookmarked = $user->bookmarks()->where('post_id', $post->id)->exists();
        if ($isBookmarked) {
            $user->bookmarks()->detach($post->id);
            Log::info('Bookmark removed', ['user_id' => $user->id, 'post_id' => $post->id]);
            return response()->json(['bookmarked' => false]);
        } else {
            $user->bookmarks()->attach($post->id);
            Log::info('Bookmark added', ['user_id' => $user->id, 'post_id' => $post->id]);
            return response()->json(['bookmarked' => true]);
        }
    }

    public function getBookmarks()
    {
        $user = Auth::user();
        $bookmarks = $user->bookmarks()->with('category')->get()->map(function ($post) {
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
        return response()->json($bookmarks);
    }
}
