@extends('admin.layout.master')

@section('title', 'Product Shop Management')
@section('ProductShop_Show', 'active')

@section('content')
    <x-management-table
        title="Product Shop Management"
        :headers="[
            '#', 'Product Name', 'Shop Name', 'Cost', 'Added By', 'Created At', 'Updated At', 'Actions'
        ]"
        :items="$records"
        :Route="'dashboard.productShop'"
    >
    <x-slot name="rows">
        @foreach ($records as $record)
            <tr>
                <td>{{ $record->id }}</td>
                <td><a href="{{ route('dashboard.product.show', $record->product_id) }}">{{ $record->product_name ?? 'N/A' }}</a></td>
                <td><a href="{{ route('dashboard.shop.show', $record->shop_id) }}">{{ $record->shop_name ?? 'N/A' }}</a></td>
                <td>JOD{{ number_format($record->cost, 2) }}</td>
                <td>{{ $record->employee_name ?? 'N/A' }}</td>
                <td>{{ \Carbon\Carbon::parse($record->created_at)->toDateString() }}</td>
                <td>{{ \Carbon\Carbon::parse($record->updated_at)->toDateString() }}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="{{ route('dashboard.productShop.show', $record->id) }}"><i class="fas fa-eye"></i> View</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.productShop.edit', $record->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <form action="{{ route('dashboard.productShop.destroy', $record->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this product shop record?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        @endforeach
    </x-slot>
    </x-management-table>
@endsection
