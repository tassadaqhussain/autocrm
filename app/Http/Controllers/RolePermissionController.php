<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->where('clinic_id', auth()->user()->clinic_id)->get();
        $permissions = Permission::all()->groupBy('module');

        return Inertia::render('Settings/Roles', [
            'roles' => $roles,
            'groupedPermissions' => $permissions
        ]);
    }

    public function update(App\Http\Requests\UpdateRolePermissionsRequest $request, Role $role)
    {
        // Admins should probably not alter the main Admin role this easily, but leaving it unprotected is bad. Security layer:
        if ($role->name === 'Administrator') {
            return back()->with('error', 'Administrator role cannot be modified.');
        }

        $role->permissions()->sync($request->validated('permissions'));
        return back()->with('success', 'Role permissions updated successfully.');
    }
}
