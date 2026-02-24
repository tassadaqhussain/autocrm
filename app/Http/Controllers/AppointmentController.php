<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with(['lead', 'doctor'])
            ->where('clinic_id', auth()->user()->clinic_id)
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'doctors' => User::where('role', 'Doctor')->where('clinic_id', auth()->user()->clinic_id)->get(),
            'leads' => Lead::where('clinic_id', auth()->user()->clinic_id)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'doctor_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date',
            'duration' => 'required|integer|min:15',
            'type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        Appointment::create([
            ...$validated,
            'clinic_id' => auth()->user()->clinic_id,
            'status' => 'Confirmed'
        ]);

        return redirect()->back()->with('success', 'Appointment scheduled successfully.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string',
            'scheduled_at' => 'sometimes|date',
        ]);

        $appointment->update($validated);

        return redirect()->back();
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back();
    }
}
