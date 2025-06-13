<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    use FormRequestTrait, UserRoleTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->employee();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name_en' => 'required|string|max:255|unique:products,name_en',
            'name_ar' => 'required|string|max:255|unique:products,name_ar',
            'price' => 'required|decimal:1,2|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'existing_images.*' => 'nullable|string',
            'categories.*' => 'exists:categories,id',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'status' => 'required|in:active,inactive',
            'availability' => 'required|in:0,1',
        ];
    }
}
