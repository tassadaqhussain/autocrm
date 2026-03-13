<?php

declare(strict_types=1);

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\ProjectCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectCategoryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        ProjectCategory::create([
            'clinic_id' => Auth::user()->clinic_id,
            'name' => $request->name,
        ]);

        return back()->with('success', 'Project category created successfully.');
    }

    public function destroy(ProjectCategory $projectCategory): RedirectResponse
    {
        if ($projectCategory->clinic_id !== Auth::user()->clinic_id) {
            abort(403);
        }

        $projectCategory->delete();

        return back()->with('success', 'Project category deleted successfully.');
    }
}
