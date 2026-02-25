<?php

declare(strict_types=1);

namespace App\Modules\Clients\Policies;

use App\Models\User;
use App\Modules\Clients\Models\Client;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function view(User $user, Client $client): bool
    {
        return $user->clinic_id === $client->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function update(User $user, Client $client): bool
    {
        return $user->clinic_id === $client->clinic_id
            && in_array($user->role, ['Admin', 'Counselor', 'Media Manager'], true);
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->clinic_id === $client->clinic_id && $user->role === 'Admin';
    }
}
