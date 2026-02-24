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
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('objective')->nullable();
            $table->string('status')->default('Draft');
            $table->text('description')->nullable();
            $table->text('ad_copy')->nullable();
            $table->string('ad_creative_url')->nullable();
            $table->json('target_audience')->nullable();
            $table->decimal('budget', 12, 2)->default(0);
            $table->string('budget_type')->default('Daily'); // Daily, Lifetime
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['objective', 'status', 'description', 'ad_copy', 'ad_creative_url', 'target_audience', 'budget', 'budget_type', 'starts_at', 'ends_at']);
        });
    }
};
