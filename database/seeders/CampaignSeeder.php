<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Clinic;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $clinic = Clinic::first();
        if (!$clinic) return;

        $campaigns = [
            [
                'name' => 'Exclusive Winter Wonderland Discount Event',
                'type' => 'meta',
                'objective' => 'Conversion',
                'status' => 'Active',
                'budget' => 500,
                'budget_type' => 'Daily',
                'ad_copy' => 'Built not just for work, but for dreams in the making. With lightning-fast performance, stunning visuals, and long-lasting results — Elite Medical is always a step ahead.',
                'ad_creative_url' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
                'target_audience' => [
                    'locations' => ['Riyadh', 'Jeddah'],
                    'age_range' => [25, 45],
                    'interests' => ['Luxury', 'Medical', 'Wellness']
                ],
                'starts_at' => now(),
                'clinic_id' => $clinic->id,
            ],
            [
                'name' => 'Riyadh Medical Summer Promo',
                'type' => 'google',
                'objective' => 'Lead Generation',
                'status' => 'Active',
                'budget' => 12000,
                'budget_type' => 'Lifetime',
                'ad_copy' => 'Experience the best medical care in Riyadh. Transform your life today with our expert team.',
                'ad_creative_url' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
                'target_audience' => [
                    'locations' => ['Riyadh'],
                    'age_range' => [30, 60],
                    'interests' => ['Health Care', 'Family', 'Saudi News']
                ],
                'starts_at' => now()->subDays(5),
                'clinic_id' => $clinic->id,
            ],
            [
                'name' => 'WhatsApp Weight Loss Journey',
                'type' => 'whatsapp',
                'objective' => 'Direct Consultation',
                'status' => 'Draft',
                'budget' => 100,
                'budget_type' => 'Daily',
                'ad_copy' => 'Unwind, sip, and repeat at Clinic Hills! Join our medical magic together!',
                'target_audience' => [
                    'locations' => ['Dammam'],
                    'age_range' => [20, 50],
                    'interests' => ['Fitness', 'Diet', 'WhatsApp Ads']
                ],
                'clinic_id' => $clinic->id,
            ]
        ];

        foreach ($campaigns as $camp) {
            Campaign::create($camp);
        }
    }
}
