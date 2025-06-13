<?php

namespace App\Http\Requests\Dashboard\Specialty;

use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSpecialtyRequest extends FormRequest
{
    use UserRoleTrait;

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
        // Get the ID of the specialty being updated
        $specialtyId = $this->route('specialty'); // Assuming the route parameter is named 'specialty'

        return [
            'name_ar' => 'required|string|unique:specialties,name_ar,' . $specialtyId,
            'name_en' => 'required|string|unique:specialties,name_en,' . $specialtyId,
        ];
    }
}