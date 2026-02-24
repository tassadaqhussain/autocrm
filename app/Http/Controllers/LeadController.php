<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $view = $request->get('view', 'list');

        if ($view === 'pipeline') {
            return $this->pipeline();
        }

        return Inertia::render('Leads/Index', [
            'leads' => Lead::with(['campaign', 'counselor'])->latest()->get(),
        ]);
    }

    public function pipeline(): Response
    {
        $leads = Lead::with(['campaign', 'counselor'])->latest()->get();
        return Inertia::render('Leads/Pipeline', [
            'leads' => $leads,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Leads/Create', [
            'campaigns' => \App\Models\Campaign::all(),
            'counselors' => User::where('role', 'Counselor')->get(),
        ]);
    }

    public function updateStatus(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:New,Contacted,Appointment Scheduled,Consultation Done',
        ]);

        $lead->update(['status' => $validated['status']]);

        return back()->with('success', 'Lead status updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'required|string',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'counselor_id' => 'nullable|exists:users,id',
            'bmi' => 'nullable|numeric',
            'health_info' => 'nullable|string',
            'urgency' => 'nullable|string',
        ]);

        // Balanced Auto-assignment (Round Robin)
        if (empty($validated['counselor_id'])) {
            $counselor = User::where('role', 'Counselor')
                ->withCount(['leads' => function($query) {
                    $query->where('created_at', '>=', now()->subDay());
                }])
                ->orderBy('leads_count', 'asc')
                ->first();
                
            if ($counselor) {
                $validated['counselor_id'] = $counselor->id;
            }
        }

        // Simple Lead Scoring Logic
        $score = 0;
        if (!empty($validated['bmi'])) {
            $bmi = (float) $validated['bmi'];
            if ($bmi > 30 || $bmi < 18) $score += 20;
        }
        if (!empty($validated['urgency']) && $validated['urgency'] === 'High') $score += 30;
        if ($validated['source'] === 'WhatsApp (Meta Ads)') $score += 25;
        
        $validated['score'] = $score;
        $validated['status'] = 'New';

        Lead::create($validated);

        return redirect()->route('leads.index')->with('success', 'Lead created successfully.');
    }

    public function show(Lead $lead): Response
    {
        return Inertia::render('Leads/Show', [
            'lead' => $lead->load(['campaign', 'counselor', 'consultation', 'mediaConsent', 'alerts']),
            'counselors' => User::where('role', 'Counselor')->get(),
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'counselor_id' => 'nullable|exists:users,id',
            'bmi' => 'nullable|numeric',
            'health_info' => 'nullable|string',
            'urgency' => 'nullable|string',
        ]);

        $lead->update($validated);

        return back()->with('success', 'Lead updated.');
    }
}
