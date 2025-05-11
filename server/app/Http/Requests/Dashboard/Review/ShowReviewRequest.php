<?php

namespace App\Http\Requests\Dashboard\Review;

use Illuminate\Foundation\Http\FormRequest;
use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;

class ShowReviewRequest extends FormRequest
{
    use FormRequestTrait, UserRoleTrait;

    public function authorize(): bool
    {
        return $this->admin();
    }

    public function rules(): array
    {
        return [
            'id' => $this->id('reviews'),
        ];
    }
}
