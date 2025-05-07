<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Service;
use Illuminate\Http\Request;

class StripeController extends Controller
{
    public function index()
    {
        return view('stripe');
    }
    public function checkout(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'amount' => 'required|numeric|min:1',
            'product_id'=> 'required_if:service_id,null|integer',
            'service_id'=> 'required_if:product_id,null|integer',
            'quantity'=> 'required|integer|min:1',
        ]);

        $item = null;

        if ($request->has('product_id')) {
            $item = Product::find($request->product_id);
        } elseif ($request->has('service_id')) {
            $item = Service::find($request->service_id);
        }
        
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $checkout_session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $item->name_en,
                    ],
                    'unit_amount' => $item->price,
                ],
                'quantity' => $request->quantity,
            ]],
            'mode' => 'payment',
            'success_url' => route('stripe.success'),
            'cancel_url' => route('stripe.cancel'),
        ]);
        return response()->json(['id' => $checkout_session->id]);
    }
    public function success()
    {
        return view('success');
    }
    public function cancel()
    {
        return view('cancel');
    }
}
