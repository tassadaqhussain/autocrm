<?php

declare(strict_types=1);

namespace App\Modules\Work\Policies;

use App\Models\User;
use App\Modules\Work\Models\Task;

class TaskPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function view(User $user, Task $task): bool
    {
        return $user->clinic_id === $task->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function update(User $user, Task $task): bool
    {
        return $user->clinic_id === $task->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->clinic_id === $task->clinic_id && $user->role === 'Admin';
    }
}
