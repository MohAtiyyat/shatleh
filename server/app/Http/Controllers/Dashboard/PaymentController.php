<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('order' , 'customer' , 'paymentInfo')->get();
        return view('admin.Payment.index' , compact('payments'));
    }
}
