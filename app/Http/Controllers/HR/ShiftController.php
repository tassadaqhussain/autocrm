<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HR\Shift;

class ShiftController extends Controller
{
    public function index()
    {
        $shifts = Shift::withCount('employees')
            ->where('clinic_id', auth()->user()->clinic_id)
            ->get();
            
        return Inertia::render('HR/Shifts/Index', [
            'shifts' => $shifts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $validated['clinic_id'] = auth()->user()->clinic_id;

        Shift::create($validated);

        return back()->with('success', 'Shift created successfully.');
    }

    public function update(Request $request, Shift $shift)
    {
        if ($shift->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $shift->update($validated);

        return back()->with('success', 'Shift updated successfully.');
    }

    public function destroy(Shift $shift)
    {
        if ($shift->clinic_id !== auth()->user()->clinic_id) {
            abort(403);
        }

        $shift->delete();

        return back()->with('success', 'Shift deleted successfully.');
    }
}
