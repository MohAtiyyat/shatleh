<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Address\DeleteAddressRequest;
use App\Http\Requests\Dashboard\Address\StoreAddressRequest;
use App\Http\Requests\Dashboard\Address\UpdateAddressRequest;
use App\Http\Requests\Dashboard\Shop\UpdateShopRequest;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::all();
        return response()->json($addresses, 200);
    }

    public function show($id)
    {
        $address = Address::findOrFail($id);
        return response()->json($address, 200);
    }
    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();

        Address::create($data);

        return response()->json(['message' => 'Registration successful'], 200);
    }

    public function update(UpdateAddressRequest $request)
    {
        $data = $request->validated();

        Address::update($data);

        return response()->json(['message' => 'Registration successful'], 200);
    }

    public function delete(DeleteAddressRequest $request)
    {
        $id = $request->id;
        Address::where('id', $id)->delete();
        return response()->json(['message' => 'Registration successful'], 200);
    }
}
