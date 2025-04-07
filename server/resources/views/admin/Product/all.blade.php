@extends('admin.layout.master')

@section('title')
    Product Management
@endsection

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
    <style>
        :root {
            --primary-color: #4e73df;
            --secondary-color: #f8f9fc;
            --accent-color: #e74a3b;
            --text-primary: #5a5c69;
            --text-secondary: #858796;
            --shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
            --border-radius: 0.35rem;
        }

        .card {
            border: none;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            margin-bottom: 1.5rem;
        }

        .card-header {
            background-color: #fff;
            border-bottom: 1px solid rgba(0,0,0,.05);
            padding: 1.25rem 1.5rem;
        }

        .card-header h5 {
            color: var(--text-primary);
            font-weight: 600;
        }

        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .btn-success {
            background-color: #1cc88a;
            border-color: #1cc88a;
        }

        .btn-danger {
            background-color: var(--accent-color);
            border-color: var(--accent-color);
        }

        .dropdown-toggle::after {
            display: none;
        }

        .dropdown-menu {
            box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
            border: none;
            border-radius: var(--border-radius);
        }

        .dropdown-item {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
        }

        .dropdown-item i {
            width: 1rem;
            text-align: center;
            margin-right: 0.5rem;
        }

        .table {
            color: var(--text-primary);
            margin-bottom: 0;
        }

        .table th {
            background-color: var(--secondary-color);
            border-bottom: none;
            color: var(--text-secondary);
            font-weight: 600;
            letter-spacing: 0.03em;
            font-size: 0.8rem;
            padding: 0.75rem 1rem;
            vertical-align: middle;
        }

        .table td {
            vertical-align: middle;
            border-top: 1px solid rgba(0,0,0,.05);
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
        }

        .table tbody tr:hover {
            background-color: rgba(78, 115, 223, 0.03);
        }

        .description-cell {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .img-thumbnail {
            object-fit: cover;
            border-radius: var(--border-radius);
            box-shadow: 0 2px 5px rgba(0,0,0,.05);
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-active {
            background-color: rgba(28, 200, 138, 0.1);
            color: #1cc88a;
        }

        .status-inactive {
            background-color: rgba(231, 74, 59, 0.1);
            color: #e74a3b;
        }

        .status-stock {
            background-color: rgba(54, 185, 204, 0.1);
            color: #36b9cc;
        }

        .header-actions {
            display: flex;
            gap: 10px;
        }

        /* DataTables customizations */
        .dataTables_wrapper .dataTables_length,
        .dataTables_wrapper .dataTables_filter {
            margin-bottom: 0;
        }

        .dataTables_wrapper .dataTables_filter input {
            border: 1px solid rgba(0,0,0,.1);
            border-radius: var(--border-radius);
            padding: 0.375rem 0.75rem;
        }

        .pagination {
            margin: 1rem 0 0 0;
        }

        .page-item.active .page-link {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        div.dataTables_wrapper div.dataTables_info {
            padding-top: 1rem;
        }

        .dataTables_wrapper {
            padding: 1rem;
        }

        .dataTables_wrapper .btn-group {
            margin-bottom: 1rem;
        }

        #export-tools {
            margin-bottom: 1rem;
        }
    </style>
@endsection

@section('productsShow')
    active
@endsection

@section('title_page1')
    Dashboard
@endsection

@section('title_page2')
    Products
@endsection

@section('content')
    <div class="container-fluid">
        <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Product Management</h5>
                <div class="header-actions">
                    <div class="btn-group" id="export-tools">
                        <!-- Export buttons will be inserted here by DataTables -->
                    </div>
                    <a href="#" class="btn btn-primary">
                        <i class="fas fa-plus fa-sm mr-2"></i>Add Product
                    </a>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="productTable" class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Availability</th>
                                <th>Description</th>
                                <th>Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>
                                    <img src="https://via.placeholder.com/75" alt="Product Image"
                                         class="img-thumbnail" style="width: 60px; height: 60px;">
                                </td>
                                <td>
                                    <div>Sample Product</div>
                                    <small class="text-muted">منتج عينة</small>
                                </td>
                                <td>
                                    <span class="font-weight-bold">$19.99</span>
                                </td>
                                <td>
                                    <span class="status-badge status-active">Active</span>
                                </td>
                                <td>
                                    <span class="status-badge status-stock">In Stock</span>
                                </td>
                                <td class="description-cell">Short description in English. This product is designed to demonstrate the features of our system.</td>
                                <td>
                                    <div>2025-04-05</div>
                                    <small class="text-muted">15:30</small>
                                </td>
                                <td>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <li><a class="dropdown-item" href="{{ url('/admin/products/1') }}"><i class="fas fa-eye"></i> View</a></li>
                                            <li><a class="dropdown-item" href="{{ url('/admin/products/1/edit') }}"><i class="fas fa-edit"></i> Edit</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#"><i class="fas fa-trash"></i> Delete</a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>
                                    <img src="https://via.placeholder.com/75/cccccc" alt="Product Image"
                                         class="img-thumbnail" style="width: 60px; height: 60px;">
                                </td>
                                <td>
                                    <div>Premium Item</div>
                                    <small class="text-muted">منتج متميز</small>
                                </td>
                                <td>
                                    <span class="font-weight-bold">$49.99</span>
                                </td>
                                <td>
                                    <span class="status-badge status-inactive">Inactive</span>
                                </td>
                                <td>
                                    <span class="status-badge status-inactive">Out of Stock</span>
                                </td>
                                <td class="description-cell">This is our premium offering with exclusive features for discerning customers.</td>
                                <td>
                                    <div>2025-04-02</div>
                                    <small class="text-muted">09:15</small>
                                </td>
                                <td>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                            <li><a class="dropdown-item" href="{{ url('/admin/products/2') }}"><i class="fas fa-eye"></i> View</a></li>
                                            <li><a class="dropdown-item" href="{{ url('/admin/products/2/edit') }}"><i class="fas fa-edit"></i> Edit</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li><a class="dropdown-item text-danger" href="#"><i class="fas fa-trash"></i> Delete</a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script src="{{ asset('assets/plugins/datatables/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-buttons/js/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/jszip/jszip.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/pdfmake/pdfmake.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/pdfmake/vfs_fonts.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.html5.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.print.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.colVis.min.js') }}"></script>

    <script>
        $(function () {
            $('#productTable').DataTable({
                responsive: true,
                lengthChange: true,
                autoWidth: false,
                pageLength: 10,
                order: [[0, 'asc']],
                dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
                buttons: [
                    { extend: 'copy', className: 'btn-sm btn-outline-secondary' },
                    { extend: 'excel', className: 'btn-sm btn-outline-secondary' },
                    { extend: 'pdf', className: 'btn-sm btn-outline-secondary' },
                    { extend: 'print', className: 'btn-sm btn-outline-secondary' }
                ],
                language: {
                    search: "Search:",
                    lengthMenu: "_MENU_ records per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    paginate: {
                        first: '<i class="fas fa-angle-double-left"></i>',
                        last: '<i class="fas fa-angle-double-right"></i>',
                        previous: '<i class="fas fa-angle-left"></i>',
                        next: '<i class="fas fa-angle-right"></i>'
                    }
                },
                initComplete: function () {
                    this.api().buttons().container().appendTo('#export-tools');
                }
            });
        });
    </script>
@endsection
