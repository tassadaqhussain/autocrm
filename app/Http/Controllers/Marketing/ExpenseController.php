<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\MarketingExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Finance/Index', [
            'expenses' => MarketingExpense::where('clinic_id', auth()->user()->clinic_id)->with('campaign')->get(),
        ]);
    }
}
