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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained('clinics');
            $table->foreignId('lead_id')->constrained('leads');
            $table->foreignId('doctor_id')->nullable()->constrained('users');
            $table->dateTime('scheduled_at');
            $table->integer('duration')->default(30); // in minutes
            $table->string('type')->default('Initial Consultation');
            $table->string('status')->default('Confirmed'); // Confirmed, Cancelled, No-Show, Completed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
