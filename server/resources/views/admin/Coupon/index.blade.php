@extends('admin.layout.master')

@section('title', 'Coupons Management')
@section('Coupon_Show', 'active')

@section('content')
    <x-management-table
        title="Coupons Management"
        :headers="[
            '#', 'Amount', 'Code', 'Title', 'Is Active', 'Expiry Date', 'Quantity', 'Countries', 'Used Count', 'Actions'
        ]"
        :items="$coupons"
        :Route="'dashboard.coupon'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.coupon')
            @foreach ($coupons as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>%{{ $item->amount }}</td>
                    <td>{{ $item->code }}</td>
                    <td>{{ $item->title }}</td>
                    <td>{{ $item->is_active ? 'Yes' : 'No' }}</td>
                    <td>{{ $item->expire_date }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>
                        <x-country-popout
                            :countries="[$item->country]"
                            :coupon-id="$item->id"
                            title="Country for {{ $item->title }} Coupon"
                        />
                    </td>
                    <td>{{ $item->used_count ?? 0 }}</td>
                    <td>
                        @if(auth()->user()->hasAnyRole('Admin'))
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route($Route . '.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this coupon?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                        @endif
                    </td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
