<?php

namespace App\Jobs;

use App\Models\Category;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use function PHPUnit\Framework\isEmpty;

class MainToSubCategoryJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    private $category_id;
    private $parent_id;
    public function __construct($category_id, $parent_id)
    {
        $this->category_id = $category_id;
        $this->parent_id = $parent_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subcategory = Category::where('parent_id', $this->category_id)->get();
        if (isEmpty($subcategory)) {
            foreach ($subcategory as $sub) {
                $sub->parent_id = $this->parent_id;
                $sub->save();
            }
        }
    }
}
