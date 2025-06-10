@extends('admin.layout.master')

@section('title', 'Customer Management')
@section('Customers_Show', 'active')

@section('content')
    <x-management-table
        title="Customer Management"
        :headers="[
            '#', 'Full Name', 'Email', 'Phone', 'Banned', 'Actions'
        ]"
        :items="$customers"
        :Route="'dashboard.customer'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.customer')
            @foreach ($customers as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->first_name }} {{ $item->last_name }}</td>
                    <td>{{ $item->email }}</td>
                    <td>{{ $item->phone_number }}</td>
                    <td>
                        <form action="{{ route($Route . '.toggleBan', $item->id) }}" method="POST">
                            @csrf
                            @method('PATCH')
                            <label class="switch">
                                <input type="checkbox" onchange="this.form.submit()" {{ $item->is_banned ? 'checked' : '' }} class="form-check-input">
                                <span class="slider round"></span>
                            </label>
                        </form>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $item->id) }}"><i class="fas fa-eye"></i> View</a></li>
                                @if(auth()->user()->hasRole('Admin'))
                                <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                @endif
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route($Route . '.resetPassword', $item->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to reset this customer\'s password?');">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" class="dropdown-item text-warning"><i class="fas fa-key"></i> Reset Password</button>
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
