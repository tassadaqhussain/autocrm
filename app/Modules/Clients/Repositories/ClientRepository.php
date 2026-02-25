<?php

declare(strict_types=1);

namespace App\Modules\Clients\Repositories;

use App\Modules\Clients\Models\Client;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ClientRepository
{
    public function create(array $data): Client
    {
        return Client::create($data);
    }

    public function findById(int $id): ?Client
    {
        return Client::find($id);
    }

    public function listPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Client::query()->latest();

        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($status !== null && $status !== '' && $status !== 'All') {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function update(Client $client, array $data): bool
    {
        return $client->update($data);
    }

    public function delete(Client $client): ?bool
    {
        return $client->delete();
    }
}
