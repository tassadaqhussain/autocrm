<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttributionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Attribution/Dashboard', [
            'attribution_data' => Lead::where('clinic_id', auth()->user()->clinic_id)
                ->selectRaw('utm_source, count(*) as count')
                ->groupBy('utm_source')
                ->get(),
        ]);
    }
}
