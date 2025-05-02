@extends('admin.layout.master')

@section('title', 'Order Management')
@section('Order_Show', 'active')

@section('content')
    <x-management-table
        title="Order Management"
        :headers="[
            '#', 'Customer Name', 'Managed By', 'Recipient Name', 'Recipient Phone', 'Status', 'Payment Info', 'Address', 'Actions'
        ]"
        :items="$order"
        :Route="'dashboard.order'"
    >
        <x-slot name="rows">
            @php($Route = 'dashboard.order')
            @foreach ($order as $record)
                <tr>
                    <td>{{ $record->id }}</td>
                    <td>{{ $record->customer->user->first_name ?? '' }} {{ $record->customer->user->last_name ?? '' }}</td>
                    <td>
                        {{ $record->employee ? $record->employee->first_name . ' ' . $record->employee->last_name : 'N/A' }}
                    </td>
                    <td>{{ $record->first_name ?? 'N/A' }} {{ $record->last_name ?? '' }}</td>
                    <td>{{ $record->phone_number ?? 'N/A' }}</td>
                    <td>
                        <form action="{{ route($Route . '.updateStatus', $record->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <select name="status" class="form-select" onchange="this.form.submit()">
                                @foreach(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as $status)
                                    <option value="{{ $status }}" {{ $record->status === $status ? 'selected' : '' }}>
                                        {{ ucfirst($status) }}
                                    </option>
                                @endforeach
                            </select>
                        </form>
                    </td>
                    <td>
                        @if ($record->payment)
                            @include('admin.Order.payment-popout', ['payment' => $record->payment])
                        @endif
                    </td>
                    <td>
                        @include('/components/address-popout', [
                        'addresses' => [$record->address]
                    ])
                    </td>

                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $record->id) }}"><i class="fas fa-eye"></i> View</a></li>
                                {{-- <li><a class="dropdown-item" href="{{ route($Route . '.edit', $record->id) }}"><i class="fas fa-edit"></i> Edit</a></li> --}}
                            </ul>
                        </div>
                    </td>
                </tr>
            @endforeach
        </x-slot>
    </x-management-table>
@endsection
