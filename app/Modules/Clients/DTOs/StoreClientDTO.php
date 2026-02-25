<?php

declare(strict_types=1);

namespace App\Modules\Clients\DTOs;

final readonly class StoreClientDTO
{
    public function __construct(
        public int $clinicId,
        public ?string $salutation,
        public string $name,
        public ?string $email,
        public ?string $mobile,
        public ?string $country,
        public ?string $gender,
        public ?string $language,
        public ?string $clientCategory,
        public ?string $clientSubCategory,
        public bool $loginAllowed,
        public bool $emailNotifications,
        public ?string $companyName,
        public ?string $officialWebsite,
        public ?string $taxName,
        public ?string $gstVatNumber,
        public ?string $officePhone,
        public ?string $city,
        public ?string $state,
        public ?string $postalCode,
        public ?int $addedByUserId,
        public ?string $companyAddress,
        public ?string $shippingAddress,
        public ?string $note,
        public string $status,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'salutation' => $this->salutation,
            'name' => $this->name,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'country' => $this->country,
            'gender' => $this->gender,
            'language' => $this->language,
            'client_category' => $this->clientCategory,
            'client_sub_category' => $this->clientSubCategory,
            'login_allowed' => $this->loginAllowed,
            'email_notifications' => $this->emailNotifications,
            'company_name' => $this->companyName,
            'official_website' => $this->officialWebsite,
            'tax_name' => $this->taxName,
            'gst_vat_number' => $this->gstVatNumber,
            'office_phone' => $this->officePhone,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postalCode,
            'added_by_user_id' => $this->addedByUserId,
            'company_address' => $this->companyAddress,
            'shipping_address' => $this->shippingAddress,
            'note' => $this->note,
            'status' => $this->status,
        ];
    }
}
