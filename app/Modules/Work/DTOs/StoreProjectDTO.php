<?php

declare(strict_types=1);

namespace App\Modules\Work\DTOs;

class StoreProjectDTO
{
    public function __construct(
        public ?int $clinicId,
        public string $projectName,
        public ?string $shortCode = null,
        public ?int $clientId = null,
        public ?int $categoryId = null,
        public ?int $departmentId = null,
        public ?string $description = null,
        public ?string $summary = null,
        public ?string $notes = null,
        public ?string $startDate = null,
        public ?string $deadline = null,
        public bool $noDeadline = false,
        public string $status = 'Not Started',
        public float $budget = 0.0,
        public string $currency = 'SAR',
        public ?float $hoursEstimate = null,
        public bool $publicGanttChart = false,
        public bool $publicTaskBoard = false,
        public bool $taskApproval = false,
        public bool $isPublic = false,
        public bool $allowManualTimeLogs = false,
        public bool $enableMiroboard = false,
        public bool $sendTaskNotification = false,
        public array $memberIds = [],
    ) {
    }
}
