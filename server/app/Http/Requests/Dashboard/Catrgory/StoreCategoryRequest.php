<?php

namespace App\Http\Requests\Dashboard\Catrgory;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
            'name_ar' => $this->name('categories', 'ar'),
            'name_en' => $this->name('categories', 'en'),
            'description_ar' => $this->description(),
            'description_en' => $this->description(),
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_main' => 'nullable|boolean',
        ];
    }
}
