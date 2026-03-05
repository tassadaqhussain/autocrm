<?php

declare(strict_types=1);

namespace App\Modules\Work\Services;

use App\Modules\Work\Models\Contract;
use App\Modules\Work\Models\ContractType;
use App\Modules\Work\Models\ContractTemplate;
use App\Modules\Work\DTOs\StoreContractDTO;
use App\Modules\Work\DTOs\StoreContractTypeDTO;
use App\Modules\Work\DTOs\StoreContractTemplateDTO;

class ContractService
{
    public function createContract(StoreContractDTO $dto): Contract
    {
        return Contract::create([
            'clinic_id' => $dto->clinicId,
            'subject' => $dto->subject,
            'client_id' => $dto->clientId,
            'project_id' => $dto->project_id,
            'contract_type_id' => $dto->contract_type_id,
            'contract_number' => $dto->contract_number,
            'amount' => $dto->amount,
            'currency' => $dto->currency,
            'start_date' => $dto->startDate,
            'end_date' => $dto->endDate,
            'description' => $dto->description,
            'cell' => $dto->cell,
            'office_phone' => $dto->office_phone,
            'city' => $dto->city,
            'state' => $dto->state,
            'country' => $dto->country,
            'postal_code' => $dto->postal_code,
            'alternate_address' => $dto->alternate_address,
            'notes' => $dto->notes,
            'status' => 'Draft',
        ]);
    }

    public function createContractType(StoreContractTypeDTO $dto): ContractType
    {
        return ContractType::create([
            'clinic_id' => $dto->clinicId,
            'name' => $dto->name,
        ]);
    }

    public function createContractTemplate(StoreContractTemplateDTO $dto): ContractTemplate
    {
        return ContractTemplate::create([
            'clinic_id' => $dto->clinicId,
            'subject' => $dto->subject,
            'contract_type_id' => $dto->contractTypeId,
            'amount' => $dto->amount,
            'currency' => $dto->currency,
            'description' => $dto->description,
        ]);
    }
}
