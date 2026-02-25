<?php

use App\Modules\Deals\Controllers\DealController;
use Illuminate\Support\Facades\Route;

Route::post('deals', [DealController::class, 'store'])->name('deals.store');
Route::get('deals/{deal}', [DealController::class, 'show'])->name('deals.show');
Route::patch('deals/{deal}/stage', [DealController::class, 'updateStage'])->name('deals.stage');
Route::post('deals/{deal}/follow-ups', [DealController::class, 'addFollowUp'])->name('deals.follow-ups.store');
Route::post('deals/{deal}/notes', [DealController::class, 'addNote'])->name('deals.notes.store');
Route::post('deals/{deal}/proposals', [DealController::class, 'addProposal'])->name('deals.proposals.store');
Route::post('deals/{deal}/proposals/{proposal}/files', [DealController::class, 'uploadProposalFile'])->name('deals.proposals.files.upload');
Route::delete('deals/{deal}/proposals/{proposal}/files/{file}', [DealController::class, 'destroyProposalFile'])->name('deals.proposals.files.destroy');
Route::post('deals/{deal}/files', [DealController::class, 'uploadFile'])->name('deals.files.upload');
Route::delete('deals/{deal}/files/{file}', [DealController::class, 'destroyFile'])->name('deals.files.destroy');
Route::post('deals/categories', [DealController::class, 'quickStoreCategory'])->name('deals.categories.quick');
Route::post('deals/agents', [DealController::class, 'quickStoreAgent'])->name('deals.agents.quick');
