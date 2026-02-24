<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index()
    {
        $clinic_id = auth()->user()->clinic_id;
        $holidays = \App\Models\HR\Holiday::where('clinic_id', $clinic_id)
            ->orderBy('date', 'asc')
            ->get();

        return \Inertia\Inertia::render('HR/Holiday/Index', [
            'holidays' => $holidays
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $validated['clinic_id'] = auth()->user()->clinic_id;

        \App\Models\HR\Holiday::create($validated);

        return back()->with('success', 'Holiday created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $holiday = \App\Models\HR\Holiday::where('id', $id)
            ->where('clinic_id', auth()->user()->clinic_id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $holiday->update($validated);

        return back()->with('success', 'Holiday updated successfully.');
    }

    public function destroy(string $id)
    {
        $holiday = \App\Models\HR\Holiday::where('id', $id)
            ->where('clinic_id', auth()->user()->clinic_id)
            ->firstOrFail();

        $holiday->delete();

        return back()->with('success', 'Holiday deleted successfully.');
    }
}
