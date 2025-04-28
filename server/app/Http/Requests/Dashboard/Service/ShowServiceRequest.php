<?php

namespace App\Http\Requests\Dashboard\Service;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class ShowProductRequest extends FormRequest
{
    use UserRoleTrait;

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
            'id' => $this->id('service'),
        ];
    }
}
