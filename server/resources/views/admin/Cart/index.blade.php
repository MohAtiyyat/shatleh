@extends('admin.layout.master')

@section('title', 'Customer Management')
@section('Carts_Show', 'active')

@section('content')
    <x-management-table
        title="Cart Management"
        :headers="[
            '#', 'Owner Name', 'Products Count', 'Total Price'
        ]"
        :items="$records"
        :Route="null"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.cart')
            @foreach ($records as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->first_name }} {{ $item->last_name }}</td>
                    <td><a href="">{{ $item->cart->count() }}</a></td>
                    <td>{{ $total_price[$item->id]? $total_price[$item->id]/100 : 'N/A' }}</td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
