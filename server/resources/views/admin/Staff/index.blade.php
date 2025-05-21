@extends('admin.layout.master')

@section('title', 'Staff Management')
@section('Staff_Show', 'active')

@section('content')
    <x-management-table
        title="Staff Management"
        :headers="[
            '#', 'Name', 'Email', 'Phone', 'Role','spacility', 'Address','Banned', 'Actions'
        ]"
        :items="$records"
        :Route="'dashboard.staff'"
    >
    <x-slot name="rows">
        @php($Route = 'dashboard.staff')
        @foreach ($records as $record)
            <tr>
                <td>{{ $record->id }}</td>
                <td>{{ $record->first_name .' '. $record->last_name ?? 'N/A' }}</td>
                <td>{{ $record->email ?? 'N/A' }}</td>
                <td>{{ $record->phone_number ?? 'N/A' }}</td>
                <td>{{ $record->roles->pluck('name')[0] ?? 'N/A' }}</td>
                <td>
                    @include('admin.Staff.specialty-popout', [
                        'specialties' => $record->specialties,
                        'recordId' => $record->id
                    ])
                </td>
                <td>
                    @include('/components/address-popout', [
                        'addresses' => $record->addresses
                    ])
                </td>
                <td>
                    <form action="{{ route($Route . '.toggleBan', $record->id) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <label class="switch">
                            <input type="checkbox" 
                            @if(!auth()->user()->hasRole('Admin'))
                                disabled
                            @endif
                             onchange="this.form.submit()" {{ $record->is_banned ? 'checked' : '' }} class="form-check-input">
                            <span class="slider round"></span>
                        </label>
                    </form>
                </td>
                <td>
                    @if(auth()->user()->hasRole('Admin'))
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="{{ route('dashboard.staff.show', $record->id) }}"><i class="fas fa-eye"></i> View</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.staff.edit', $record->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <form action="{{ route('dashboard.staff.resetPassword', $record->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to reset this staff password?');">
                                    @csrf
                                    @method('POST')
                                    <button type="submit" class="dropdown-item text-danger"><i class="refresh-circle-outline"></i> Reset Password</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                    @else
                        <a  href="{{ route('dashboard.staff.show', $record->id) }}"><i class="fas fa-eye"></i> View</a>
                    @endif
                </td>
            </tr>
        @endforeach
    </x-slot>
    </x-management-table>
@endsection
