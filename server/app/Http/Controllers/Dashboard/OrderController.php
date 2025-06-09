<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use HelperTrait;
    public function index(){
        $order = Order::with('customer' , 'employee' , 'address')->get();
        $experts = User::whereHas('roles', fn($q) => $q->where('name', 'Expert'))->pluck('first_name', 'id');

        return view('admin.Order.index' , compact('order', 'experts'));
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
        $order = Order::with('customer', 'employee', 'address', 'orderDetails.product')->findOrFail($order->id);
        return view('admin.Order.show' , compact('order'));
    }

    public function assign(Request $request, Order $order)
    {
        $request->validate([
            'expert_id' => 'required|exists:users,id',
        ]);

        $order->update(['expert_id' => $request->expert_id, 'employee_id' => auth()->user()->id]);

        $this->logAction(auth()->id(), 'assign_service_request', 'Service request assigned: Service Request ID ' . $order->id . ' to Expert ID: ' . $request->expert_id, LogsTypes::INFO->value);
        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Expert assigned successfully.');
    }
}
