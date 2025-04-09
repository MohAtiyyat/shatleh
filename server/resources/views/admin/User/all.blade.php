@extends('admin.layout.master')

@section('title', 'User Management')
@section('Customers_Show')
    active
@endsection
@section('content')
    <x-management-table
        title="User Management"
        :headers="['#', 'Name', 'Email', 'Last Login', 'Actions']"
        :items="[
            [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'john@example.com',


                'last_login' => '2025-04-08',
                'actions' => true
            ],
            [
                'id' => 2,
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',


                'last_login' => '2025-04-07',
                'actions' => true
            ]
        ]"
        add-route="/users/create"
        view-route-prefix="/users"
    />
@endsection
