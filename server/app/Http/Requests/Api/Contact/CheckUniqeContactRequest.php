<?php

namespace App\Http\Requests\Api\Contact;

use Illuminate\Foundation\Http\FormRequest;

class CheckUniqeContactRequest extends FormRequest
{
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
            'phone_number' => 'required_if:email,null|regex:/^(\+?2)?[0-9]{13}$/|unique:users,phone_number',
            'email' => 'required_if:phone_number,null|email|unique:users,email',
        ];
    }
}
