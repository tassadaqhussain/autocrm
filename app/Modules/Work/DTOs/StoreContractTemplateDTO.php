<?php

declare(strict_types=1);

namespace App\Modules\Work\DTOs;

class StoreContractTemplateDTO
{
    public function __construct(
        public readonly int $clinicId,
        public readonly string $subject,
        public readonly int $contractTypeId,
        public readonly float $amount,
        public readonly string $currency,
        public readonly ?string $description = null,
    ) {
    }
}
