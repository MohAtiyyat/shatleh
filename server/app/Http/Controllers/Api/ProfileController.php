<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use function PHPSTORM_META\map;

class ProfileController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user();
        return response()->json([
            'data' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'photo' => $user->photo ? Storage::url($user->photo) : null,
            ]
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'required|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB
            'current_password' => 'nullable|string|required_with:new_password',
            'new_password' => 'nullable|string|min:8|required_with:current_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['first_name', 'last_name', 'email', 'phone_number']);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo) {
                Storage::delete($user->photo);
            }
            $path = $request->file('photo')->store('profile_photos', 'public');
            $data['photo'] = $path; // Store the relative path (e.g., profile_photos/filename.jpg)
        } elseif ($request->input('remove_photo') === 'true') {
            if ($user->photo) {
                Storage::delete($user->photo);
            }
            $data['photo'] = null;
        }

        if ($request->filled('current_password') && $request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['errors' => ['current_password' => ['Current password is incorrect']]], 422);
            }
            $data['password'] = Hash::make($request->new_password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'photo' => $user->photo ? Storage::url($user->photo) : null,
            ]
        ], 200);
    }

    public function getAddresses()
    {
        $user = Auth::user();
        $addresses = $user->addresses()->with('country')->get()->map(function ($address) {
            return [
                'id' => $address->id,
                'title' => $address->title,
                'country_id' => $address->country_id,
                'country_name' => $address->country ? $address->country->name : null,
                'city' => $address->city,
                'address_line' => $address->address_line,
                'is_default' => $address->id == Auth::user()->address_id,
            ];
        });

        return response()->json(['data' => $addresses], 200);
    }

    public function storeAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'city' => 'required|string|max:255',
            'address_line' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $address = $user->addresses()->create($request->only([
            'title',
            'country_id',
            'city',
            'address_line'
        ]));

        // Set as default if user has no default address
        if (!$user->address_id) {
            $user->address_id = $address->id;
            $user->save();
        }

        return response()->json([
            'message' => 'Address added successfully',
            'address' => [
                'id' => $address->id,
                'title' => $address->title,
                'country_id' => $address->country_id,
                'country_name' => $address->country ? $address->country->name : null,
                'city' => $address->city,
                'address_line' => $address->address_line,
                'is_default' => $address->id == $user->address_id,
            ]
        ], 201);
    }

    public function updateAddress(Request $request, $id)
    {
        $address = Address::findOrFail($id);
        if ($address->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'city' => 'required|string|max:255',
            'address_line' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $address->update($request->only([
            'title',
            'country_id',
            'city',
            'address_line'
        ]));

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => [
                'id' => $address->id,
                'title' => $address->title,
                'country_id' => $address->country_id,
                'country_name' => $address->country ? $address->country->name : null,
                'city' => $address->city,
                'address_line' => $address->address_line,
                'is_default' => $address->id == Auth::user()->address_id,
            ]
        ], 200);
    }

    public function setDefaultAddress($id)
    {
        $address = Address::findOrFail($id);
        if ($address->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = Auth::user();
        $user->address_id = $address->id;
        $user->save();

        return response()->json(['message' => 'Default address set successfully'], 200);
    }

    public function deleteAddress($id)
    {
        $address = Address::findOrFail($id);
        if ($address->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($address->id == Auth::user()->address_id) {
            $otherAddresses = Auth::user()->addresses()->where('id', '!=', $id)->get();
            if ($otherAddresses->isEmpty()) {
                Auth::user()->update(['address_id' => null]);
            } else {
                return response()->json(['error' => 'Cannot delete default address. Set another address as default first.'], 422);
            }
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully'], 200);
    }

    public function getOrders()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $orders = Order::where('customer_id', $user->id)
            ->with([
                'products' => function ($query) {
                    $query->with('categories');
                },
                'address',
                'coupon'
            ])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'total_price' => $order->total_price,
                    'status' => $order->status,
                    'order_date' => $order->created_at->format('Y-m-d H:i:s'),
                    'products' => $order->products->map(function ($product) {
                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'price' => $product->pivot->price,
                            'quantity' => $product->pivot->quantity,
                            'image' => $product->image[0],
                            'categories' => $product->categories->map(function ($category) {
                                return [
                                    'id' => $category->id,
                                    'name' => $category->name,
                                ];
                            }),
                        ];
                    }),
                    'address' => $order->address ? [
                        'id' => $order->address->id,
                        'title' => $order->address->title,
                        'city' => $order->address->city,
                        'address_line' => $order->address->address_line,
                    ] : null,
                    'coupon' => $order->coupon ? [
                        'id' => $order->coupon->id,
                        'code' => $order->coupon->code,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $orders,
            'message' => $orders->isEmpty() ? 'No orders found' : 'Orders retrieved successfully',
        ], 200);
    }

    public function cancelOrder($id)
    {
        $order = Order::findOrFail($id);
        if ($order->customer_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Order cancelled successfully'], 200);
    }

    public function getServiceRequests()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $serviceRequests = ServiceRequest::where('customer_id', $user->id)->get()->map(function ($serviceRequest) {
            return [
                'id' => $serviceRequest->id,
                'service' => $serviceRequest->service ? [
                    'id' => $serviceRequest->service->id,
                    'title_en' => $serviceRequest->service->name_en,
                    'title_ar' => $serviceRequest->service->name_ar
                ] : null,
                'customer_id' => $serviceRequest->customer_id,
                'details' => $serviceRequest->details,
                'status' => $serviceRequest->status,
                'created_at' => $serviceRequest->created_at->format('Y-m-d H:i:s'),
                'address' => $serviceRequest->address ? [
                    'id' => $serviceRequest->address->id,
                    'title' => $serviceRequest->address->title,
                    'city' => $serviceRequest->address->city,
                    'address_line' => $serviceRequest->address->address_line,
                ] : null,
            ];
        });
        return response()->json([
            'data' => $serviceRequests,
            'message' => $serviceRequests->isEmpty() ? 'No service requests found' : 'Service requests retrieved successfully',
        ], 200);
    }
}
