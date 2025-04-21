<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\FormRequestTrait;
use App\Traits\UserRuleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    use FormRequestTrait, UserRuleTrait;
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
            'name_ar' => 'required',
            'name_en' => 'required',
            'description_ar' => 'required',
            'description_en' => 'required',
            'price' => 'required|integer',
            'image' => 'required',
            'status' => 'required|integer',
            'availability' => 'required|integer',
            'category_id' => 'integer',
        ];
    }
}
