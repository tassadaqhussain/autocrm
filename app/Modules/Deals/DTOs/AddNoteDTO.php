<?php

declare(strict_types=1);

namespace App\Modules\Deals\DTOs;

final readonly class AddNoteDTO
{
    public function __construct(
        public int $clinicId,
        public string $detail,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'detail' => $this->detail,
        ];
    }
}
