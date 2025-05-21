@extends('admin.layout.master')

@section('title', 'Service Request Management')
@section('ServiceRequests_Show', 'active')

@section('content')
    <x-management-table
        title="Service Request Management"
        :headers="['#', 'Customer Name', 'Service Name', 'Assign To Expert','Status', 'Managed By Employee','Address', 'Action']"
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
                        <a href="{{ route('dashboard.customer.index', ['search' => $serviceRequest->customer->email]) }}">
                            {{ $serviceRequest->customer?->first_name }} {{ $serviceRequest->customer?->last_name }}
                        </a>
                    </td>

                    {{-- Service Name --}}
                    <td>
                        <a href="{{ route('dashboard.service', ['search' => $serviceRequest->service?->name_en]) }}">
                            {{ $serviceRequest->service?->name_en }}
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
                                <option value="inProgress">In Progress</option>
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
                            'addresses' => [$serviceRequest->address]
                        ])
                    </td>

                    {{-- Actions --}}
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $serviceRequest->id) }}"><i class="fas fa-eye"></i> View</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
