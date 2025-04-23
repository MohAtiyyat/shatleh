<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Address\DeleteAddressRequest;
use App\Http\Requests\Dashboard\Address\StoreAddressRequest;
use App\Http\Requests\Dashboard\Address\UpdateAddressRequest;
use App\Models\Address;
use App\Models\Country;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::with(['country', 'user'])->paginate(50);
        return view('admin.Address.all', compact('addresses'));
    }

    public function create()
    {
        $countries = Country::select('id', 'name_en')->get()->pluck('name_en', 'id')->toArray();
        $users = User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as full_name"))
            ->get()
            ->pluck('full_name', 'id')
            ->toArray();
        return view('admin.Address.createUpdate', compact('countries', 'users'));
    }

    public function store(StoreAddressRequest $request)
    {
        $data = $request->validated();

        try {
            Address::create($data);
            return redirect()->route('dashboard.Address.index')->with('success', 'Address created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create address: ' . $e->getMessage()]);
        }
    }

    public function show(Address $address)
    {
        $address->load(['country', 'user']);
        return view('admin.Address.show', compact('address'));
    }

    public function edit(Address $address)
    {
        $countries = Country::select('id', 'name_en')->get()->pluck('name_en', 'id')->toArray();
        $users = User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as full_name"))
            ->get()
            ->pluck('full_name', 'id')
            ->toArray();
        return view('admin.Address.createUpdate', compact('address', 'countries', 'users'));
    }

    public function update(UpdateAddressRequest $request, Address $address)
    {
        $data = $request->validated();

        try {
            $address->update($data);
            return redirect()->route('dashboard.Address.index')->with('success', 'Address updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update address: ' . $e->getMessage()]);
        }
    }

    public function delete(DeleteAddressRequest $request, Address $address)
    {
        try {
            $address->delete();
            return redirect()->route('dashboard.Address.index')->with('success', 'Address deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete address: ' . $e->getMessage()]);
        }
    }

}
