<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use HelperTrait;
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

        $this->logAction(auth()->id(), 'update_order_status', 'Order status updated: Order ID ' . $order->id . ' to ' . $validated['status'], LogsTypes::INFO->value);
        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function show(Order $order){
        $order = Order::with('customer' , 'employee' , 'address' , 'payment')->find($order->id);
        dd($order);
        return view('admin.Order.show' , compact('order'));
    }
}
