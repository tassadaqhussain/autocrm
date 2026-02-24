<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Lead;
use App\Models\Marketing\MarketingExpense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $clinic_id = auth()->user()->clinic_id;

        $stats = [
            'total_campaigns' => Campaign::where('clinic_id', $clinic_id)->count(),
            'active_campaigns' => Campaign::where('clinic_id', $clinic_id)->where('status', 'Active')->count(),
            'total_leads' => Lead::where('clinic_id', $clinic_id)->count(),
            'total_spend' => MarketingExpense::where('clinic_id', $clinic_id)->sum('amount'),
            'cpl' => 0, // Calculated below
            'conversion_rate' => 0,
        ];

        if ($stats['total_leads'] > 0) {
            $stats['cpl'] = $stats['total_spend'] / $stats['total_leads'];
        }

        $leads_by_source = Lead::where('clinic_id', $clinic_id)
            ->selectRaw('source, count(*) as count')
            ->groupBy('source')
            ->get();

        $performance_data = Lead::where('clinic_id', $clinic_id)
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Marketing/Dashboard', [
            'stats' => $stats,
            'leads_by_source' => $leads_by_source,
            'performance_data' => $performance_data,
        ]);
    }
}
