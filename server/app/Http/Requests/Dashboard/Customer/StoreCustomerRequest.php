<?php

namespace App\Http\Requests\Dashboard\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Traits\FormRequestTrait;
use App\Traits\UserRuleTrait;

class StoreCustomerRequest extends FormRequest
{
    use FormRequestTrait , UserRuleTrait;

    public function authorize(): bool
    {
        return $this->admin();
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('customer')?->user_id),
            ],
            'phone_number' => 'required|string|max:20',
            'language' => 'required|string|max:10',
        ];
    }
}
