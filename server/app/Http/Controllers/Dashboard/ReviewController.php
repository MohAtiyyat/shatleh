<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Review\DeleteReviewRequest;
use App\Models\Review;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{


    public function index()
    {
        $reviews = Review::with(['product', 'customer'])->get();
        return view('admin.Review.index', compact('reviews'));
    }

    public function show($id)
    {
        $review = Review::findOrFail($id);
        return view('admin.Review.show', compact('review'));
    }

    public function delete(DeleteReviewRequest $request, $id)
    {
        $review = Review::findOrFail($id);

        $review->delete();

        return redirect()->route('dashboard.review.index')->with('success', 'Review deleted successfully.');
    }
}
