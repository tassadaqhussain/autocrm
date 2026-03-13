<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tables = [
            'users',
            'clients',
            'projects',
            'project_categories',
            'contracts',
            'contract_types',
            'contract_templates',
            'tasks',
            'timesheets',
            'deals',
            'deal_categories',
            'products',
            'hr_departments',
            'hr_designations',
            'hr_employees',
            'appointments',
            'payments',
            'roles',
            'marketing_campaigns',
            'marketing_leads',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'clinic_id')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->unsignedBigInteger('clinic_id')->nullable()->change();
                });
            }
        }
    }

    public function down(): void
    {
        // Reverting might be tricky if data was inserted with nulls, 
        // but for migration purpose:
        $tables = [
            'users',
            'clients',
            'projects',
            'project_categories',
            'contracts',
            'contract_types',
            'contract_templates',
            'tasks',
            'timesheets',
            'deals',
            'deal_categories',
            'products',
            'hr_departments',
            'hr_designations',
            'hr_employees',
            'appointments',
            'payments',
            'roles',
            'marketing_campaigns',
            'marketing_leads',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'clinic_id')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->unsignedBigInteger('clinic_id')->nullable(false)->change();
                });
            }
        }
    }
};
