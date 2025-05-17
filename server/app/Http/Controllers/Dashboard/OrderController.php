<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(){
        $order = Order::with('customer' , 'employee' , 'address' , 'payment')->get();
        return view('admin.Order.index' , compact('order'));
    }

    public function updateStatus(Request $request, Order $order){
        $validated = $request->validate([
            'status' => 'required|string|in:pending,inProgress,shipped,delivered,cancelled',
        ]);

        $order->status = $validated['status'];
        $order->employee_id = Auth::user()->id; // Marks the current user as the one managing it
        $order->save();

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function show(Order $order){
        $order = Order::with('customer' , 'employee' , 'address' , 'payment')->find($order->id);
        return view('admin.Order.show' , compact('order'));
    }
}
