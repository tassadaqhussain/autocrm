<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Campaign;
use App\Modules\Leads\Models\Lead;
use App\Models\Alert;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ServiceTypeSeeder::class);
        $this->call(ServiceTypeModuleSeeder::class);

        $crmServiceType = \App\Models\ServiceType::where('code', 'crm')->first();

        // Default Clinic
        $clinic = \App\Models\Clinic::create([
            'name' => 'Elite Medical Clinic',
            'slug' => 'elite-medical',
            'settings' => ['timezone' => 'UTC'],
            'service_type_id' => $crmServiceType?->id,
        ]);

        // 1. Permissions Setup
        // System
        $pSystem = \App\Models\Permission::create(['name' => 'Full Access', 'slug' => '*', 'module' => 'System']);
        
        // CRM
        $pViewCRM = \App\Models\Permission::create(['name' => 'View CRM', 'slug' => 'view_crm', 'module' => 'CRM']);
        $pViewPatients = \App\Models\Permission::create(['name' => 'View Patients', 'slug' => 'view_patients', 'module' => 'CRM']);
        $pViewLeads = \App\Models\Permission::create(['name' => 'View Leads', 'slug' => 'view_leads', 'module' => 'CRM']);
        $pManageLeads = \App\Models\Permission::create(['name' => 'Manage Leads', 'slug' => 'manage_leads', 'module' => 'CRM']);
        $pViewAppts = \App\Models\Permission::create(['name' => 'View Appointments', 'slug' => 'view_appointments', 'module' => 'CRM']);
        
        // Marketing
        $pViewMkt = \App\Models\Permission::create(['name' => 'View Marketing', 'slug' => 'view_marketing', 'module' => 'Marketing']);
        $pManageMktCamp = \App\Models\Permission::create(['name' => 'Manage Campaigns', 'slug' => 'manage_campaigns', 'module' => 'Marketing']);
        $pManageMktSources = \App\Models\Permission::create(['name' => 'Manage Sources', 'slug' => 'manage_sources', 'module' => 'Marketing']);
        $pManageMktInf = \App\Models\Permission::create(['name' => 'Manage Influencers', 'slug' => 'manage_influencers', 'module' => 'Marketing']);
        $pViewMktAttr = \App\Models\Permission::create(['name' => 'View Attribution', 'slug' => 'view_attribution', 'module' => 'Marketing']);
        $pManageMktCreatives = \App\Models\Permission::create(['name' => 'Manage Creatives', 'slug' => 'manage_creatives', 'module' => 'Marketing']);
        $pManageMktFinance = \App\Models\Permission::create(['name' => 'Manage Marketing Finance', 'slug' => 'manage_marketing_finance', 'module' => 'Marketing']);
        $pManageMktAuto = \App\Models\Permission::create(['name' => 'Manage Automation', 'slug' => 'manage_automation', 'module' => 'Marketing']);
        
        // HR & Others
        $pManageHR = \App\Models\Permission::create(['name' => 'Manage HR', 'slug' => 'manage_hr', 'module' => 'HR']);
        $pManageFinance = \App\Models\Permission::create(['name' => 'Manage Finance', 'slug' => 'manage_finance', 'module' => 'Finance']);
        $pManageClinic = \App\Models\Permission::create(['name' => 'Manage Clinic', 'slug' => 'manage_clinic', 'module' => 'Clinic']);
        $pAttendance = \App\Models\Permission::create(['name' => 'Mark Attendance', 'slug' => 'mark_attendance', 'module' => 'HR']);

        // Roles
        $adminRole = \App\Models\Role::create(['name' => 'Administrator', 'slug' => 'admin', 'clinic_id' => $clinic->id]);
        $counselorRole = \App\Models\Role::create(['name' => 'Counselor', 'slug' => 'counselor', 'clinic_id' => $clinic->id]);
        $doctorRole = \App\Models\Role::create(['name' => 'Doctor', 'slug' => 'doctor', 'clinic_id' => $clinic->id]);
        $mediaManagerRole = \App\Models\Role::create(['name' => 'Media Manager', 'slug' => 'media-manager', 'clinic_id' => $clinic->id]);

        $adminRole->permissions()->attach([$pSystem->id]);
        
        $counselorRole->permissions()->attach([
            $pViewCRM->id, $pViewLeads->id, $pManageLeads->id, $pAttendance->id
        ]);
        
        $doctorRole->permissions()->attach([
            $pViewCRM->id, $pViewPatients->id, $pViewAppts->id, $pAttendance->id
        ]);

        $mediaManagerRole->permissions()->attach([
            $pViewMkt->id, $pManageMktCamp->id, $pManageMktSources->id, $pManageMktInf->id, 
            $pViewMktAttr->id, $pManageMktCreatives->id, $pManageMktFinance->id, $pManageMktAuto->id,
            $pAttendance->id
        ]);

        // Admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@crm.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'role_id' => $adminRole->id,
            'clinic_id' => $clinic->id,
        ]);

        // Media Manager
        User::factory()->create([
            'name' => 'Media Manager',
            'email' => 'media@crm.com',
            'password' => Hash::make('password'),
            'role' => 'Media Manager',
            'role_id' => $mediaManagerRole->id,
            'clinic_id' => $clinic->id,
        ]);

        // Counselors
        $c1 = User::factory()->create([
            'name' => 'Sara Counselor',
            'email' => 'sara@crm.com',
            'role' => 'Counselor',
            'role_id' => $counselorRole->id,
            'clinic_id' => $clinic->id,
        ]);

        $c2 = User::factory()->create([
            'name' => 'Ahmed Counselor',
            'email' => 'ahmed@crm.com',
            'role' => 'Counselor',
            'role_id' => $counselorRole->id,
            'clinic_id' => $clinic->id,
        ]);

        // Campaigns (Rich Seed)
        $this->call(CampaignSeeder::class);
        $camp1 = Campaign::where('type', 'meta')->first();
        $camp2 = Campaign::where('type', 'google')->first();

        // Leads
        $l1 = Lead::create([
            'name' => 'John Doe',
            'phone' => '+923001234567',
            'source' => 'WhatsApp (Meta Ads)',
            'campaign_id' => $camp1->id,
            'counselor_id' => $c1->id,
            'clinic_id' => $clinic->id,
            'status' => 'New',
            'bmi' => 32.5,
            'urgency' => 'High',
            'score' => 75,
        ]);

        $l2 = Lead::create([
            'name' => 'Jane Smith',
            'phone' => '+923009876543',
            'source' => 'Campaign Numbers',
            'campaign_id' => $camp2->id,
            'counselor_id' => $c2->id,
            'clinic_id' => $clinic->id,
            'status' => 'Appointment Scheduled',
            'bmi' => 28.0,
            'urgency' => 'Medium',
            'score' => 45,
        ]);

        // Appointments
        \App\Models\Appointment::create([
            'clinic_id' => $clinic->id,
            'lead_id' => $l2->id,
            'doctor_id' => $c1->id, // Simplified for seed
            'scheduled_at' => now()->addDays(2),
            'type' => 'Initial Consultation',
            'status' => 'Confirmed',
        ]);

        // Alerts
        Alert::create([
            'lead_id' => $l1->id,
            'clinic_id' => $clinic->id,
            'type' => 'Lead Response Overdue',
            'status' => 'Pending',
        ]);

        Alert::create([
            'lead_id' => $l2->id,
            'clinic_id' => $clinic->id,
            'type' => 'Follow-Up Overdue',
            'status' => 'Pending',
        ]);

        $this->call(HRModuleSeeder::class);
    }
}
