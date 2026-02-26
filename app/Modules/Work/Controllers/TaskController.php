<?php

namespace App\Modules\Work\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Work\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['project', 'users'])
            ->where('clinic_id', auth()->user()->clinic_id)
            ->latest()
            ->get();

        return Inertia::render('Work/Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }
}
