<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait FormRequestTrait
{
    public function id(string $tableName): array
    {
        $rules = ['required|integer|exists:'.$tableName.',id'];
        return $rules;
    }
    public function name(string $tableName, string $lang, bool $required = true): array
    {
        $rules = ['string', 'unique:'.$tableName.',name_'.$lang];
        if ($required) {
            array_unshift($rules, 'required');
        }
        return $rules;
    }

    public function description(bool $required = true): array
    {
        $rules = ['string'];
        if ($required) {
            array_unshift($rules, 'required');
        }
        return $rules;
    }

}