@if($lang == 'en')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Shatleh!</title>
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
        .staff-details {
            font-size: 18px;
            font-weight: bold;
            color: #2e7d32;
            margin: 20px 0;
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
            <p>Dear {{ $staffName }},</p>
            <p>Welcome to Shatleh, your trusted partner in agriculture!</p>
            <div class="staff-details">
                Name: {{ $staffName }}<br>
                Role: {{ $staffRole }}
            </div>
            <p>We are thrilled to have you join our team as {{ $staffRole == 'Expert' ? 'an Expert' : 'an Employee' }}. Your skills and expertise will play a vital role in advancing our mission to empower agriculture, one seed at a time.</p>
            <p>Please use the following  password to log in to your account:</p>
            <div class="password">{{ $password }}</div>
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
    <title>مرحبًا بك في شتلة!</title>
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
        .staff-details {
            font-size: 18px;
            font-weight: bold;
            color: #2e7d32;
            margin: 20px 0;
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
            <p>عزيزي {{ $staffName }}،</p>
            <p>مرحبًا بك في شتلة، شريكك الموثوق في الزراعة!</p>
            <div class="staff-details">
                الاسم: {{ $staffName }}<br>
                الدور: {{ $staffRole == 'Expert' ? 'خبير' : 'موظف' }}
            </div>
            <p>يسعدنا انضمامك إلى فريقنا كـ {{ $staffRole == 'Expert' ? 'خبير' : 'موظف' }}. ستساهم مهاراتك وخبراتك في تعزيز مهمتنا لتمكين الزراعة، بذرة واحدة في كل مرة.</p>
            <p>يرجى استخدام كلمة المرور  التالية لتسجيل الدخول إلى حسابك:</p>
            <div class="password">{{ $password }}</div>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} شتلة. جميع الحقوق محفوظة.</p>
            <p>تمكين الزراعة، بذرة واحدة في كل مرة.</p>
        </div>
    </div>
</body>
</html>
@endif