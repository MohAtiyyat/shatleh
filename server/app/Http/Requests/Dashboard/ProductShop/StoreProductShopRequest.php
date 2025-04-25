<?php

namespace App\Http\Requests\Dashboard\ProductShop;

use App\Traits\FormRequestTrait;
use App\Traits\UserRuleTrait;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductShopRequest extends FormRequest
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
           'product_id' => 'required|exists:products,id',
            'shop_id' => 'required|exists:shops,id',
            'employee_id' => 'required|exists:users,id',
            'cost' => 'required|numeric|min:0',
        ];
    }
}
