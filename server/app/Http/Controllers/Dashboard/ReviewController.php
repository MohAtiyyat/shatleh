<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Review\DeleteReviewRequest;
use App\Models\Review;
use App\Traits\HelperTrait;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    use HelperTrait;

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

        $this->logAction(auth()->id(), 'delete_review', 'Review deleted: Review ID ' . $review->id, LogsTypes::WARNING->value);
        return redirect()->route('dashboard.review.index')->with('success', 'Review deleted successfully.');
    }
}
