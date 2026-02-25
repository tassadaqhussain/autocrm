<?php

declare(strict_types=1);

namespace App\Modules\Deals\DTOs;

final readonly class UpdateDealStageDTO
{
    public function __construct(
        public string $stage,
    ) {}
}
