@extends('admin.layout.master')

@section('title', 'Service Request Management')
@section('ServiceRequests_Show', 'active')

@section('content')
    <x-management-table
        title="Service Request Management"
        :headers="['#', 'Customer Name', 'Assign To Expert', 'Managed By Employee', 'Actions']"
        :items="$serviceRequests"
        :Route="'dashboard.service-request'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.service-request')

            @foreach ($serviceRequests as $serviceRequest)
                <tr>
                    {{-- ID --}}
                    <td id={{$serviceRequest->id}}>{{ $serviceRequest->id }}</td>

                    {{-- Customer Name --}}
                    <td>
                        <a href="{{ route('dashboard.customer.index', ['search' => $serviceRequest->customer->user->email]) }}">
                            {{ $serviceRequest->customer?->user?->first_name }} {{ $serviceRequest->customer?->user?->last_name }}
                        </a>
                    </td>

                    {{-- Assign to Expert --}}
                    <td>
                        @if ($serviceRequest->expert)
                            {{ $serviceRequest->expert->first_name }} {{ $serviceRequest->expert->last_name }}
                        @else
                            <form method="POST" action="{{ route($Route . '.assign', $serviceRequest->id) }}">
                                @csrf
                                <select name="expert_id" onchange="this.form.submit()" class="form-select">
                                    <option value="">Select Expert</option>
                                    @foreach($experts as $id => $name)
                                        <option value="{{ $id }}">{{ $name }}</option>
                                    @endforeach
                                </select>
                            </form>
                        @endif
                    </td>

                    {{-- Managed By Employee --}}
                    <td>
                        {{ $serviceRequest->employee?->first_name }} {{ $serviceRequest->employee?->last_name }}
                    </td>

                    {{-- Actions --}}
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="{{ route($Route . '.show', $serviceRequest->id) }}">
                                        <i class="fas fa-eye"></i> View
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="{{ route($Route . '.edit', $serviceRequest->id) }}">
                                        <i class="fas fa-edit"></i> Edit
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route($Route . '.destroy', $serviceRequest->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this service request?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="dropdown-item text-danger">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
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
