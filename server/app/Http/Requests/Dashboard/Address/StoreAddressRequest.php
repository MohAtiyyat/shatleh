<?php

namespace App\Http\Requests\Dashboard\Address;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
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
            'title' => 'required|string',
            'country_id' => 'required|string:exists:countries,id',
            'city' => 'required|string',
            'address_line' => 'required|string',
        ];
    }
}
