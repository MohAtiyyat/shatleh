<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Customer\StoreCustomerRequest;
use App\Http\Requests\Dashboard\Customer\UpdateCustomerRequest;
use App\Mail\NewCustomer;
use App\Mail\NewPassword;
use App\Models\Cart;
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
        $customers = 
        User::with('roles', 'addresses')->get()->filter(
                fn ($user) => $user->roles->contains(fn ($role) =>$role->name === 'Customer'));
        User::with('roles', 'addresses')->get()->filter(
                fn ($user) => $user->roles->contains(fn ($role) =>$role->name === 'Customer'));
        return view('admin.Customer.index', compact('customers'));
    }

    public function create()
    {
        return view('admin.Customer.createUpdate');
    }

    public function store(StoreCustomerRequest $request)
    {
        // dd($request->all());
        $data = $request->validated();

        $password = Str::random(8); 
        $data['password'] = bcrypt($password);

        $user = User::create(
            $data
        );

        $user->assignRole('Customer');

        Mail::to($user->email)->send(new NewCustomer(password: $password, lang: $user->lang?? 'ar'));
        $this->logAction(auth()->id(), 'create_customer', 'Customer created: ' . $user->name . ' (Id: ' . $user->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer created successfully.');
    }

    public function show(User $customer)
    {
        $ordersCount = $customer->orders->count();
        $cartItems = $customer->cart()->with('product')->paginate(5);
        $defaultAddress = $customer->address;
        $addresses = $customer->addresses;
        return view('admin.Customer.show', compact('customer', 'ordersCount', 'cartItems', 'addresses' , 'defaultAddress'));
    }

    public function edit(User $customer)
    {
        return view('admin.Customer.createUpdate', compact('customer'));
    }

    public function update(UpdateCustomerRequest $request, User $customer)
    {
        $data = $request->validated();

        $customer->update(
            $data
        );

        $this->logAction(auth()->id(), 'update_customer', 'Customer updated: ' . $customer->name . ' (Id: ' . $customer->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(User $customer)
    {
        $customer->addresses()->delete();
        $customer->cart()->delete();
        $customer->orders()->delete();
        $customer->delete();
        $customer->delete();

        $this->logAction(auth()->id(), 'delete_customer', 'Customer deleted: ' . $customer->name . ' (Id: ' . $customer->id . ')', LogsTypes::WARNING->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer deleted successfully.');
    }

    public function toggleBan(User $customer)
    {
        
        $customer->update(['is_banned' => !$customer->is_banned]);

        $this->logAction(auth()->id(), 'toggle_ban_customer', ($customer? 'Banned customer: ' : 'Unbanned customer: ') . $customer->first_name . ' ' . $customer->last_name . ' (Id: ' . $customer->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Customer ban status updated.');
    }

    public function resetPassword(User $customer)
    {

        $newPassword = Str::random(8); // You can generate a random password here if needed
        $customer->update(['password' => bcrypt($newPassword)]);
        Mail::to($customer->email)->send(new NewPassword(newPassword: $newPassword, lang: $customer->lang));


        $this->logAction(auth()->id(), 'reset_password_customer', 'Password reset for customer: ' . $customer->name . ' (Id: ' . $customer->id . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.customer.index')->with('success', 'Password reset successfully.');
    }
}
