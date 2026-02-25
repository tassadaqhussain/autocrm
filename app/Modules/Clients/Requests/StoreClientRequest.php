<?php

declare(strict_types=1);

namespace App\Modules\Clients\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'salutation' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'gender' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:50',
            'client_category' => 'nullable|string|max:100',
            'client_sub_category' => 'nullable|string|max:100',
            'login_allowed' => 'sometimes|boolean',
            'email_notifications' => 'sometimes|boolean',
            'company_name' => 'nullable|string|max:255',
            'official_website' => 'nullable|string|max:255',
            'tax_name' => 'nullable|string|max:255',
            'gst_vat_number' => 'nullable|string|max:50',
            'office_phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'company_address' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'note' => 'nullable|string',
            'status' => 'required|string|in:Active,Inactive',
        ];
    }
}
