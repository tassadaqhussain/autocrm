<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; color: #334155; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #0f172a; }
        .message { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .award-box { background-color: #ecfdf5; border: 2px dashed #34d399; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .award-title { font-size: 24px; font-weight: 800; color: #059669; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; }
        .award-desc { font-size: 16px; color: #047857; margin: 0; font-style: italic; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Congratulations! 🎉</h1>
        </div>
        <div class="content">
            <p class="greeting">Dear {{ $employeeName }},</p>
            <p class="message">We are thrilled to recognize your outstanding dedication and hard work. You have been awarded the following appreciation:</p>
            
            <div class="award-box">
                <p class="award-title">{{ $appreciation->title }}</p>
                @if($appreciation->description)
                    <p class="award-desc">"{{ $appreciation->description }}"</p>
                @endif
            </div>
            
            <p class="message">Thank you for everything you do to make our clinic a wonderful place for both our patients and our team.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Elite Medical Clinic. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
