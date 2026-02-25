<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->foreignUuid('service_type_id')->nullable()->after('id')->constrained('service_types')->nullOnDelete();
            $table->string('subscription_plan_id')->nullable()->after('service_type_id');
            $table->string('status')->default('active')->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->dropForeign(['service_type_id']);
            $table->dropColumn(['service_type_id', 'subscription_plan_id', 'status']);
        });
    }
};
