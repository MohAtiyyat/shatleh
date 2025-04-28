@extends('admin.layout.master')

@section('title', 'Service Request Management')
@section('ServiceRequests_Show', 'active')

@section('content')
    <x-management-table
        title="Service Request Management"
        :headers="['#', 'Customer Name', 'Assign To Expert','Status', 'Managed By Employee','Address']"
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

                    {{-- Status --}}
                    <td>
                        <form method="POST" action="{{ route($Route . '.update', $serviceRequest->id) }}">
                            @csrf
                            @method('PATCH')
                            <select name="status" onchange="this.form.submit()" class="form-select">
                                <option value="{{ $serviceRequest->status }}">{{ $serviceRequest->status }}</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </form>
                    </td>

                    {{-- Managed By Employee --}}
                    <td>
                        <a href="{{ route('dashboard.staff', ['search' => $serviceRequest->employee?->email]) }}">
                            {{ $serviceRequest->employee?->first_name }} {{ $serviceRequest->employee?->last_name }}
                        </a>
                    </td>

                    {{--Address--}}
                    <td>
                        @include('/components/address-popout', [
                    'address' => [
                        'id' => $serviceRequest->address->id,
                        'title' => $serviceRequest->address->city,
                        'country' => $serviceRequest->address->country ?? 'N/A',
                        'city' => $serviceRequest->address->city ?? 'N/A',
                        'address_line' => $serviceRequest->address->address_line ?? 'N/A'
                    ]
                ])
                    </td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
