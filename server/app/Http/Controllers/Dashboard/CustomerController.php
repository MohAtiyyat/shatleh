<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Customer\StoreCustomerRequest;
use App\Http\Requests\Dashboard\Customer\UpdateCustomerRequest;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with('user')->get();
        return view('admin.Customer.index', compact('customers'));
    }

    public function create()
    {
        return view('admin.Customer.createUpdate');
    }

    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        $data['password'] = Hash::make("1234");
        $user = User::create(
            $data
        );

        Customer::create([
            'user_id' => $user->id,
            'balance' => 0,
        ]);

        return redirect()->route('dashboard.customer.index')->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load('user');
        $ordersCount = $customer->orders->count();
        $cartItems = $customer->cart()->with('product')->paginate(5);
        $defaultAddress = $customer->user->defaultAddress;
        $addresses = $customer->user->addresses;
        return view('admin.Customer.show', compact('customer', 'ordersCount', 'cartItems', 'addresses' , 'defaultAddress'));
    }

    public function edit(Customer $customer)
    {
        $customer->load('user');
        return view('admin.Customer.createUpdate', compact('customer'));
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();

        $customer->user->update(
            $data
        );

        return redirect()->route('dashboard.customer.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer deleted successfully.');
    }

    public function toggleBan(Customer $customer)
    {
        $customer->user->update(['is_banned' => !$customer->user->is_banned]);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer ban status updated.');
    }

    public function resetPassword(Customer $customer)
    {
        // Reset password via email(will be done later)
        return redirect()->route('dashboard.customer.index')->with('success', 'Password reset successfully.');
    }
}
