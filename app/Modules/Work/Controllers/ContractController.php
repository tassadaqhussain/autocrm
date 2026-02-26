<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['client'])
            ->where('clinic_id', auth()->user()->clinic_id)
            ->latest()
            ->get();

        return Inertia::render('Work/Contracts/Index', [
            'contracts' => $contracts,
        ]);
    }
}
