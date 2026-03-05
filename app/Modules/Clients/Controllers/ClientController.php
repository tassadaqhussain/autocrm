<?php

declare(strict_types=1);

namespace App\Modules\Clients\Controllers;

/**
 * Clients module controller. Flow: Request → FormRequest validation → authorize() → build DTO → ClientService → response.
 */
use App\Modules\Clients\DTOs\StoreClientDTO;
use App\Modules\Clients\DTOs\UpdateClientDTO;
use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Requests\StoreClientRequest;
use App\Modules\Clients\Requests\UpdateClientRequest;
use App\Modules\Clients\Services\ClientService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected ClientService $clientService
    ) {
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Client::class);
        $perPage = (int) $request->get('per_page', 10);
        $search = $request->get('search');
        $status = $request->get('status');
        $clients = $this->clientService->listPaginated($perPage, $search, $status);
        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => ['search' => $search, 'status' => $status, 'per_page' => $perPage],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Client::class);
        return Inertia::render('Clients/Create');
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $this->authorize('create', Client::class);
        $v = $request->validated();
        $dto = new StoreClientDTO(
            clinicId: (int) Auth::user()->clinic_id,
            salutation: $v['salutation'] ?? null,
            name: $v['name'],
            email: $v['email'] ?? null,
            mobile: $v['mobile'] ?? null,
            country: $v['country'] ?? null,
            gender: $v['gender'] ?? null,
            language: $v['language'] ?? null,
            clientCategory: $v['client_category'] ?? null,
            clientSubCategory: $v['client_sub_category'] ?? null,
            loginAllowed: (bool) ($v['login_allowed'] ?? false),
            emailNotifications: (bool) ($v['email_notifications'] ?? true),
            companyName: $v['company_name'] ?? null,
            officialWebsite: $v['official_website'] ?? null,
            taxName: $v['tax_name'] ?? null,
            gstVatNumber: $v['gst_vat_number'] ?? null,
            officePhone: $v['office_phone'] ?? null,
            city: $v['city'] ?? null,
            state: $v['state'] ?? null,
            postalCode: $v['postal_code'] ?? null,
            addedByUserId: Auth::id(),
            companyAddress: $v['company_address'] ?? null,
            shippingAddress: $v['shipping_address'] ?? null,
            note: $v['note'] ?? null,
            status: $v['status'],
        );
        $this->clientService->create($dto);
        return back()->with('success', 'Client created successfully.');
    }

    public function show(Client $client): Response
    {
        $this->authorize('view', $client);
        return Inertia::render('Clients/Show', ['client' => $client]);
    }

    public function edit(Client $client): Response
    {
        $this->authorize('update', $client);
        return Inertia::render('Clients/Edit', ['client' => $client]);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $this->authorize('update', $client);
        $v = $request->validated();
        $dto = new UpdateClientDTO(
            name: $v['name'],
            email: $v['email'] ?? null,
            mobile: $v['mobile'] ?? null,
            country: $v['country'] ?? null,
            gender: $v['gender'] ?? null,
            language: $v['language'] ?? null,
            clientCategory: $v['client_category'] ?? null,
            clientSubCategory: $v['client_sub_category'] ?? null,
            loginAllowed: (bool) ($v['login_allowed'] ?? ($client->login_allowed ?? false)),
            emailNotifications: (bool) ($v['email_notifications'] ?? ($client->email_notifications ?? true)),
            companyName: $v['company_name'] ?? null,
            officialWebsite: $v['official_website'] ?? null,
            taxName: $v['tax_name'] ?? null,
            gstVatNumber: $v['gst_vat_number'] ?? null,
            officePhone: $v['office_phone'] ?? null,
            city: $v['city'] ?? null,
            state: $v['state'] ?? null,
            postalCode: $v['postal_code'] ?? null,
            companyAddress: $v['company_address'] ?? null,
            shippingAddress: $v['shipping_address'] ?? null,
            note: $v['note'] ?? null,
            status: $v['status'],
        );
        $this->clientService->update($client, $dto);
        return back()->with('success', 'Client updated.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $this->authorize('delete', $client);
        $this->clientService->delete($client);
        return redirect()->route('clients.index')->with('success', 'Client deleted.');
    }
}
