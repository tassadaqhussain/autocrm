<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\Department;
use App\Models\HR\Designation;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('designations')->where('clinic_id', auth()->user()->clinic_id)->get();
        return \Inertia\Inertia::render('HR/Departments/Index', [
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Department::create([
            'name' => $validated['name'],
            'clinic_id' => auth()->user()->clinic_id,
        ]);

        return redirect()->back()->with('success', 'Department created successfully.');
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department->update(['name' => $validated['name']]);
        return redirect()->back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return redirect()->back()->with('success', 'Department deleted successfully.');
    }
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $department = Department::create([
            'name' => $validated['name'],
            'clinic_id' => auth()->user()->clinic_id,
        ]);

        return response()->json($department);
    }

    public function quickStoreDesignation(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|exists:hr_departments,id',
        ]);

        $designation = Designation::create($validated);

        return response()->json($designation);
    }
}
