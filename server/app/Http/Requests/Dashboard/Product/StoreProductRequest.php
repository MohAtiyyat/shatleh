<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    use FormRequestTrait, UserRoleTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->admin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:0,1,2',
            'availability' => 'required|in:0,1,2',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'sub_categories' => 'required|array',
            'sub_categories.*' => 'exists:categories,id',
        ];
    }
}
