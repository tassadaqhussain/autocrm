<?php

declare(strict_types=1);

namespace App\Modules\Work\Policies;

use App\Models\User;
use App\Modules\Work\Models\Timesheet;

class TimesheetPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function view(User $user, Timesheet $timesheet): bool
    {
        return $user->clinic_id === $timesheet->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function update(User $user, Timesheet $timesheet): bool
    {
        return $user->clinic_id === $timesheet->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function delete(User $user, Timesheet $timesheet): bool
    {
        return $user->clinic_id === $timesheet->clinic_id && $user->role === 'Admin';
    }
}
