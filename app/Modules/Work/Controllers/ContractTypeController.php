<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Requests\StoreContractTypeRequest;
use App\Modules\Work\DTOs\StoreContractTypeDTO;
use App\Modules\Work\Services\ContractService;
use Illuminate\Support\Facades\Auth;

class ContractTypeController extends Controller
{
    public function __construct(
        protected ContractService $contractService
    ) {
    }

    public function store(StoreContractTypeRequest $request)
    {
        $v = $request->validated();

        $dto = new StoreContractTypeDTO(
            clinicId: (int) Auth::user()->clinic_id,
            name: $v['name'],
        );

        $this->contractService->createContractType($dto);

        return back()->with('success', 'Contract type created successfully.');
    }
}
