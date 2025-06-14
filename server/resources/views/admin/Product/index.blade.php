@extends('admin.layout.master')

@section('title', 'Product Management')
@section('Products_Show', 'active')

@section('content')
    <x-management-table
        title="Product Management"
        :headers="[
            '#', 'Name (AR)', 'Price', 'Status', 'Availability', 'Sold Quantity', 'Actions'
        ]"
        :items="$products"
        :Route="'dashboard.product'"
        :createRoles="'Admin|Employee'"
        :unsortableColumns="[1,6]"
    >
    <x-slot name="rows">
        @foreach ($products as $product)
            <tr>
                <td>{{ $product->id }}</td>
                <td>{{ $product->name_ar ?? 'N/A' }}</td>
                <td>${{ number_format($product->price, 2) }}</td>
                <!-- Status -->
                @php
                $statusClassMap = [
                    "active" => ['label' => 'Active', 'class' => 'status-badge status-active'],
                    "inactive" => ['label' => 'Unactive', 'class' => 'status-badge status-inactive'],
                    "draft" => ['label' => 'Draft', 'class' => 'status-badge status-draft'],
                ];
                $status = $statusClassMap[$product->status] ?? ['label' => 'Unknown', 'class' => 'status-badge'];
                @endphp
                <td><span class="{{ $status['class'] }}">{{ $status['label'] }}</span></td>

                <!-- Availability -->
                @php
                $availabilityClassMap = [
                    1 => ['label' => 'In Stock', 'class' => 'status-badge status-stock'],
                    0 => ['label' => 'Out of Stock', 'class' => 'status-badge status-out'],
                    2 => ['label' => 'Pre Order', 'class' => 'status-badge status-preorder'],
                ];
                $availability = $availabilityClassMap[$product->availability] ?? ['label' => 'Unknown', 'class' => 'status-badge'];
                @endphp
                <td><span class="{{ $availability['class'] }}">{{ $availability['label'] }}</span></td>

                <td>{{ $product->sold_quantity ?? 0 }}</td>
                <td>
                    @if (auth()->user()->hasRole('Admin'))
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="{{ route('dashboard.product.show', $product->id) }}"><i class="fas fa-eye"></i> View</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.product.edit', $product->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <form action="{{ route('dashboard.product.destroy', $product->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this product?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                    @else
                    <a href="{{ route('dashboard.product.show', $product->id) }}"><i class="fas fa-eye"></i> View</a>
                    @endif

                </td>
            </tr>
        @endforeach
    </x-slot>
    </x-management-table>
@endsection
