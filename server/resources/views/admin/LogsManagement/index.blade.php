@extends('admin.layout.master')

@section('title', 'Logs Management')
@section('Logs_Show', 'active')

@section('content')
<div class="dashboard-cards-container my-5">
    <a href="{{ route('dashboard.logs.customer') }}" class="dashboard-card customer-card">
        <div class="card-icon">
            <ion-icon name="people-circle-outline"></ion-icon>
        </div>
        <h3 class="card-title">Customer Logs</h3>
    </a>

    <a href="{{ route('dashboard.logs.staff') }}" class="dashboard-card staff-card">
        <div class="card-icon">
            <ion-icon name="briefcase-outline"></ion-icon>
        </div>
        <h3 class="card-title">Staff Logs</h3>
    </a>
</div>

@endsection
@section('css')
    <link rel="stylesheet" href="{{ asset('assets/customCss/log_index.css') }}">
@endsection
