<?php

namespace App\Providers;

use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Policies\ClientPolicy;
use App\Modules\Deals\Models\Deal;
use App\Modules\Deals\Policies\DealPolicy;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Policies\LeadPolicy;
use App\Modules\Work\Models\Contract;
use App\Modules\Work\Policies\ContractPolicy;
use App\Modules\Work\Models\Project;
use App\Modules\Work\Policies\ProjectPolicy;
use App\Modules\Work\Models\Task;
use App\Modules\Work\Policies\TaskPolicy;
use App\Modules\Work\Models\Timesheet;
use App\Modules\Work\Policies\TimesheetPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Client::class, ClientPolicy::class);
        Gate::policy(Deal::class, DealPolicy::class);
        Gate::policy(Lead::class, LeadPolicy::class);
        Gate::policy(Contract::class, ContractPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(Timesheet::class, TimesheetPolicy::class);
        Vite::prefetch(concurrency: 3);
    }
}
