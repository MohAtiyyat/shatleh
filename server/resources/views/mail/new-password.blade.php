@if($lang == 'en')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Password - Shatleh</title>
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
        .password {
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
            <h2>New Password</h2>
        </div>
        <div class="content">
            <p>Thank you for using Shatleh, your trusted partner in agriculture!</p>
            <p>Your password has been reset. Please use the following new password to log in:</p>
            <div class="password">{{ $newPassword }}</div>
            {{-- <p>For security, we recommend changing this password after logging in.</p> --}}
            <p>If you did not request a password reset, please contact our support team immediately.</p>
            {{-- <a href="{{ url('/login') }}" class="button">Log In Now</a> --}}
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
    <title>كلمة المرور الجديدة - شتلة</title>
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
        .password {
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
            <h2>كلمة المرور الجديدة</h2>
        </div>
        <div class="content">
            <p>شكرًا لاستخدامك شتلة، شريكك الموثوق في الزراعة!</p>
            <p>تم إعادة تعيين كلمة المرور الخاصة بك. يرجى استخدام كلمة المرور الجديدة التالية لتسجيل الدخول:</p>
            <div class="password">{{ $newPassword }}</div>
            {{-- <p>لأغراض الأمان، نوصي بتغيير كلمة المرور هذه بعد تسجيل الدخول.</p> --}}
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى التواصل مع فريق الدعم الخاص بنا على الفور.</p>
            {{-- <a href="{{ url('/login') }}" class="button">تسجيل الدخول الآن</a> --}}
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} شتلة. جميع الحقوق محفوظة.</p>
            <p>تمكين الزراعة، بذرة واحدة في كل مرة.</p>
        </div>
    </div>
</body>
</html>
@endif