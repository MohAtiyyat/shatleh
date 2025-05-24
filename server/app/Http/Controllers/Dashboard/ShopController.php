<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Address\DeleteAddressRequest;
use App\Http\Requests\Dashboard\Shop\DeleteShopRequest;
use App\Http\Requests\Dashboard\Shop\StoreShopRequest;
use App\Http\Requests\Dashboard\Shop\UpdateShopRequest;
use App\Models\Address;
use App\Models\Log;
use App\Models\Shop;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ShopController extends Controller
{
    use HelperTrait;
    public function index()
    {

        $shops = Shop::with(['address', 'employee'])->get();
        return view('admin.Shop.index', compact('shops'));
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

        $data+= [
            'employee_id' => Auth::user()->id,
        ];
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('shops', 'public');
            $data['image'] = Storage::url($imagePath);
        }

        Shop::create($data);

        $this->logAction(auth()->id(), 'create_shop', 'Shop created: ' . $data['name'] . ' (ID: ' . $data['id'] . ')', LogsTypes::INFO->value);
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
        $data+= [
            'employee_id' => Auth::user()->id,
        ];
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

            $this->logAction(auth()->id(), 'update_shop', 'Shop updated: ' . $data['name'] . ' (ID: ' . $shop->id . ')', LogsTypes::INFO->value);
            return redirect()->route('dashboard.shop')->with('success', 'Shop updated successfully.');
        } catch (\Exception $e) {
            $this->logAction(auth()->id(), 'update_shop_error', 'Error updating shop: ' . $e->getMessage(), LogsTypes::ERROR->value);
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

        $this->logAction(auth()->id(), 'delete_shop', 'Shop deleted: ' . $shop->name . ' (ID: ' . $shop->id . ')', LogsTypes::WARNING->value);
        return redirect()->route('dashboard.shop')->with('success', 'Shop deleted successfully.');
    }

}
