<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hr_awards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('icon')->nullable();
            $table->string('color')->default('#4358E4');
            $table->text('summary')->nullable();
            $table->timestamps();
        });

        Schema::table('hr_appreciations', function (Blueprint $table) {
            $table->foreignId('award_id')->nullable()->after('employee_id')->constrained('hr_awards')->onDelete('set null');
            $table->string('photo')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hr_appreciations', function (Blueprint $table) {
            $table->dropForeign(['award_id']);
            $table->dropColumn(['award_id', 'photo']);
        });
        Schema::dropIfExists('hr_awards');
    }
};
