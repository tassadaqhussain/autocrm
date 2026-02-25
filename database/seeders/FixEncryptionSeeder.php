<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Modules\Leads\Models\Lead;
use Illuminate\Support\Facades\Crypt;

class FixEncryptionSeeder extends Seeder
{
    public function run()
    {
        // Fix Users
        User::all()->each(function ($user) {
            try {
                // If this succeeds, it was already encrypted correctly
                Crypt::decryptString($user->getRawOriginal('phone'));
                Crypt::decryptString($user->getRawOriginal('salary'));
            } catch (\Exception $e) {
                // If it fails, it's plain text, so we save it again (which will encrypt it via the cast)
                $user->phone = $user->getRawOriginal('phone');
                $user->salary = $user->getRawOriginal('salary');
                $user->save();
            }
        });

        // Fix Leads
        Lead::all()->each(function ($lead) {
            try {
                Crypt::decryptString($lead->getRawOriginal('phone'));
                Crypt::decryptString($lead->getRawOriginal('health_info'));
            } catch (\Exception $e) {
                $lead->phone = $lead->getRawOriginal('phone');
                $lead->health_info = $lead->getRawOriginal('health_info');
                $lead->save();
            }
        });
    }
}
