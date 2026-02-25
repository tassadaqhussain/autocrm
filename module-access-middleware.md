# Module Access Middleware

Create middleware:

EnsureModuleEnabled

Logic:
1. Get authenticated user
2. Get company
3. Get service_type_id
4. Check if module is enabled
5. If not → abort(403)

Apply middleware per module route group.

Example:

Route::middleware(['auth', 'module:leads'])
    ->group(function () {
        // Leads routes
    });
