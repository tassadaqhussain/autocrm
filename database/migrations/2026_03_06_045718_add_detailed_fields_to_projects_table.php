<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Project Categories
        Schema::create('project_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('short_code')->nullable()->after('client_id');
            $table->foreignId('category_id')->nullable()->after('short_code')->constrained('project_categories')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->after('category_id')->constrained('hr_departments')->nullOnDelete();

            $table->text('summary')->nullable()->after('description');
            $table->text('notes')->nullable()->after('summary');

            $table->boolean('no_deadline')->default(false)->after('deadline');

            $table->boolean('public_gantt_chart')->default(false);
            $table->boolean('public_task_board')->default(false);
            $table->boolean('task_approval')->default(false);
            $table->boolean('is_public')->default(false);

            $table->string('currency')->default('SAR');
            $table->decimal('hours_estimate', 10, 2)->nullable();

            $table->boolean('allow_manual_time_logs')->default(false);
            $table->boolean('enable_miroboard')->default(false);
            $table->boolean('send_task_notification')->default(false);
        });

        // Project Members (Many-to-Many)
        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_members');

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn([
                'short_code',
                'category_id',
                'department_id',
                'summary',
                'notes',
                'no_deadline',
                'public_gantt_chart',
                'public_task_board',
                'task_approval',
                'is_public',
                'currency',
                'hours_estimate',
                'allow_manual_time_logs',
                'enable_miroboard',
                'send_task_notification'
            ]);
        });

        Schema::dropIfExists('project_categories');
    }
};
