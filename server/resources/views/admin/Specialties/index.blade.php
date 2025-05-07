@extends('admin.layout.master')

@section('title', 'Specialties Management')
@section('Specialties_Show', 'active')

@section('content')
    <x-management-table
        title="Specialties Management"
        :headers="[
            '#', 'Name (AR)', 'Assigned Count', 'Actions'
        ]"
        :items="$specialties"
        :Route="'dashboard.specialties'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.specialties')
            @foreach ($specialties as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name_ar }}</td>
                    <td>
                        <x-expert-popout
                            :experts="$item->expert"
                            :specialty-id="$item->id"
                            title="Experts with {{ $item->name_ar }} Specialty"
                        />
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route($Route . '.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this specialty?');">
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
