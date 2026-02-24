<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\Designation;
use App\Models\HR\Department;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function index()
    {
        $designations = Designation::with('department')->whereHas('department', function ($query) {
            $query->where('clinic_id', auth()->user()->clinic_id);
        })->get();
        
        $departments = Department::where('clinic_id', auth()->user()->clinic_id)->get();

        return \Inertia\Inertia::render('HR/Designations/Index', [
            'designations' => $designations,
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|exists:hr_departments,id',
        ]);

        Designation::create($validated);

        return redirect()->back()->with('success', 'Designation created successfully.');
    }

    public function update(Request $request, Designation $designation)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|exists:hr_departments,id',
        ]);

        $designation->update($validated);
        return redirect()->back()->with('success', 'Designation updated successfully.');
    }

    public function destroy(Designation $designation)
    {
        $designation->delete();
        return redirect()->back()->with('success', 'Designation deleted successfully.');
    }
}
