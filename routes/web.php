<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Public invitation link: redirect to signup (register) page with token
Route::get('/invitation/{token}', function (string $token) {
    $invitation = \App\Models\HR\EmployeeInvitation::where('token', $token)->first();
    if (!$invitation || !$invitation->isValid()) {
        return redirect()->route('login')->with('error', 'This invitation link is invalid or has expired.');
    }
    return redirect()->route('register', ['invitation' => $token]);
})->name('invitation.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function() {
        if (auth()->user()->role !== 'Admin') {
            return redirect()->route('hr.attendance.index');
        }
        return (new DashboardController())->index();
    })->name('dashboard');
    
    // Admin & Marketing Module
    Route::middleware(['role:Admin,Media Manager'])->prefix('marketing')->name('marketing.')->group(function() {
        Route::get('/dashboard', [\App\Http\Controllers\Marketing\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('campaigns', \App\Http\Controllers\Marketing\CampaignController::class);
        Route::get('/campaigns/builder', [\App\Http\Controllers\Marketing\CampaignController::class, 'builder'])->name('campaigns.builder');
        Route::resource('sources', \App\Http\Controllers\Marketing\LeadSourceController::class);
        Route::resource('influencers', \App\Http\Controllers\Marketing\InfluencerController::class);
        Route::resource('creatives', \App\Http\Controllers\Marketing\CreativeController::class);
        Route::get('/finance', [\App\Http\Controllers\Marketing\ExpenseController::class, 'index'])->name('finance.index');
        Route::resource('expenses', \App\Http\Controllers\Marketing\ExpenseController::class)->except(['index']);
        Route::get('/attribution', [\App\Http\Controllers\Marketing\AttributionController::class, 'index'])->name('attribution.dashboard');
        Route::get('/automation', [\App\Http\Controllers\Marketing\AutomationController::class, 'index'])->name('automation.index');
        Route::get('/settings', [\App\Http\Controllers\Marketing\SettingsController::class, 'index'])->name('settings.index');
    });

    // CRM Leads, Deals & Clients (module-based; module middleware enforces service-type access)
    Route::middleware(['role:Admin,Counselor,Media Manager'])->group(function () {
        Route::middleware(['module:leads'])->group(fn () => require base_path('app/Modules/Leads/Routes/web.php'));
        Route::middleware(['module:deals'])->group(fn () => require base_path('app/Modules/Deals/Routes/web.php'));
        Route::middleware(['module:clients'])->group(fn () => require base_path('app/Modules/Clients/Routes/web.php'));
    });

    // Medical & Scheduling
    Route::middleware(['role:Admin,Doctor,Counselor'])->group(function() {
        Route::resource('appointments', \App\Http\Controllers\AppointmentController::class);
    });
    
    // Core System Settings
    Route::middleware(['role:Admin'])->prefix('settings')->name('settings.')->group(function() {
        Route::get('/', [\App\Http\Controllers\SystemSettingsController::class, 'index'])->name('index');
        Route::get('/roles', [\App\Http\Controllers\RolePermissionController::class, 'index'])->name('roles.index');
        Route::patch('/roles/{role}', [\App\Http\Controllers\RolePermissionController::class, 'update'])->name('roles.update');
    });
    
    // Core HR Management - Highly Sensitive (Admin Only)
    Route::prefix('hr')->name('hr.')->middleware(['role:Admin'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\HR\DashboardController::class, 'index'])->name('dashboard');
        
        Route::get('/clinic-profile', [\App\Http\Controllers\ClinicProfileController::class, 'show'])->name('clinic.profile');
        Route::patch('/clinic-profile', [\App\Http\Controllers\ClinicProfileController::class, 'update'])->name('clinic.update');
        
        Route::post('/employees/invite', [\App\Http\Controllers\HR\EmployeeController::class, 'invite'])->name('employees.invite');
        Route::post('/employees/invite-link', [\App\Http\Controllers\HR\EmployeeController::class, 'createInviteLink'])->name('employees.invite-link');
        Route::resource('employees', \App\Http\Controllers\HR\EmployeeController::class);
        Route::resource('departments', \App\Http\Controllers\HR\DepartmentController::class);
        Route::resource('designations', \App\Http\Controllers\HR\DesignationController::class);
        Route::resource('shifts', \App\Http\Controllers\HR\ShiftController::class);
        Route::post('/departments/quick-add', [\App\Http\Controllers\HR\DepartmentController::class, 'quickStore'])->name('departments.quick-store');
        Route::post('/designations/quick-add', [\App\Http\Controllers\HR\DepartmentController::class, 'quickStoreDesignation'])->name('designations.quick-store');
        
        Route::resource('leave', \App\Http\Controllers\HR\LeaveController::class);
        Route::patch('/leave/{leave}/approve', [\App\Http\Controllers\HR\LeaveController::class, 'approve'])->name('leave.approve');
        Route::patch('/leave/{leave}/reject', [\App\Http\Controllers\HR\LeaveController::class, 'reject'])->name('leave.reject');
        
        Route::resource('holidays', \App\Http\Controllers\HR\HolidayController::class);
        Route::resource('appreciations', \App\Http\Controllers\HR\AppreciationController::class);
        
        // Roster
        Route::get('/roster', [\App\Http\Controllers\HR\RosterController::class, 'index'])->name('roster.index');
        Route::post('/roster', [\App\Http\Controllers\HR\RosterController::class, 'store'])->name('roster.store');
        
        Route::get('/payroll', [\App\Http\Controllers\HR\PayrollController::class, 'index'])->name('payroll.index');
        Route::get('/performance', [\App\Http\Controllers\HR\PerformanceController::class, 'index'])->name('performance.index');
        Route::post('/performance', [\App\Http\Controllers\HR\PerformanceController::class, 'store'])->name('performance.store');
        Route::patch('/performance/{review}', [\App\Http\Controllers\HR\PerformanceController::class, 'update'])->name('performance.update');
        Route::delete('/performance/{review}', [\App\Http\Controllers\HR\PerformanceController::class, 'destroy'])->name('performance.destroy');
    });

    // Self Service (Attendance) - Open to All Auth Employees
    Route::get('hr/attendance', [\App\Http\Controllers\HR\AttendanceController::class, 'index'])->name('hr.attendance.index');
    Route::post('hr/attendance/mark', [\App\Http\Controllers\HR\AttendanceController::class, 'mark'])->name('hr.attendance.mark');
    Route::post('hr/attendance/check-in', [\App\Http\Controllers\HR\AttendanceController::class, 'checkIn'])->name('hr.attendance.check-in');
    Route::post('hr/attendance/check-out', [\App\Http\Controllers\HR\AttendanceController::class, 'checkOut'])->name('hr.attendance.check-out');

    Route::get('/reports', [\App\Http\Controllers\ReportsController::class, 'index'])->name('reports.index')->middleware(['role:Admin,Media Manager']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
