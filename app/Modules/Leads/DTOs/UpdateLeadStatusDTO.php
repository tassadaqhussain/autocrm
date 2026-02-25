<?php

declare(strict_types=1);

namespace App\Modules\Leads\DTOs;

final readonly class UpdateLeadStatusDTO
{
    public function __construct(
        public string $status,
    ) {}
}
