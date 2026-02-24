<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
        .header { background-color: #2563eb; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #0f172a; }
        .message { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .holiday-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
        .holiday-name { font-size: 20px; font-weight: 700; color: #1e3a8a; margin: 0 0 10px 0; }
        .holiday-date { font-size: 16px; color: #3b82f6; margin: 0; font-weight: 500; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Upcoming Holiday Reminder</h1>
        </div>
        <div class="content">
            <p class="greeting">Hello {{ $employeeName }},</p>
            <p class="message">This is a friendly automated reminder that our clinic will be observing an official holiday tomorrow.</p>
            
            <div class="holiday-box">
                <p class="holiday-name">{{ $holiday->name }}</p>
                <p class="holiday-date">{{ \Carbon\Carbon::parse($holiday->date)->format('l, F j, Y') }}</p>
            </div>
            
            <p class="message">Please ensure all necessary tasks are wrapped up before you log off today. Enjoy your time off!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Elite Medical Clinic. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
