<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Campaigns/Index', [
            'campaigns' => Campaign::latest()->get(),
        ]);
    }

    public function builder(): Response
    {
        return Inertia::render('Campaigns/Builder', [
            'clinic_accounts' => [
                ['id' => 1, 'name' => 'Elite Medical Meta'],
                ['id' => 2, 'name' => 'EMC Google Ads'],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'objective' => 'required|string',
            'type' => 'required|string',
            'ad_copy' => 'nullable|string',
            'ad_creative_url' => 'nullable|string',
            'target_audience' => 'nullable|array',
            'budget' => 'required|numeric|min:0',
            'budget_type' => 'required|string|in:Daily,Lifetime',
            'status' => 'required|string',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
        ]);

        $validated['clinic_id'] = auth()->user()->clinic_id;

        $campaign = Campaign::create($validated);

        return redirect()->route('campaigns.index')->with('success', 'Campaign launched successfully.');
    }
    public function show(Campaign $campaign): Response
    {
        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign->load('clinic'),
        ]);
    }
}
