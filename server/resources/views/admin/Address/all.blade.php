@extends('admin.layout.master')

@section('title', 'Address Management')
@section('Addresses_Show', 'active')

@section('content')
    <x-management-table
        title="Address Management"
        :headers="[
            '#', 'Title', 'Country', 'City', 'Address Line', 'User','Shop', 'Updated', 'Actions'
        ]"
        :items="$addresses"
        :Route="'dashboard.Address'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.Address')
            @foreach ($addresses as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->title ?? 'N/A' }}</td>
                    <td>{{ $item->country->name_en ?? 'N/A' }}</td>
                    <td>{{ $item->city ?? 'N/A' }}</td>
                    <td>{{ $item->address_line ?? 'N/A' }}</td>
                    <td>{{ ($item->user->first_name ?? '') . ' ' . ($item->user->last_name ?? '') ?: 'N/A' }}</td>
                    <td>{{ ($item->shop->name_en ?? '') . ' ' . ($item->shop->name_ar ?? '') ?: 'N/A' }}</td>
                    <td>{{ $item->updated_at ? \Carbon\Carbon::parse($item->updated_at)->toDateString() : 'N/A' }}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $item->id) }}"><i class="fas fa-eye"></i> View</a></li>
                                <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route($Route . '.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Are you sure?');">
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
        </x-slot:rows>
    </x-management-table>
@endsection
