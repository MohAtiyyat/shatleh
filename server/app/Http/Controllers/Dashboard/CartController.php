<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $records = User::with(['cart.product'])
        ->whereHas('cart')
        ->get();
        $total_price = [];
        $records->each(function ($record) use (&$total_price) {
            $record->cart->each(function ($cart) use (&$total_price, $record) {
                $total_price[$record->id] = $cart->product->price * $cart->quantity + (isset($total_price[$record->id]) ? $total_price[$record->id] : 0);
            }); 
        });
        

        return view('admin.Cart.index', compact('records', 'total_price'));
    }

    public function show($id)
    {
        $cart = Cart::where('customer_id', $id)->with(['product'])->get();
        $user = User::find($id);
        
        return view('admin.Cart.show', compact('cart', 'user'));
    }
}
