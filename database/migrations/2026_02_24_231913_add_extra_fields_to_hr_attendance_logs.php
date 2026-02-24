<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hr_attendance_logs', function (Blueprint $table) {
            $table->string('clock_in_ip')->nullable()->after('check_in');
            $table->string('clock_out_ip')->nullable()->after('check_out');
            $table->boolean('is_late')->default(false)->after('clock_out_ip');
            $table->boolean('is_half_day')->default(false)->after('is_late');
            $table->string('location')->nullable()->after('is_half_day');
            $table->string('working_from')->nullable()->after('location'); // Office, Remote, etc.
        });
    }

    public function down(): void
    {
        Schema::table('hr_attendance_logs', function (Blueprint $table) {
            $table->dropColumn(['clock_in_ip', 'clock_out_ip', 'is_late', 'is_half_day', 'location', 'working_from']);
        });
    }
};
