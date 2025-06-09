<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Customer\StoreCustomerRequest;
use App\Http\Requests\Dashboard\Customer\UpdateCustomerRequest;
use App\Mail\NewPassword;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    use HelperTrait;
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

        $this->logAction(auth()->id(), 'create_customer', 'Customer created: ' . $user->name . ' (Id: ' . $user->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer created successfully.');
    }

    public function show(Customer $customer)
    {
        $customer->load('user');
        $ordersCount = $customer->orders->count();
        $cartItems = $customer->cart()->with('product')->paginate(5);
        $defaultAddress = $customer->user->address;
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

        $this->logAction(auth()->id(), 'update_customer', 'Customer updated: ' . $customer->user->name . ' (Id: ' . $customer->user->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->user->addresses()->delete();
        $customer->user->cart()->delete();
        $customer->user->orders()->delete();
        $customer->user->delete();
        $customer->delete();

        $this->logAction(auth()->id(), 'delete_customer', 'Customer deleted: ' . $customer->user->name . ' (Id: ' . $customer->user->id . ')', LogsTypes::WARNING->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer deleted successfully.');
    }

    public function toggleBan(Customer $customer)
    {
        
        $customer->user->update(['is_banned' => !$customer->user->is_banned]);

        $this->logAction(auth()->id(), 'toggle_ban_customer', ($customer->user? 'Banned customer: ' : 'Unbanned customer: ') . $customer->user->first_name . ' ' . $customer->user->last_name . ' (Id: ' . $customer->user->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer ban status updated.');
    }

    public function resetPassword(Customer $customer)
    {

        $newPassword = Str::random(8); // You can generate a random password here if needed
        $customer->user->update(['password' => bcrypt($newPassword)]);
        Mail::to($customer->user->email)->send(new NewPassword(newPassword: $newPassword, lang: $customer->user->lang));


        $this->logAction(auth()->id(), 'reset_password_customer', 'Password reset for customer: ' . $customer->user->name . ' (Id: ' . $customer->user->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Password reset successfully.');
    }
}
