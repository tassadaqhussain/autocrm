<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HR\Leave;
use App\Models\HR\LeaveType;
use App\Models\HR\Employee;
use Illuminate\Support\Facades\Storage;

class LeaveController extends Controller
{
    public function index(Request $request)
    {
        $clinic_id = auth()->user()->clinic_id;

        $employees = Employee::with('user:id,name,email')
            ->where('clinic_id', $clinic_id)
            ->get();

        $leaveTypes = LeaveType::where('clinic_id', $clinic_id)->get();

        $query = Leave::with(['employee.user', 'leaveType'])
            ->whereHas('employee', function ($q) use ($clinic_id) {
                $q->where('clinic_id', $clinic_id);
            });

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employee.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('leave_type_id', $request->type);
        }

        $leaves = $query->latest()->get();

        return Inertia::render('HR/Leave/Index', [
            'leaves' => $leaves,
            'employees' => $employees,
            'leaveTypes' => $leaveTypes,
            'filters' => $request->only(['search', 'status', 'type'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'leave_type_id' => 'required|exists:hr_leave_types,id',
            'duration_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'status' => 'required|string|in:Pending,Approved,Rejected',
            'attachment' => 'nullable|file|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('leaves', 'public');
        }

        Leave::create($validated);

        return back()->with('success', 'Leave request created successfully.');
    }

    public function update(Request $request, Leave $leave)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'leave_type_id' => 'required|exists:hr_leave_types,id',
            'duration_type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
            'status' => 'required|string|in:Pending,Approved,Rejected',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            if ($leave->attachment) {
                Storage::disk('public')->delete($leave->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('leaves', 'public');
        } else {
            unset($validated['attachment']);
        }

        $leave->update($validated);

        return back()->with('success', 'Leave request updated successfully.');
    }

    public function destroy(Leave $leave)
    {
        if ($leave->attachment) {
            Storage::disk('public')->delete($leave->attachment);
        }
        $leave->delete();

        return back()->with('success', 'Leave request deleted successfully.');
    }

    public function approve(Leave $leave)
    {
        $leave->update([
            'status' => 'Approved',
            'approved_by' => auth()->id()
        ]);
        return back()->with('success', 'Leave approved.');
    }

    public function reject(Leave $leave)
    {
        $leave->update([
            'status' => 'Rejected',
            'approved_by' => auth()->id()
        ]);
        return back()->with('success', 'Leave rejected.');
    }

    public function quickStoreType(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Note: Migration doesn't have these yet, so we only save name for now
            // or we could update the migration.
        ]);

        $type = LeaveType::create([
            'name' => $validated['name'],
            'clinic_id' => auth()->user()->clinic_id,
            'days_per_year' => 0 // Default
        ]);

        return back()->with('success', 'Leave type created.');
    }
}
