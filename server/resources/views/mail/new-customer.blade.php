@if($lang == 'en')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Shatleh</title>
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
            <h2>Welcome to Shatleh!</h2>
        </div>
        <div class="content">
            <p>Thank you for joining Shatleh, your trusted partner in agriculture!</p>
            <p>We’re excited to have you on board. Below is your initial password to log in to your account:</p>
            <div class="password">{{ $password }}</div>
            <p>For security, we recommend changing this password after your first login.</p>
            <p>If you have any questions or need assistance, our support team is here to help.</p>
            <a href="{{ url('/login') }}" class="button">Log In Now</a>
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
    <title>مرحبًا بك في شتلة</title>
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
            <h2>مرحبًا بك في شتلة!</h2>
        </div>
        <div class="content">
            <p>شكرًا لانضمامك إلى شتلة، شريكك الموثوق في الزراعة!</p>
            <p>نحن متحمسون لوجودك معنا. فيما يلي كلمة المرور الأولية لتسجيل الدخول إلى حسابك:</p>
            <div class="password">{{ $password }}</div>
            <p>لأغراض الأمان، نوصي بتغيير كلمة المرور هذه بعد تسجيل الدخول الأول.</p>
            <p>إذا كانت لديك أي أسئلة أو تحتاج إلى مساعدة، فإن فريق الدعم لدينا هنا لمساعدتك.</p>
            <a href="{{ url('/login') }}" class="button">تسجيل الدخول الآن</a>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} شتلة. جميع الحقوق محفوظة.</p>
            <p>تمكين الزراعة، بذرة واحدة في كل مرة.</p>
        </div>
    </div>
</body>
</html>
@endif