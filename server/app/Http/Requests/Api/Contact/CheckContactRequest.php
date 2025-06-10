<?php

namespace App\Http\Requests\Api\Contact;

use Illuminate\Foundation\Http\FormRequest;

class CheckContactRequest extends FormRequest
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
            'lang' => 'required|in:ar,en',
            'phone_number' => 'required_if:email,null|regex:/^(\+?2)?[0-9]{13}$/',
            'email' => 'required_if:phone_number,null|email',
            'otp_type' => 'nullable|in:reset_password,verify_email,register,update_profile',
        ];
    }
}
