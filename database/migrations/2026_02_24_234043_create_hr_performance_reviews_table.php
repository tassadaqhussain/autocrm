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
        Schema::create('hr_performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('hr_employees')->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('period');            // e.g. "Q1 2026", "Annual 2025"
            $table->date('review_date');
            $table->tinyInteger('rating');       // 1-5
            $table->string('category')->default('General'); // General, Technical, Soft Skills, Leadership
            $table->text('strengths')->nullable();
            $table->text('improvements')->nullable();
            $table->text('goals')->nullable();
            $table->string('status')->default('Draft'); // Draft, Submitted, Acknowledged
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hr_performance_reviews');
    }
};
