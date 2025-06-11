@extends('admin.layout.master')

@section('title', 'Order Management')
@section('Order_Show', 'active')

@section('content')
    <x-management-table
        title="Order Management"
        :headers="[
            '#', 'Customer Name', 'Managed By', 'Recipient Name', 'Recipient Phone', 'Assigned To', 'Status', 'Payment Method', 'Refund Status', 'Address', 'Actions'
        ]"
        :items="$order"
        :Route="'dashboard.order'"
    >
        <x-slot name="rows">
            @php($Route = 'dashboard.order')
            @foreach ($order as $record)
                <tr>
                    <td>{{ $record->id }}</td>
                    <td>{{ $record->customer->first_name ?? '' }} {{ $record->customer->last_name ?? '' }}</td>
                    <td>
                        {{ $record->employee ? $record->employee->first_name . ' ' . $record->employee->last_name : 'N/A' }}
                    </td>
                    <td>{{ $record->first_name ?? 'N/A' }} {{ $record->last_name ?? '' }}</td>
                    <td>{{ $record->phone_number ?? 'N/A' }}</td>
                    <td>
                        @if (!auth()->user()->hasAnyRole('Admin|Employee') && $record->expert)
                            {{ $record->expert ? $record->expert->first_name . ' ' . $record->expert->last_name : 'N/A' }}
                        @else
                            <form method="POST" action="{{ route($Route . '.assign', $record->id) }}">
                                @csrf
                                <select name="expert_id" onchange="this.form.submit()" class="form-select">
                                    <option value="">Select Expert</option>
                                    @foreach($experts as $id => $name)
                                        <option value="{{ $id }}" {{ (isset($record->assigned_to) ? $record->assigned_to : null) == $id ? 'selected' : '' }}>{{ $name }}</option>
                                    @endforeach
                                </select>
                            </form>
                        @endif
                    </td>
                    <td>
                        <form action="{{ route($Route . '.updateStatus', $record->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <select name="status" class="form-select" onchange="this.form.submit()">
                                @foreach(['pending', 'inProgress', 'delivered', 'cancelled'] as $status)
                                    <option value="{{ $status }}" {{ $record->status === $status ? 'selected' : '' }}>
                                        {{ ucfirst($status) }}
                                    </option>
                                @endforeach
                            </select>
                        </form>
                    </td>
                    <td>
                       {{ $record->payment_method ?? 'N/A' }}
                    </td>
                    <td>
                        <form action="{{ route($Route . '.updateRefundStatus', $record->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <select name="refundStatus" class="form-select" onchange="this.form.submit()">
                                @foreach(['none', 'refunded'] as $refundStatus)
                                    <option value="{{ $refundStatus }}" {{ $record->refund_status === $refundStatus ? 'selected' : '' }}>
                                        {{ ucfirst($refundStatus) }}
                                    </option>
                                @endforeach
                            </select>
                        </form>
                    </td>
                    <td>
                        @include('/components/address-popout', [
                        'addresses' => [$record->address]
                    ])
                    </td>

                    <td>
                        <a href="{{ route($Route . '.show', $record->id) }}"><i class="fas fa-eye"></i> View</a>
                    </td>
                </tr>
            @endforeach
        </x-slot>
    </x-management-table>
@endsection
