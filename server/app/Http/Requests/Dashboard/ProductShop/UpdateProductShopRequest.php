<?php

namespace App\Http\Requests\Dashboard\ProductShop;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class UpdateProductShopRequest extends FormRequest
{
    use FormRequestTrait , UserRoleTrait;
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
            'product_id' => 'required|exists:products,id',
            'shop_id' => 'required|exists:shops,id',
            'cost' => 'required|numeric|min:0',
        ];
    }
}
