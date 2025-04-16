<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Shop;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::with(['address', 'employee'])->get();
        return view('admin.Shop.all', compact('shops'));
    }

    public function show($id)
    {
        $shop = Shop::with(['address', 'employee'])->findOrFail($id);
        return view('admin.Shop.show', compact('shop'));
    }


    public function create()
    {
        $addresses = Address::pluck('title', 'id')->toArray();
        return view('admin.Shop.createUpdate', compact('addresses'));
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address_id' => 'required|exists:addresses,id',
            'details' => 'required|string|max:500',
            'owner_phone_number' => 'required|string|max:20',
            'owner_name' => 'required|string|max:255',
            'is_partner' => 'required|boolean',
            'image' => 'image|mimes:jpg,png,jpeg,webp|max:255',
            'employee_id' => 'required|exists:employees,id',
        ]);


        Shop::create($validated);

        return redirect()->route('dashboard.Shop');
    }

}
