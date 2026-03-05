<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\Contract;
use App\Modules\Clients\Models\Client;
use App\Modules\Work\Requests\StoreContractRequest;
use App\Modules\Work\Models\ContractType;
use App\Modules\Work\Models\ContractTemplate;
use App\Modules\Work\DTOs\StoreContractDTO;
use App\Modules\Work\Services\ContractService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Modules\Work\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContractController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected ContractService $contractService
    ) {
    }
    public function index()
    {
        $this->authorize('viewAny', Contract::class);

        $contracts = Contract::with(['client'])
            ->where('clinic_id', Auth::user()->clinic_id)
            ->latest()
            ->get();

        $clients = Client::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'name')
            ->get();

        $contractTypes = ContractType::where('clinic_id', Auth::user()->clinic_id)->get();

        $projects = Project::where('clinic_id', Auth::user()->clinic_id)
            ->select('id', 'project_name')
            ->get();

        return Inertia::render('Work/Contracts/Index', [
            'contracts' => $contracts,
            'clients' => $clients,
            'projects' => $projects,
            'contractTypes' => $contractTypes,
        ]);
    }

    public function store(StoreContractRequest $request)
    {
        $this->authorize('create', Contract::class);

        $v = $request->validated();

        $dto = new StoreContractDTO(
            clinicId: (int) Auth::user()->clinic_id,
            subject: $v['subject'],
            clientId: (int) $v['client_id'],
            amount: (float) $v['amount'],
            startDate: $v['start_date'],
            endDate: $v['end_date'] ?? null,
            description: $v['description'] ?? null,
            contract_number: $v['contract_number'] ?? null,
            project_id: isset($v['project_id']) ? (int) $v['project_id'] : null,
            contract_type_id: isset($v['contract_type_id']) ? (int) $v['contract_type_id'] : null,
            currency: $v['currency'] ?? 'USD ($)',
            cell: $v['cell'] ?? null,
            office_phone: $v['office_phone'] ?? null,
            city: $v['city'] ?? null,
            state: $v['state'] ?? null,
            country: $v['country'] ?? null,
            postal_code: $v['postal_code'] ?? null,
            alternate_address: $v['alternate_address'] ?? null,
            notes: $v['notes'] ?? null,
        );

        $this->contractService->createContract($dto);

        return back()->with('success', 'Contract drafted successfully.');
    }

    public function templates()
    {
        $templates = ContractTemplate::where('clinic_id', Auth::user()->clinic_id)
            ->latest()
            ->get();

        $contractTypes = ContractType::where('clinic_id', Auth::user()->clinic_id)->get();

        return Inertia::render('Work/Contracts/Templates', [
            'templates' => $templates,
            'contractTypes' => $contractTypes,
        ]);
    }
}
