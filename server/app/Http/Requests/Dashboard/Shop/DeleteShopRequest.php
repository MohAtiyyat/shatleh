<?php

namespace App\Http\Requests\Dashboard\Shop;

use App\Traits\FormRequestTrait;
use App\Traits\UserRuleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class DeleteShopRequest extends FormRequest
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
            'id' => $this->id('shops'),
        ];
    }
}
