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
        Schema::table('hr_leaves', function (Blueprint $table) {
            $table->string('duration_type')->default('Full Day'); // Full Day, Multiple, First Half, Second Half
            $table->string('attachment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hr_leaves', function (Blueprint $table) {
            $table->dropColumn(['duration_type', 'attachment']);
        });
    }
};
