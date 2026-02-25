<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Clinic Management',
                'code' => 'clinic',
                'description' => 'Medical clinic: patients, appointments, doctors, prescriptions, billing, inventory.',
            ],
            [
                'name' => 'E-commerce / Product CRM',
                'code' => 'ecommerce',
                'description' => 'Products, orders, customers, payments, shipping.',
            ],
            [
                'name' => 'Sales CRM',
                'code' => 'crm',
                'description' => 'Leads, deals, contacts, pipelines, tasks.',
            ],
            [
                'name' => 'ERP',
                'code' => 'erp',
                'description' => 'Accounting, HR, inventory, procurement, sales.',
            ],
        ];

        foreach ($types as $type) {
            ServiceType::firstOrCreate(
                ['code' => $type['code']],
                [
                    'name' => $type['name'],
                    'description' => $type['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
