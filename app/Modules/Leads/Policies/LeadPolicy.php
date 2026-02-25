<?php

declare(strict_types=1);

namespace App\Modules\Leads\Policies;

use App\Models\User;
use App\Modules\Leads\Models\Lead;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->clinic_id === $lead->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function update(User $user, Lead $lead): bool
    {
        return $user->clinic_id === $lead->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function delete(User $user, Lead $lead): bool
    {
        return $user->clinic_id === $lead->clinic_id && $user->role === 'Admin';
    }
}
