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
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('contract_number')->after('id')->nullable();
            $table->foreignId('project_id')->nullable()->after('client_id')->constrained('projects')->nullOnDelete();
            $table->foreignId('contract_type_id')->nullable()->after('project_id')->constrained('contract_types')->nullOnDelete();
            $table->string('currency')->default('USD ($)')->after('amount');
            $table->string('cell')->nullable()->after('currency');
            $table->string('office_phone')->nullable()->after('cell');
            $table->string('city')->nullable()->after('office_phone');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('postal_code')->nullable()->after('country');
            $table->text('alternate_address')->nullable()->after('postal_code');
            $table->text('notes')->nullable()->after('alternate_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['contract_type_id']);
            $table->dropColumn([
                'contract_number',
                'project_id',
                'contract_type_id',
                'currency',
                'cell',
                'office_phone',
                'city',
                'state',
                'country',
                'postal_code',
                'alternate_address',
                'notes'
            ]);
        });
    }
};
