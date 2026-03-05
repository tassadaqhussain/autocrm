<?php

declare(strict_types=1);

namespace App\Modules\Work\Policies;

use App\Models\User;
use App\Modules\Work\Models\Contract;

class ContractPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function view(User $user, Contract $contract): bool
    {
        return $user->clinic_id === $contract->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function update(User $user, Contract $contract): bool
    {
        return $user->clinic_id === $contract->clinic_id
            && in_array($user->role, ['Admin', 'Manager'], true);
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->clinic_id === $contract->clinic_id && $user->role === 'Admin';
    }
}
