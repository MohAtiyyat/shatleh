@if($lang == 'en')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Shatleh</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 200px;
            width: 100%;
        }
        .content {
            text-align: center;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32;
            margin: 20px 0;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #2e7d32;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/shatleh-email-header.png') }}" alt="Shatleh Logo">
            <h2>Email Verification</h2>
        </div>
        <div class="content">
            <p>Thank you for joining Shatleh, your trusted partner in agriculture!</p>
            <p>Please use the following One-Time Password (OTP) to verify your email address:</p>
            <div class="otp">{{ $otp }}</div>
            <p>This OTP is valid for the next 5 minutes.</p>
            <p>If you did not request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Shatleh. All rights reserved.</p>
            <p>Empowering agriculture, one seed at a time.</p>
        </div>
    </div>
</body>
</html>
@else
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد البريد الإلكتروني - شتلة</title>
    <style>
        body {
            font-family: 'Tajawal', Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
            direction: rtl;
            text-align: right;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 200px;
            width: 100%;
        }
        .content {
            text-align: center;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32;
            margin: 20px 0;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #2e7d32;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/shatleh-email-header.png') }}" alt="شعار شتلة">
            <h2>تأكيد البريد الإلكتروني</h2>
        </div>
        <div class="content">
            <p>شكرًا لانضمامك إلى شتلة، شريكك الموثوق في الزراعة!</p>
            <p>يرجى استخدام كلمة المرور لمرة واحدة (OTP) التالية لتأكيد بريدك الإلكتروني:</p>
            <div class="otp">{{ $otp }}</div>
            <p>كلمة المرور هذه صالحة لمدة 5 دقائق فقط.</p>
            <p>إذا لم تطلب هذا التأكيد، يرجى تجاهل هذا البريد الإلكتروني.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} شتلة. جميع الحقوق محفوظة.</p>
            <p>تمكين الزراعة، بذرة واحدة في كل مرة.</p>
        </div>
    </div>
</body>
</html>
@endif