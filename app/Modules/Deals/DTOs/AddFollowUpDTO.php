<?php

declare(strict_types=1);

namespace App\Modules\Deals\DTOs;

final readonly class AddFollowUpDTO
{
    public function __construct(
        public int $clinicId,
        public string $nextFollowUpDate,
        public string $startTime,
        public bool $sendReminder,
        public ?string $remark,
        public string $status,
    ) {}

    public function toArray(): array
    {
        return [
            'clinic_id' => $this->clinicId,
            'next_follow_up_date' => $this->nextFollowUpDate,
            'start_time' => $this->startTime,
            'send_reminder' => $this->sendReminder,
            'remark' => $this->remark,
            'status' => $this->status,
        ];
    }
}
