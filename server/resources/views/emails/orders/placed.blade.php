@if($lang == 'en')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification - Shatleh</title>
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
            text-align: left;
        }
        .order-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #2e7d32;
            border-radius: 4px;
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
            <h2>New Order Placed</h2>
        </div>
        <div class="content">
            <p>Dear Team,</p>
            <p>A new order has been placed on <strong>Shatleh</strong> platform. Here are the details:</p>
            
            <div class="order-info">
                <p><strong>Order ID:</strong> {{ $order->id }}</p>
                <p><strong>Order Code:</strong> {{ $order->order_code }}</p>
                <p><strong>Customer ID:</strong> {{ $order->customer_id }}</p>
                <p><strong>Total Price:</strong> {{ number_format($order->total_price, 2) }} JOD</p>
                <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
            </div>

            <p>Please check the admin dashboard for full details and processing.</p>
            <a href="{{ url('/admin/orders/'.$order->id) }}" class="button">View Order</a>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Shatleh. All rights reserved.</p>
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
    <title>إشعار طلب جديد - شتلة</title>
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
            text-align: right;
        }
        .order-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-right: 4px solid #2e7d32;
            border-radius: 4px;
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
            <h2>طلب جديد</h2>
        </div>
        <div class="content">
            <p>فريقنا العزيز،</p>
            <p>تم استلام طلب جديد على منصة <strong>شتلة</strong>. فيما يلي تفاصيل الطلب:</p>
            
            <div class="order-info">
                <p><strong>رقم الطلب:</strong> {{ $order->id }}</p>
                <p><strong>كود الطلب:</strong> {{ $order->order_code }}</p>
                <p><strong>رقم العميل:</strong> {{ $order->customer_id }}</p>
                <p><strong>إجمالي السعر:</strong> {{ number_format($order->total_price, 2) }} دينار</p>
                <p><strong>الحالة:</strong> {{ ucfirst($order->status) }}</p>
            </div>

            <p>يرجى مراجعة لوحة التحكم لمزيد من التفاصيل ومعالجة الطلب.</p>
            <a href="{{ url('/admin/orders/'.$order->id) }}" class="button">عرض الطلب</a>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} شتلة. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
@endif
