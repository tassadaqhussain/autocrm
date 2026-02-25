<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use App\Models\ServiceTypeModule;
use Illuminate\Database\Seeder;

class ServiceTypeModuleSeeder extends Seeder
{
    public function run(): void
    {
        $clinic = ServiceType::where('code', 'clinic')->first();
        $ecommerce = ServiceType::where('code', 'ecommerce')->first();
        $crm = ServiceType::where('code', 'crm')->first();
        $erp = ServiceType::where('code', 'erp')->first();

        $moduleMap = [
            'clinic' => ['patients', 'appointments', 'doctors', 'prescriptions', 'billing', 'inventory'],
            'ecommerce' => ['products', 'orders', 'customers', 'payments', 'shipping'],
            'crm' => ['leads', 'deals', 'clients', 'contacts', 'pipelines', 'tasks'],
            'erp' => ['accounting', 'hr', 'inventory', 'procurement', 'sales'],
        ];

        if ($clinic) {
            foreach ($moduleMap['clinic'] as $name) {
                ServiceTypeModule::firstOrCreate(
                    ['service_type_id' => $clinic->id, 'module_name' => $name],
                    ['is_enabled' => true]
                );
            }
        }

        if ($ecommerce) {
            foreach ($moduleMap['ecommerce'] as $name) {
                ServiceTypeModule::firstOrCreate(
                    ['service_type_id' => $ecommerce->id, 'module_name' => $name],
                    ['is_enabled' => true]
                );
            }
        }

        if ($crm) {
            foreach ($moduleMap['crm'] as $name) {
                ServiceTypeModule::firstOrCreate(
                    ['service_type_id' => $crm->id, 'module_name' => $name],
                    ['is_enabled' => true]
                );
            }
        }

        if ($erp) {
            foreach ($moduleMap['erp'] as $name) {
                ServiceTypeModule::firstOrCreate(
                    ['service_type_id' => $erp->id, 'module_name' => $name],
                    ['is_enabled' => true]
                );
            }
        }
    }
}
