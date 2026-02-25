<?php

declare(strict_types=1);

namespace App\Modules\Clients\Services;

use App\Modules\Clients\DTOs\StoreClientDTO;
use App\Modules\Clients\DTOs\UpdateClientDTO;
use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Repositories\ClientRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClientService
{
    public function __construct(
        protected ClientRepository $clientRepository
    ) {}

    public function create(StoreClientDTO $dto): Client
    {
        return $this->clientRepository->create($dto->toArray());
    }

    public function update(Client $client, UpdateClientDTO $dto): bool
    {
        return $this->clientRepository->update($client, $dto->toArray());
    }

    public function listPaginated(int $perPage = 10, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->clientRepository->listPaginated($perPage, $search, $status);
    }

    public function delete(Client $client): bool
    {
        return (bool) $this->clientRepository->delete($client);
    }
}
