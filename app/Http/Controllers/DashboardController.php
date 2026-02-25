<?php

namespace App\Http\Controllers;

use App\Modules\Leads\Models\Lead;
use App\Models\Campaign;
use App\Models\Alert;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_leads' => Lead::count(),
                'new_leads' => Lead::where('status', 'New')->count(),
                'appointments' => Lead::where('status', 'Appointment Scheduled')->count(),
                'active_campaigns' => Campaign::count(),
            ],
            'recent_leads' => Lead::with('campaign')->latest()->take(5)->get(),
            'pending_alerts' => Alert::with('lead')->where('status', 'Pending')->latest()->take(5)->get(),
        ]);
    }
}
