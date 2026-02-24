<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendHolidayReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hr:send-holiday-reminders';
    protected $description = 'Send an automated email reminder to all clinic employees regarding an upcoming holiday tomorrow.';

    public function handle()
    {
        $tomorrow = \Carbon\Carbon::tomorrow()->format('Y-m-d');
        
        // Find all holidays happening tomorrow
        $holidays = \App\Models\HR\Holiday::where('date', $tomorrow)->get();

        if ($holidays->isEmpty()) {
            $this->info("No holidays found for tomorrow ($tomorrow).");
            return;
        }

        $emailsSent = 0;

        foreach ($holidays as $holiday) {
            // Get employees for this specific clinic
            $employees = \App\Models\HR\Employee::with('user:id,name,email')
                ->where('clinic_id', $holiday->clinic_id)
                ->where('status', 'Active')
                ->get();

            foreach ($employees as $employee) {
                if ($employee->user && $employee->user->email) {
                    \Illuminate\Support\Facades\Mail::to($employee->user->email)->send(
                        new \App\Mail\HolidayReminderMail($holiday, $employee->user->name)
                    );
                    $emailsSent++;
                }
            }
        }

        $this->info("Sent $emailsSent holiday reminders for $tomorrow.");
    }
}
