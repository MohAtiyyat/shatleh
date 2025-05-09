<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'price' => 'required|integer|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'existing_images.*' => 'nullable|string',
            'categories.*' => 'exists:categories,id',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'status' => 'required|in:active,inactive,draft',
            'availability' => 'required|in:0,1,2',
        ];
    }
}
