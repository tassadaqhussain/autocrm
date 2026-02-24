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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('source'); // WhatsApp, Meta Ads, Referral, Direct
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns');
            $table->foreignId('counselor_id')->nullable()->constrained('users');
            $table->string('status')->default('New'); // New, Contacted, Appointment Scheduled, Consultation Done
            $table->decimal('bmi', 5, 2)->nullable();
            $table->text('health_info')->nullable();
            $table->string('urgency')->default('Medium');
            $table->integer('score')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
