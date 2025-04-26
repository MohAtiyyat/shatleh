@extends('admin.layout.master')

@section('title', 'Shop Management')
@section('Shops_Show', 'active')

@section('content')
    <x-management-table
        title="Shop Management"
        :headers="[
            '#', 'Shop Name', 'Partner', 'added By', 'Address', 'Actions'
        ]"
        :items="$shops"
        :Route="'dashboard.shop'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.shop')
            @foreach ($shops as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <!-- <td>
                        <img src="{{ $item->image ?? 'https://placehold.co/60x60' }}"
                             alt="Shop Image"
                             class="img-thumbnail"
                             style="width: 60px; height: 60px; object-fit: cover;">
                    </td> -->
                    <td>{{ $item->name ?? 'N/A' }}</td>
                    <!-- <td>{{ $item->details ?? 'N/A' }}</td>
                    <td>{{ $item->owner_name ?? 'N/A' }}</td>
                    <td>{{ $item->owner_phone_number ?? 'N/A' }}</td> -->
                    <td>{{ $item->is_partner ? 'Yes' : 'No' }}</td>
                    <td>{{ $item->employee->first_name . ' ' . $item->employee->last_name ?? 'N/A' }}</td>
                    <td><a href="{{ route('dashboard.address.show', $item->address->id) }}">{{ $item->address->city ?? 'N/A' }}</a></td>
                    <!-- <td>{{ $item->updated_at ? \Carbon\Carbon::parse($item->updated_at)->toDateString() : 'N/A' }}</td> -->
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
