<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppreciationController extends Controller
{
    public function index(Request $request)
    {
        $clinic_id = auth()->user()->clinic_id;

        $employees = \App\Models\HR\Employee::with('user:id,name')->where('clinic_id', $clinic_id)->get();
        $awards = \App\Models\HR\Award::where('clinic_id', $clinic_id)->get();

        $query = \App\Models\HR\Appreciation::with(['employee.user', 'givenBy', 'award'])
            ->where('clinic_id', $clinic_id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employee.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('award')) {
            $query->where('award_id', $request->award);
        }

        $appreciations = $query->latest('given_date')->get();

        return \Inertia\Inertia::render('HR/Appreciation/Index', [
            'appreciations' => $appreciations,
            'employees' => $employees,
            'awards' => $awards,
            'filters' => $request->only(['search', 'award'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'award_id' => 'nullable|exists:hr_awards,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'given_date' => 'required|date',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('hr/appreciations', 'public');
        }

        $validated['clinic_id'] = auth()->user()->clinic_id;
        $validated['given_by'] = auth()->id();

        $appreciation = \App\Models\HR\Appreciation::create($validated);

        // Find Employee to email
        $employee = \App\Models\HR\Employee::with('user:id,name,email')->find($validated['employee_id']);
        // No email logic change for now, just keep it or remove if not needed.
        // User screenshot didn't show CC email, so I'll keep the storage basic for now.

        return back()->with('success', 'Appreciation added successfully.');
    }

    public function update(Request $request, string $id)
    {
        $appreciation = \App\Models\HR\Appreciation::where('id', $id)
            ->where('clinic_id', auth()->user()->clinic_id)
            ->firstOrFail();

        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'award_id' => 'nullable|exists:hr_awards,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'given_date' => 'required|date',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('hr/appreciations', 'public');
        }

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

    public function quickStoreAward(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string',
            'color' => 'required|string|max:10',
            'summary' => 'nullable|string',
        ]);

        $award = \App\Models\HR\Award::create([
            ...$validated,
            'clinic_id' => auth()->user()->clinic_id,
        ]);

        return response()->json($award);
    }
}
