<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\Timesheet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimesheetController extends Controller
{
    public function index()
    {
        $timesheets = Timesheet::with(['task', 'user'])
            ->where('clinic_id', auth()->user()->clinic_id)
            ->latest()
            ->get();

        return Inertia::render('Work/Timesheets/Index', [
            'timesheets' => $timesheets,
        ]);
    }
}
