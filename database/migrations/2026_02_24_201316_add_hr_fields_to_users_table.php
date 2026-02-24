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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('joined_at')->nullable();
            $table->string('status')->default('Active'); // Active, On Leave, Resigned
            $table->text('bio')->nullable();
            $table->string('specialization')->nullable(); // For Doctors
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'salary', 'joined_at', 'status', 'bio', 'specialization']);
        });
    }
};
