<?php

namespace App\Providers;

use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Policies\ClientPolicy;
use App\Modules\Deals\Models\Deal;
use App\Modules\Deals\Policies\DealPolicy;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Policies\LeadPolicy;
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
        Vite::prefetch(concurrency: 3);
    }
}
