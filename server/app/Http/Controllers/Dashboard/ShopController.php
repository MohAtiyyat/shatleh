<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Shop\StoreShopRequest;
use App\Models\Address;
use App\Models\Shop;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ShopController extends Controller
{
    public function index()
    {

        $shops = Shop::with(['address', 'employee'])-> paginate(10);
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

    public function store(StoreShopRequest $request)
    {

        $data = $request->validated();

        dd($data);
        $shop = Shop::create($data);

        return redirect()->route('dashboard.Shop');
    }

}
