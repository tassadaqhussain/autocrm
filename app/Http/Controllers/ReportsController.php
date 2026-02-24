<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(): Response
    {
        // Mocking some rich analytical data for the premium reports page
        return Inertia::render('Reports/Index', [
            'performance_metrics' => [
                'conversion_rate' => 24.8,
                'total_revenue' => 145200,
                'cost_per_acquisition' => 342,
                'roi' => 3.2
            ],
            'channel_breakdown' => [
                ['name' => 'Meta Ads', 'leads' => 450, 'conversion' => 18, 'color' => '#1877F2'],
                ['name' => 'Google Search', 'leads' => 320, 'conversion' => 22, 'color' => '#4285F4'],
                ['name' => 'WhatsApp', 'leads' => 890, 'conversion' => 12, 'color' => '#25D366'],
                ['name' => 'TikTok', 'leads' => 180, 'conversion' => 8, 'color' => '#EE1D52'],
            ],
            'monthly_trends' => [
                ['month' => 'Jan', 'leads' => 120, 'revenue' => 45000],
                ['month' => 'Feb', 'leads' => 180, 'revenue' => 62000],
                ['month' => 'Mar', 'leads' => 150, 'revenue' => 51000],
                ['month' => 'Apr', 'leads' => 210, 'revenue' => 84000],
                ['month' => 'May', 'leads' => 280, 'revenue' => 110000],
            ]
        ]);
    }
}
