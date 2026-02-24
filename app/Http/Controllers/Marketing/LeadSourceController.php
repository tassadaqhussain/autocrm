<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\MarketingLeadSource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadSourceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Sources/Index', [
            'sources' => MarketingLeadSource::where('clinic_id', auth()->user()->clinic_id)->get(),
        ]);
    }
}
