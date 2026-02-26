<?php

declare(strict_types=1);

namespace App\Modules\Work\DTOs;

class StoreProjectDTO
{
    public function __construct(
        public int $clinicId,
        public string $projectName,
        public ?int $clientId = null,
        public ?string $description = null,
        public ?string $startDate = null,
        public ?string $deadline = null,
        public string $status = 'Not Started',
        public float $budget = 0.0,
    ) {
    }
}
