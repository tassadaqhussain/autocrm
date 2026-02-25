<?php

use App\Modules\Clients\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::resource('clients', ClientController::class);
