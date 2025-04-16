<?php

namespace App\Http\Requests\Dashboard\Shop;

use App\Traits\FormRequestTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreShopRequest extends FormRequest
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
           'name' => 'required|string|max:255',
            'address_id' => 'required|exists:addresses,id',
            'details' => 'required|string|max:500',
            'owner_phone_number' => 'required|string|max:20',
            'owner_name' => 'required|string|max:255',
            'is_partner' => 'required|boolean',
            'image' => 'image|mimes:jpg,png,jpeg,webp|max:255',
            'employee_id' => 'required|exists:employees,id',
        ];
    }
}
