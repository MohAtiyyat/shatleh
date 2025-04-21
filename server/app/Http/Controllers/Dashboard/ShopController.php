<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Address\DeleteAddressRequest;
use App\Http\Requests\Dashboard\Shop\DeleteShopRequest;
use App\Http\Requests\Dashboard\Shop\StoreShopRequest;
use App\Http\Requests\Dashboard\Shop\UpdateShopRequest;
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

    public function store(StoreShopRequest $request)
    {

        $data = $request->validated();


        $shop = Shop::create($data);

        return redirect()->route('dashboard.Shop');
    }

    public function edit($id)
    {
        $shop = Shop::findOrFail($id);
        $addresses = Address::pluck('title', 'id')->toArray();
        return view('admin.Shop.createUpdate', compact('shop', 'addresses'));
    }

    public function update(UpdateShopRequest $request)
    {
        $shop = Shop::findOrFail($request->id);
        $data = $request->all();
        $shop->update($data);
        return redirect()->route('dashboard.Shop');
    }

    public function delete(DeleteShopRequest $request)
    {
        $shop = Shop::findOrFail($request->id);
        $shop->delete();
        return redirect()->route('dashboard.Shop');
    }

}
