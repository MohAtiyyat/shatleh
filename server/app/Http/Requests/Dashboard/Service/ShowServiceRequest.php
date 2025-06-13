<?php

namespace App\Http\Requests\Dashboard\Service;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class ShowServiceRequest extends FormRequest
{
    use UserRoleTrait;

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
            'id' => $this->id('service'),
        ];
    }
}
