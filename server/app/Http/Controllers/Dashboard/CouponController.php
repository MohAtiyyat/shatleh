<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::with(['country'])->get();
        return view('admin.Coupon.index' , compact('coupons'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $countries = Country::all();
        return view('admin.coupon.createUpdate', compact('countries'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'title' => 'required|string|max:255',
            'code' => 'required|string|unique:coupons,code|max:50',
            'is_active' => 'required|boolean',
            'expire_date' => 'required|date',
            'quantity' => 'required|integer|min:0',
            'country_id' => 'required|exists:countries,id',
        ]);

        Coupon::create($validated);

        return redirect()->route('dashboard.coupon.index')->with('success', 'Coupon created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coupon $coupon)
    {
        $countries = Country::all();
        return view('admin.Coupon.createUpdate', compact('coupon', 'countries'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'title' => 'required|string|max:255',
            'code' => 'required|string|unique:coupons,code,' . $coupon->id . '|max:50',
            'is_active' => 'required|boolean',
            'expire_date' => 'required|date',
            'quantity' => 'required|integer|min:0',
            'country_id' => 'required|exists:countries,id',
        ]);

        $coupon->update($validated);

        return redirect()->route('dashboard.coupon.index')->with('success', 'Coupon updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('dashboard.coupon.index')->with('success', 'Coupon deleted successfully');
    }
}
