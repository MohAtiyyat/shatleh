<?php

namespace App\Http\Requests\Dashboard\Address;

use App\Traits\FormRequestTrait;
use App\Traits\UserRuleTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
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
            'id' => $this->id('addresses'), 
            'title' => 'required|string',
            'country_id' => 'required|string:exists:countries,id|default:1',
            'city' => 'required|string',
            'address_line' => 'required|string',
        ];
    }
}
