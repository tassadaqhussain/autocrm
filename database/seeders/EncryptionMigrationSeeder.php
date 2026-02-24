<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class EncryptionMigrationSeeder extends Seeder
{
    public function run()
    {
        // Encrypt Users
        DB::table('users')->get()->each(function ($user) {
            $update = [];
            if ($user->phone && !str_contains($user->phone, 'eyJpdiI6')) {
                $update['phone'] = Crypt::encryptString($user->phone);
            }
            if ($user->salary && !str_contains($user->salary, 'eyJpdiI6')) {
                $update['salary'] = Crypt::encryptString($user->salary);
            }
            if (!empty($update)) {
                DB::table('users')->where('id', $user->id)->update($update);
            }
        });

        // Encrypt Leads
        DB::table('leads')->get()->each(function ($lead) {
            $update = [];
            if ($lead->phone && !str_contains($lead->phone, 'eyJpdiI6')) {
                $update['phone'] = Crypt::encryptString($lead->phone);
            }
            if ($lead->health_info && !str_contains($lead->health_info, 'eyJpdiI6')) {
                $update['health_info'] = Crypt::encryptString($lead->health_info);
            }
            if (!empty($update)) {
                DB::table('leads')->where('id', $lead->id)->update($update);
            }
        });
    }
}
