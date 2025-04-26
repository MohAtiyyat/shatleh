<?php

namespace App\Http\Requests\Dashboard\Staff;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Symfony\Component\Console\Input\Input;

class StoreStaffRequest extends FormRequest
{
    use UserRoleTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->admin() || true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {   
        // dd(Request::input());
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,',
            'phone_number' => 'nullable|string|max:255|unique:users,phone_number,',
            'role' => 'required|exists:roles,name',
        ];
    }
}
