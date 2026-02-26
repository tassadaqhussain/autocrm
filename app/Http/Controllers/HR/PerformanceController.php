<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\HR\Employee;
use App\Models\HR\PerformanceReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        $clinicId = auth()->user()->clinic_id;

        $reviews = PerformanceReview::with(['employee.user', 'reviewer'])
            ->where('clinic_id', $clinicId)
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('employee.user', function ($uq) use ($request) {
                    $uq->where('name', 'like', "%{$request->search}%");
                });
            })
            ->when($request->rating, fn($q) => $q->where('rating', $request->rating))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->get();

        $employees = Employee::with('user:id,name')
            ->where('clinic_id', $clinicId)
            ->where('status', 'Active')
            ->get();

        // Stats
        $stats = [
            'total' => $reviews->count(),
            'submitted' => $reviews->where('status', 'Submitted')->count(),
            'draft' => $reviews->where('status', 'Draft')->count(),
            'avg_rating' => $reviews->count() ? round($reviews->avg('rating'), 1) : 0,
        ];

        return Inertia::render('HR/Performance/Index', [
            'reviews' => $reviews,
            'employees' => $employees,
            'stats' => $stats,
            'filters' => $request->only(['search', 'rating', 'category', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'period' => 'required|string|max:50',
            'review_date' => 'required|date',
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'required|string',
            'strengths' => 'nullable|string',
            'improvements' => 'nullable|string',
            'goals' => 'nullable|string',
            'status' => 'required|in:Draft,Submitted,Acknowledged',
        ]);

        PerformanceReview::create(array_merge($validated, [
            'clinic_id' => auth()->user()->clinic_id,
            'reviewer_id' => auth()->id(),
        ]));

        return back()->with('success', 'Review saved.');
    }

    public function update(Request $request, PerformanceReview $review)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:hr_employees,id',
            'period' => 'required|string|max:50',
            'review_date' => 'required|date',
            'rating' => 'required|integer|min:1|max:5',
            'category' => 'required|string',
            'strengths' => 'nullable|string',
            'improvements' => 'nullable|string',
            'goals' => 'nullable|string',
            'status' => 'required|in:Draft,Submitted,Acknowledged',
        ]);

        $review->update($validated);

        return back()->with('success', 'Review updated.');
    }

    public function destroy(PerformanceReview $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted.');
    }
}
