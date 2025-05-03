<?php

namespace App\Http\Requests\Dashboard\Specialty;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Symfony\Component\Console\Input\Input;

class StoreSpecialtyRequest extends FormRequest
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
            'name_ar' => 'required|string|unique:specialties,name_ar',
            'name_en' => 'required|string|unique:specialties,name_en',
        ];
    }
}
