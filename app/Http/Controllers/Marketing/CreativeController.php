<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\MarketingCreative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreativeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Creatives/Index', [
            'creatives' => MarketingCreative::where('clinic_id', auth()->user()->clinic_id)->get(),
        ]);
    }
}
