<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Give Admin User full permissions override
        $admin = User::where('role', 'Admin')->first();
        if ($admin) {
            $admin->update([
                'permissions' => ['*']
            ]);
        }

        // We can also granularly assign permissions to others if needed
        // For example:
        $doctors = User::where('role', 'Doctor')->get();
        foreach ($doctors as $doctor) {
            $doctor->update([
                'permissions' => ['view_patients', 'manage_consultations', 'view_schedule', 'mark_attendance']
            ]);
        }
    }
}
