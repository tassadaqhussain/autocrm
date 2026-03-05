<?php

declare(strict_types=1);

namespace App\Modules\Work\DTOs;

class StoreContractDTO
{
    public function __construct(
        public readonly int $clinicId,
        public readonly string $subject,
        public readonly int $clientId,
        public readonly float $amount,
        public readonly string $startDate,
        public readonly ?string $endDate = null,
        public readonly ?string $description = null,
        public readonly ?string $contract_number = null,
        public readonly ?int $project_id = null,
        public readonly ?int $contract_type_id = null,
        public readonly ?string $currency = 'USD ($)',
        public readonly ?string $cell = null,
        public readonly ?string $office_phone = null,
        public readonly ?string $city = null,
        public readonly ?string $state = null,
        public readonly ?string $country = null,
        public readonly ?string $postal_code = null,
        public readonly ?string $alternate_address = null,
        public readonly ?string $notes = null,
    ) {
    }
}
