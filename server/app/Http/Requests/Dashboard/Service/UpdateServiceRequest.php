<?php

namespace App\Http\Requests\Dashboard\Service;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    use FormRequestTrait, UserRoleTrait;
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
                'name_ar' => 'required|string',
                'name_en' => 'required|string',
                'description_ar' => 'required|string',
                'description_en' => 'required|string',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
                'status' => 'required|integer',
        ];
    }
}
