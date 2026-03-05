<?php

use App\Modules\Work\Controllers\ContractController;
use App\Modules\Work\Controllers\ProjectController;
use App\Modules\Work\Controllers\TaskController;
use App\Modules\Work\Controllers\TimesheetController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('work')->group(function () {
    // Projects
    Route::resource('projects', ProjectController::class);

    // Contracts
    Route::get('contracts/templates', [ContractController::class, 'templates'])->name('contracts.templates');
    Route::resource('contracts', ContractController::class);

    // Contract Templates
    Route::post('contracts/templates', \App\Modules\Work\Controllers\ContractTemplateController::class . '@store')->name('contracts.templates.store');

    // Contract Types
    Route::post('contract-types', \App\Modules\Work\Controllers\ContractTypeController::class . '@store')->name('contract-types.store');

    // Tasks
    Route::get('tasks', [TaskController::class, 'index'])->name('tasks.index');

    // Timesheets
    Route::get('timesheets', [TimesheetController::class, 'index'])->name('timesheets.index');
});
