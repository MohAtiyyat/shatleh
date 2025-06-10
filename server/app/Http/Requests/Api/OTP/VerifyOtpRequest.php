<?php

namespace App\Http\Requests\Api\OTP;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
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
            'phone_number' => 'required_if:email,null|regex:/^(\+?2)?[0-9]{13}$/',
            'email' => 'required_if:phone_number,null|email',
            'otp' => 'required|numeric|digits:4',
            'otp_type' => 'in:register,login,reset_password,update_profile',
        ];
    }
}
