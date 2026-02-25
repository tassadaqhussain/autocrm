<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_type_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('service_type_id')->constrained('service_types')->cascadeOnDelete();
            $table->string('module_name');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->unique(['service_type_id', 'module_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_type_modules');
    }
};
