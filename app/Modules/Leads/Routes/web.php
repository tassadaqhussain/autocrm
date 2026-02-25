<?php

use App\Modules\Leads\Controllers\LeadController;
use Illuminate\Support\Facades\Route;

Route::resource('leads', LeadController::class);
Route::patch('leads/{lead}/status', [LeadController::class, 'updateStatus'])->name('leads.status');
