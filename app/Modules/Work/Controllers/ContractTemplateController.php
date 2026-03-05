<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Requests\StoreContractTemplateRequest;
use App\Modules\Work\DTOs\StoreContractTemplateDTO;
use App\Modules\Work\Services\ContractService;
use Illuminate\Support\Facades\Auth;

class ContractTemplateController extends Controller
{
    public function __construct(
        protected ContractService $contractService
    ) {
    }

    public function store(StoreContractTemplateRequest $request)
    {
        $v = $request->validated();

        $dto = new StoreContractTemplateDTO(
            clinicId: (int) Auth::user()->clinic_id,
            subject: $v['subject'],
            contractTypeId: (int) $v['contract_type_id'],
            amount: (float) $v['amount'],
            currency: $v['currency'],
            description: $v['description'] ?? null,
        );

        $this->contractService->createContractTemplate($dto);

        return back()->with('success', 'Contract template created successfully.');
    }
}
