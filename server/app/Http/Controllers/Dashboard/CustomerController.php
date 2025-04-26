<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Customer\StoreCustomerRequest;
use App\Models\Customer;
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
        $validated = $request->validated();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'language' => $validated['language'],
            'password' => Hash::make('default_password'), // Set a default or generate
            'email_verified_at' => now(),
            'ip_country_id' => 1, // Default value, adjust as needed
            'time_zone' => 'UTC', // Default value
            'address_id' => 1, // Default value, adjust as needed
            'bio' => '',
        ]);

        Customer::create([
            'user_id' => $user->id,
            'balance' => 0,
            'payment_info_id' => 1, // Default value, adjust as needed
        ]);

        return redirect()->route('dashboard.customer.index')->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load('user');

        $ordersCount = $customer->orders->count();
        $cartItems = $customer->cart()->get();
        $addresses = $customer->user->defaultAddress()->get();
        return view('admin.Customer.show', compact('customer', 'ordersCount', 'cartItems', 'addresses'));
    }

    public function edit(Customer $customer)
    {
        $customer->load('user');
        return view('admin.Customer.createUpdate', compact('customer'));
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone_number' => 'required|string|max:20',
            'language' => 'required|string|max:10',
        ]);

        $customer->user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'language' => $validated['language'],
        ]);

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
