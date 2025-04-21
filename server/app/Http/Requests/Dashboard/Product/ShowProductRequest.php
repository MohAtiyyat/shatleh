<?php

namespace App\Http\Requests\Dashboard\Product;

use App\Traits\UserRuleTrait;
use Illuminate\Foundation\Http\FormRequest;

class ShowProductRequest extends FormRequest
{
    use UserRuleTrait;

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
            'id' => $this->id('products'),
        ];
    }
}
