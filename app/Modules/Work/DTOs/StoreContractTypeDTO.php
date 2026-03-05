<?php

declare(strict_types=1);

namespace App\Modules\Work\DTOs;

class StoreContractTypeDTO
{
    public function __construct(
        public readonly int $clinicId,
        public readonly string $name,
    ) {
    }
}
