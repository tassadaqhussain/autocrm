<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppreciationController extends Controller
{
    public function index()
    {
        $clinic_id = auth()->user()->clinic_id;

        $employees = \App\Models\HR\Employee::with('user:id,name')->where('clinic_id', $clinic_id)->get();

        $appreciations = \App\Models\HR\Appreciation::with(['employee.user', 'givenBy'])
            ->where('clinic_id', $clinic_id)
            ->latest('given_date')
            ->get();

        return \Inertia\Inertia::render('HR/Appreciation/Index', [
            'appreciations' => $appreciations,
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'given_date' => 'required|date',
        ]);

        $validated['clinic_id'] = auth()->user()->clinic_id;
        $validated['given_by'] = auth()->id();

        \App\Models\HR\Appreciation::create($validated);

        return back()->with('success', 'Appreciation added successfully.');
    }

    public function update(Request $request, string $id)
    {
        $appreciation = \App\Models\HR\Appreciation::where('id', $id)
            ->where('clinic_id', auth()->user()->clinic_id)
            ->firstOrFail();

        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'given_date' => 'required|date',
        ]);

        $appreciation->update($validated);

        return back()->with('success', 'Appreciation updated successfully.');
    }

    public function destroy(string $id)
    {
        $appreciation = \App\Models\HR\Appreciation::where('id', $id)
            ->where('clinic_id', auth()->user()->clinic_id)
            ->firstOrFail();

        $appreciation->delete();

        return back()->with('success', 'Appreciation deleted successfully.');
    }
}
