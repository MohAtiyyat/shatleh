@extends('admin.layout.master')

@section('title', 'Logs Management')
@section('Logs_Show', 'active')

@section('content')
<div class="container-fluid">
    <div class="card shadow-sm">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">System Logs</h5>

                <!-- Filter dropdown could be added here -->
                <div class="dropdown">
                    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="logTypeFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ request()->has('type') ? ucfirst(request()->input('type')) : 'All Types' }}
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="logTypeFilter">
                        <a class="dropdown-item" href="{{ route('dashboard.logs.customer') }}">All Types</a>
                        <a class="dropdown-item" href="{{ route('dashboard.logs.customer', ['type' => 'info', 'search' => request()->input('search')]) }}">Info</a>
                        <a class="dropdown-item" href="{{ route('dashboard.logs.customer', ['type' => 'warning', 'search' => request()->input('search')]) }}">Warning</a>
                        <a class="dropdown-item" href="{{ route('dashboard.logs.customer', ['type' => 'error', 'search' => request()->input('search')]) }}">Error</a>
                    </div>
                </div>
            </div>

            <!-- Improved search form -->
            <form action="{{ route('dashboard.logs.customer') }}" method="GET">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-transparent border-right-0">
                            <i class="fa fa-search text-muted"></i>
                        </span>
                    </div>
                    <input type="text" name="search" class="form-control border-left-0" placeholder="Search by user ID, name or action..." value="{{ request()->input('search') }}">
                    @if(request()->has('type'))
                    <input type="hidden" name="type" value="{{ request()->input('type') }}">
                    @endif
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-primary">Search</button>
                        @if(request()->has('search') || request()->has('type'))
                        <a href="{{ route('dashboard.logs.customer') }}" class="btn btn-outline-secondary">Clear</a>
                        @endif
                    </div>
                </div>
            </form>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th width="5%">ID</th>
                            <th width="25%">User</th>
                            <th width="40%">Action</th>
                            <th width="10%">Type</th>
                            <th width="20%">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($logs as $log)
                            <tr>
                                <td>{{ $log->id }}</td>
                                <td>
                                    @if($log->user)
                                        <span class="font-weight-bold">{{ $log->user->id }}</span> -
                                        {{ $log->user->first_name }} {{ $log->user->last_name }}
                                    @else
                                        <span class="text-muted">N/A</span>
                                    @endif
                                </td>
                                <td>{{ $log->action }}</td>
                                <td>
                                    <span class="badge badge-{{ $log->log_type == 'error' ? 'danger' : ($log->log_type == 'warning' ? 'warning' : 'info') }} badge-pill">
                                        {{ ucfirst($log->log_type) }}
                                    </span>
                                </td>
                                <td>{{ $log->created_at->format('Y-m-d H:i:s') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center py-4">
                                    <div class="empty-state">
                                        <i class="fa fa-search fa-3x text-muted mb-3"></i>
                                        <p>No logs found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($logs->hasPages())
        <div class="">
            <div class="d-flex justify-content-center">
                {{ $logs->appends(request()->query())->links() }}
            </div>
        </div>
        @endif
    </div>
</div>
@endsection

@section('css')
<link rel="stylesheet" href="{{ asset('assets/customCss/table.css') }}">

@endsection

@section('scripts')
<script>
    $(document).ready(function() {
        // Add focus to search input when page loads if there's a search query
        @if(request()->has('search'))
            $('input[name="search"]').focus();
        @endif
    });
</script>
@endsection
