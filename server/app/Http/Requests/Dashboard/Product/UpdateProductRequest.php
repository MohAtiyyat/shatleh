<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    use FormRequestTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
                'name_ar' => 'required|string',
                'name_en' => 'required|string',
                'description_ar' => 'required|string',
                'description_en' => 'required|string',
                'price' => 'required|integer',
                'image' => 'required',
                'status' => 'required|integer',
                'availability' => 'required|integer',
                'category_id' => 'integer|exists:categories,id',
        ];
    }
}
