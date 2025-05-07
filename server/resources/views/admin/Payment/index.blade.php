@extends('admin.layout.master')

@section('title', 'Payments Management')
@section('Payments_Show', 'active')

@section('content')
    <x-management-table
        title="Payments Management"
        :headers="[
            '#', 'Order ID', 'Customer Name', 'Amount', 'Payment Info ID', 'Status', 'Refund Status'
        ]"
        :items="$payments"
        :Route="'dashboard.payments'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.payments')
            @foreach ($payments as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td><a href="{{ route('dashboard.order' . '.show', $item->order_id) }}">{{ $item->order_id }}</a></td>
                    <td><a href="{{ route('dashboard.customer' . '.show', $item->customer->user->id)  }}">{{ $item->customer->user->first_name . ' ' . $item->customer->user->last_name ?? 'N/A' }}</a></td>
                    <td>{{ $item->amount }}</td>
                    <td>{{ $item->payment_info_id }}</td>
                    <td>{{ $item->status }}</td>
                    <td>
                        {{--this will be changed later--}}
                        @if($item->refund_status !== 'fully_refunded')
                            <x-refund-popout
                                :payment="$item"
                                title="Refund Details for Payment #{{ $item->id }}"
                            />
                        @else
                            {{ $item->refund_status }}
                        @endif
                    </td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
