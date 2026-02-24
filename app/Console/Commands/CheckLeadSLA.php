<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckLeadSLA extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leads:check-sla';
    protected $description = 'Check leads for SLA compliance and trigger alerts';

    public function handle()
    {
        $overdueLeads = \App\Models\Lead::where('status', 'New')
            ->where('created_at', '<=', now()->subHour())
            ->whereDoesntHave('alerts', function($q) {
                $q->where('type', 'SLA Breach');
            })
            ->get();

        foreach ($overdueLeads as $lead) {
            \App\Models\Alert::create([
                'clinic_id' => $lead->clinic_id,
                'lead_id' => $lead->id,
                'type' => 'SLA Breach',
                'status' => 'Pending',
                'message' => "Lead {$lead->name} has been in 'New' status for over 1 hour.",
            ]);

            $this->info("Alert triggered for Lead ID: {$lead->id}");
        }
    }
}
