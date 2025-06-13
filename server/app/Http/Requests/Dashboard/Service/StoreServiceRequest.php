<?php

namespace App\Http\Requests\Dashboard\Service;

use App\Traits\FormRequestTrait;
use App\Traits\UserRoleTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreServiceRequest extends FormRequest
{
    use FormRequestTrait, UserRoleTrait;
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
        // dd(Request::all());
        return [
            'name_ar' => 'required',
            'name_en' => 'required',
            'description_ar' => 'required',
            'description_en' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'required|integer',
        ];
    }
}
