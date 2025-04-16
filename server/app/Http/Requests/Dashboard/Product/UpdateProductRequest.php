<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProductRequest extends FormRequest
{
    use FormRequestTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true||(Auth::check() && Auth::user()->hasRole('admin', 'super-admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => $this->id('products'),
            'name_ar' => $this->name('products', 'ar'),
            'name_en' => $this->name('products', 'en'),
            'description_ar' => $this->description(),
            'description_en' => $this->description(),
            'price' => 'required|integer',
            'image' => 'required|url',
            'status' => 'required|integer',
            'availability' => 'required|integer',
            'category_id' => 'integer|exists:categories,id',            
        ];
    }
}
