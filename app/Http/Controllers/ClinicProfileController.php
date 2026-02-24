<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClinicProfileController extends Controller
{
    public function show()
    {
        $clinic = auth()->user()->clinic;
        return Inertia::render('HR/Clinic/Profile', [
            'clinic' => $clinic
        ]);
    }

    public function update(Request $request)
    {
        $clinic = auth()->user()->clinic;
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // In the future we update settings too.
        ]);

        $clinic->update($validated);
        
        return back()->with('success', 'Profile updated successfully.');
    }
}
