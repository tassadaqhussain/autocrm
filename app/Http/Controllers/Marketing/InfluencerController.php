<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\MarketingInfluencer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InfluencerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Influencers/Index', [
            'influencers' => MarketingInfluencer::where('clinic_id', auth()->user()->clinic_id)->withCount('leads')->get(),
        ]);
    }
}
