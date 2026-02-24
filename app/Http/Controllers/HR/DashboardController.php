<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\HR\Employee;

class DashboardController extends Controller
{
    public function index()
    {
        $clinicId = auth()->user()->clinic_id;

        return Inertia::render('HR/Dashboard', [
            'stats' => [
                'total_employees' => Employee::where('clinic_id', $clinicId)->count(),
                'active_employees' => Employee::where('clinic_id', $clinicId)->where('status', 'Active')->count(),
                'on_leave' => Employee::where('clinic_id', $clinicId)->where('status', 'On Leave')->count(),
                'pending_leaves' => 0, // To be implemented
            ]
        ]);
    }
}
