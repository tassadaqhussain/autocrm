<?php

declare(strict_types=1);

namespace App\Modules\Deals\Policies;

use App\Models\User;
use App\Modules\Deals\Models\Deal;

class DealPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function view(User $user, Deal $deal): bool
    {
        return $user->clinic_id === $deal->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function update(User $user, Deal $deal): bool
    {
        return $user->clinic_id === $deal->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function delete(User $user, Deal $deal): bool
    {
        return $user->clinic_id === $deal->clinic_id && $user->role === 'Admin';
    }
}
