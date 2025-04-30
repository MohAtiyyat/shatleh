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
        $shop = Shop::findOrFail($id);
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

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('shops', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        Shop::create($data);

        return redirect()->route('dashboard.shop')->with('success', 'Shop created successfully.');
    }

    public function edit($id)
    {
        $shop = Shop::findOrFail($id);
        $addresses = Address::pluck('title', 'id')->toArray();
        return view('admin.Shop.createUpdate', compact('shop', 'addresses'));
    }

    public function update(UpdateShopRequest $request, $id)
    {
        $shop = Shop::findOrFail($id);
        $data = $request->validated();

        try {
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($shop->image) {
                    $oldImagePath = ltrim(parse_url($shop->image, PHP_URL_PATH), '/storage/');
                    Storage::disk('public')->delete($oldImagePath);
                }
                // Store new image
                $imagePath = $request->file('image')->store('shops', 'public');
                $data['image'] = Storage::url($imagePath);
            }

            $shop->update($data);

            return redirect()->route('dashboard.shop')->with('success', 'Shop updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update shop: ' . $e->getMessage()]);
        }
    }

    public function delete(DeleteShopRequest $request, $id)
    {
        $shop = Shop::findOrFail($id);
        if ($shop->image) {
            $imagePath = ltrim(parse_url($shop->image, PHP_URL_PATH), '/storage/');
            Storage::disk('public')->delete($imagePath);
        }
        $shop->delete();

        return redirect()->route('dashboard.shop')->with('success', 'Shop deleted successfully.');
    }

}
