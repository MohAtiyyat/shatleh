<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\ProductShop\StoreProductShopRequest;
use App\Http\Requests\Dashboard\Product\UpdateProductShopRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductShopController extends Controller
{
    public function index()
    {
        $records = DB::table('product_shops')
            ->join('products', 'product_shops.product_id', '=', 'products.id')
            ->join('shops', 'product_shops.shop_id', '=', 'shops.id')
            ->join('users', 'product_shops.employee_id', '=', 'users.id')
            ->select(
                'product_shops.*',
                'products.name_en as product_name',
                'shops.name as shop_name',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as employee_name")
            )
            ->whereNull('product_shops.deleted_at')
            ->get();

        return view('admin.ProductShop.all', compact('records'));
    }

    public function create()
    {
        $products = DB::table('products')->get();
        $shops = DB::table('shops')->get();
        $users = DB::table('users')->where('is_banned', false)->get();
        return view('admin.ProductShop.createUpdate', compact('products', 'shops', 'users'));
    }

    public function store(Request $request)
    {
        $request->all();

        DB::table('product_shops')->insert([
            'product_id' => $request->product_id,
            'shop_id' => $request->shop_id,
            'employee_id' => $request->employee_id??1,
            'cost' => $request->cost,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('dashboard.productShop')->with('success', 'Product shop record created successfully.');
    }

    public function show($id)
    {
        $record = DB::table('product_shops')
            ->where('product_shops.id', $id)
            ->whereNull('product_shops.deleted_at')
            ->join('products', 'product_shops.product_id', '=', 'products.id')
            ->join('shops', 'product_shops.shop_id', '=', 'shops.id')
            ->join('users', 'product_shops.employee_id', '=', 'users.id')
            ->select(
                'product_shops.*',
                'products.name_en as product_name',
                'shops.name as shop_name',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as employee_name")
            )
            ->first();

        if (!$record) {
            abort(404, 'Product shop record not found.');
        }

        return view('admin.ProductShop.show', compact('record'));
    }

    public function edit($id)
    {
        $item = DB::table('product_shops')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();

        if (!$item) {
            abort(404, 'Product shop record not found.');
        }
        $item = (array) $item;

        $products = DB::table('products')->get();
        $shops = DB::table('shops')->get();
        $users = DB::table('users')->where('is_banned', false)->get();

        return view('admin.ProductShop.createUpdate', compact('item', 'products', 'shops', 'users'));
    }

    public function update(UpdateProductShopRequest $request, $id)
    {
        $request->validated();

        $record = DB::table('product_shops')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();

        if (!$record) {
            abort(404, 'Product shop record not found.');
        }

        DB::table('product_shops')->where('id', $id)->update([
            'product_id' => $request->product_id,
            'shop_id' => $request->shop_id,
            'employee_id' => $request->employee_id,
            'cost' => $request->cost,
            'updated_at' => now(),
        ]);

        return redirect()->route('dashboard.productShop')->with('success', 'Product shop record updated successfully.');
    }
    public function delete($id)
    {
        $record = DB::table('product_shops')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->first();

        if (!$record) {
            abort(404, 'Product shop record not found.');
        }

        DB::table('product_shops')->where('id', $id)->update([
            'deleted_at' => now(),
        ]);

        return redirect()->route('dashboard.productShop')->with('success', 'Product shop record deleted successfully.');
    }
}
