<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleEnabled
{
    /**
     * Ensure the given module is enabled for the authenticated user's company (clinic) service type.
     * Use: Route::middleware(['auth', 'module:leads'])
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();
        if (!$user) {
            abort(403, 'Unauthenticated.');
        }

        $clinic = $user->clinic;
        if (!$clinic) {
            abort(403, 'Company (clinic) not found.');
        }

        $serviceTypeId = $clinic->service_type_id ?? null;

        // If no service type assigned, allow access (backward compatibility)
        if ($serviceTypeId === null) {
            return $next($request);
        }

        $enabled = DB::table('service_type_modules')
            ->where('service_type_id', $serviceTypeId)
            ->where('module_name', $module)
            ->where('is_enabled', true)
            ->exists();

        if (!$enabled) {
            abort(403, 'This module is not enabled for your service type.');
        }

        return $next($request);
    }
}
