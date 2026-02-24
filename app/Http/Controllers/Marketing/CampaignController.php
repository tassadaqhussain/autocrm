<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketing/Campaigns/Index', [
            'campaigns' => Campaign::with(['manager', 'leads'])
                ->where('clinic_id', auth()->user()->clinic_id)
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Marketing/Campaigns/Create', [
            'managers' => User::where('clinic_id', auth()->user()->clinic_id)
                ->whereIn('role', ['Admin', 'Media Manager'])
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'channel' => 'required|string',
            'objective' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'budget_type' => 'required|string|in:Daily,Lifetime',
            'assigned_manager_id' => 'nullable|exists:users,id',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'required|string',
        ]);

        $validated['clinic_id'] = auth()->user()->clinic_id;

        $campaign = Campaign::create($validated);

        return redirect()->route('marketing.campaigns.index')->with('success', 'Campaign created successfully.');
    }

    public function show(Campaign $campaign): Response
    {
        return Inertia::render('Marketing/Campaigns/Show', [
            'campaign' => $campaign->load(['manager', 'leads', 'expenses', 'creatives']),
        ]);
    }

    public function builder(): Response
    {
        return Inertia::render('Marketing/Campaigns/Builder', [
            'clinic_accounts' => [
                ['id' => 1, 'name' => 'Elite Medical Meta'],
                ['id' => 2, 'name' => 'EMC Google Ads'],
            ]
        ]);
    }
}
