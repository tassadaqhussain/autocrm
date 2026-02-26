<?php

use App\Modules\Work\Controllers\ContractController;
use App\Modules\Work\Controllers\ProjectController;
use App\Modules\Work\Controllers\TaskController;
use App\Modules\Work\Controllers\TimesheetController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('work')->group(function () {
    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Contracts
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');
    // ... we can add store/update as we build their drawers

    // Tasks
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    // ... we can add store/update as we build their drawers

    // Timesheets
    Route::get('/timesheets', [TimesheetController::class, 'index'])->name('timesheets.index');
});
