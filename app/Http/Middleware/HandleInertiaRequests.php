<?php

namespace App\Http\Middleware;

use App\Models\ServiceTypeModule;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = [];
        $enabledModules = null;

        if ($user) {
            // Collect role permissions
            if ($user->role_id) {
                $permissions = array_merge($permissions, $user->role_relation->permissions->pluck('slug')->toArray());
            }
            // Collect individual overrides
            if ($user->permissions) {
                $permissions = array_merge($permissions, $user->permissions);
            }
            // Legacy Admin check
            if ($user->role === 'Admin') {
                $permissions[] = '*';
            }

            // Enabled modules for tenant's service type (null = no service type = show all)
            $user->load('clinic');
            $clinic = $user->clinic;
            if ($clinic && $clinic->service_type_id) {
                $enabledModules = ServiceTypeModule::where('service_type_id', $clinic->service_type_id)
                    ->where('is_enabled', true)
                    ->pluck('module_name')
                    ->values()
                    ->toArray();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->load('clinic')->toArray(), [
                    'all_permissions' => array_unique($permissions),
                    'enabled_modules' => $enabledModules,
                ]) : null,
            ],
        ];
    }
}
