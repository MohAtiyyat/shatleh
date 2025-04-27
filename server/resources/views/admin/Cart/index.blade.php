@extends('admin.layout.master')

@section('title', 'Customer Management')
@section('Carts_Show', 'active')

@section('content')
    <x-management-table
        title="Cart Management"
        :headers="[
            '#', 'Owner Name', 'Products Count', 'Total Price'
        ]"
        :items="$carts"
        :Route="null"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.cart')
            @foreach ($carts as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->customer->user->first_name }} {{ $item->customer->user->last_name }}</td>
                    <td><a href="{{ route($Route . '.show', $item->id)}}">{{ $item-> }}</a></td>
                    <td>{{ number_format($item->total_price, 2) }}</td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
