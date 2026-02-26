<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Contracts Table
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('subject');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('Draft'); // Draft, Signed, Canceled
            $table->timestamps();
        });

        // Projects Table
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->string('project_name');
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            $table->string('status')->default('Not Started'); // Not Started, In Progress, On Hold, Canceled, Finished
            $table->decimal('budget', 15, 2)->default(0);
            $table->timestamps();
        });

        // Milestones
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('milestone_title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->string('status')->default('Incomplete');
            $table->timestamps();
        });

        // Tasks Table
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('milestone_id')->nullable()->constrained('project_milestones')->nullOnDelete();
            $table->string('heading');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->string('priority')->default('Medium'); // Low, Medium, High, Urgent
            $table->string('status')->default('Incomplete'); // Incomplete, Completed, Doing, To Do
            $table->timestamps();
        });

        // Task User (Many-to-Many Assignment)
        Schema::create('task_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // Timesheets Table
        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('task_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->decimal('total_hours', 15, 2)->default(0);
            $table->text('memo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timesheets');
        Schema::dropIfExists('task_users');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('project_milestones');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('contracts');
    }
};
