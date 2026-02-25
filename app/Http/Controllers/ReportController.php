<?php

namespace App\Http\Controllers;

use App\Modules\Leads\Models\Lead;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(): Response
    {
        // Daily Stats Simulation
        $dailyStats = [
            'calls' => [
                'received' => 24,
                'answered' => 18,
                'pending' => 6
            ],
            'messages' => [
                'received' => 45,
                'replied' => 40,
                'follow_up' => 5
            ],
            'appointments' => [
                'scheduled' => 8,
                'completed' => 5
            ]
        ];

        // Campaign Performance
        $campaignPerformance = Campaign::withCount('leads')
            ->get()
            ->map(function ($campaign) {
                return [
                    'name' => $campaign->name,
                    'leads' => $campaign->leads_count,
                    'conversion_rate' => rand(10, 25) . '%', // Simulated
                    'roi' => rand(2, 5) . 'x', // Simulated
                ];
            });

        return Inertia::render('Reports/Index', [
            'daily_stats' => $dailyStats,
            'campaign_performance' => $campaignPerformance,
            'counselor_comparison' => Lead::select('counselor_id', DB::raw('count(*) as total'))
                ->with('counselor')
                ->groupBy('counselor_id')
                ->get(),
        ]);
    }
}
