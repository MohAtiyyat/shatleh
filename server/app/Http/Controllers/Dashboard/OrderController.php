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

    public function updateStatus(Request $request, Order $id){
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $id->status = $validated['status'];
        $id->employee_id = Auth::user()->id; // Marks the current user as the one managing it
        $id->save();

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}
