@extends('admin.layout.master')

@section('title', 'Service Management')
@section('Services_Show', 'active')

@section('content')
    <x-management-table
        title="Service Management"
        :headers="[
            '#', 'Name (AR)', 'Status', 'Requested Times', 'Actions'
        ]"
        :items="$services"
        :Route="'dashboard.service'"
        :createRoles="'Admin|Employee'"
    >
    <x-slot name="rows">
        @foreach ($services as $service)
            <tr>
                <td>{{ $service->id }}</td>
                <td>{{ $service->name_ar ?? 'N/A' }}</td>
                <!-- Status -->
                @php
                $statusClassMap = [
                    1 => ['label' => 'Active', 'class' => 'status-badge status-active'],
                    0 => ['label' => 'Unactive', 'class' => 'status-badge status-inactive'],
                ];
                $status = $statusClassMap[$service->status] ?? ['label' => 'Unknown', 'class' => 'status-badge'];
                @endphp
                <td><span class="{{ $status['class'] }}">{{ $status['label'] }}</span></td>
                <td>{{ $requested_time[$service->id] ?? 0 }}</td>
                <td>
                    @if(auth()->user()->hasAnyRole('Admin|Employee'))
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="{{ route('dashboard.service.show', $service->id) }}"><i class="fas fa-eye"></i> View</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.service.edit', $service->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <form action="{{ route('dashboard.service.destroy', $service->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this service?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                    @else
                        <a href="{{ route('dashboard.service.show', $service->id) }}"><i class="fas fa-eye"></i> View</a>
                    @endif
                </td>
            </tr>
        @endforeach
    </x-slot>
    </x-management-table>
@endsection
