<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Address\DeleteAddressRequest;
use App\Http\Requests\Dashboard\Address\StoreAddressRequest;
use App\Http\Requests\Dashboard\Address\UpdateAddressRequest;
use App\Http\Requests\Dashboard\Shop\UpdateShopRequest;
use App\Models\Address;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use HelperTrait;
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
    public function create()
    {
        $contries = \App\Models\Country::pluck('name_en', 'id');

        return view('admin.address.createUpdate')->with([
            'countries' => $contries]);
    }
    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();

        Address::create($data);

        $this->logAction(auth()->user()->id, 'create_address', 'Address created: ' . $data['title'] , LogsTypes::INFO->value);
        return redirect()->back()->with(['message' => 'Address created successful'], 200);
    }

    public function update(UpdateAddressRequest $request)
    {
        $data = $request->validated();

        Address::update($data);

        $this->logAction(auth()->id(), 'update_address', 'Address updated: ' . $data['title'] . ' (ID: ' . $data['id'] . ')', LogsTypes::INFO->value);
        return response()->json(['message' => 'Address updated successful'], 200);
    }

    public function delete(DeleteAddressRequest $request)
    {
        $id = $request->id;
        Address::where('id', $id)->delete();

        $this->logAction(auth()->id(), 'delete_address', 'Address deleted: ID ' . $id, LogsTypes::WARNING->value);
        return response()->json(['message' => 'Address deleted successful'], 200);
    }
}
