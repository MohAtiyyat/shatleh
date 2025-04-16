@props(['title' => 'Management Table', 'headers' => [], 'items' => [], 'addRoute' => '#', 'viewRoutePrefix' => '#'])

<div class="container-fluid">
    <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $title }}</h5>
        </div>
        <div class="flex header-actions w-full">
            <div class="btn-group" id="export-tools">
                <!-- Export buttons will be inserted here by DataTables -->
            </div>
            <div class="ml-auto">
                <a href="{{ $addRoute }}" class="btn btn-primary">
                    <i class="fas fa-plus fa-sm mr-2"></i>Add New
                </a>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="managementTable" class="table table-hover">
                    <thead>
                        <tr>
                            @foreach ($headers as $header)
                                <th>{{ $header }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($items as $item)
                            <tr>
                                @foreach ($item as $key => $value)
                                    @if ($key === 'image')
                                        <td>
                                            <img src="{{ $value ?? 'https://via.placeholder.com/75' }}"
                                                alt="Item Image" class="img-thumbnail"
                                                style="width: 60px; height: 60px;">
                                        </td>
                                    @elseif ($key === 'status')
                                        <td>
                                            <span class="status-badge {{ $value === 'Active' ? 'status-active' : 'status-inactive' }}">
                                                {{ $value }}
                                            </span>
                                        </td>
                                    @elseif ($key === 'availability')
                                        <td>
                                            <span class="status-badge {{ $value === 'In Stock' ? 'status-stock' : 'status-inactive' }}">
                                                {{ $value }}
                                            </span>
                                        </td>
                                    @elseif ($key === 'actions')
                                        <td>
                                            <div class="dropdown">
                                                <button class="btn btn-sm btn-secondary dropdown-toggle" type="button"
                                                    data-toggle="dropdown" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="{{ $viewRoutePrefix }}/{{ $item['id'] }}"><i class="fas fa-eye"></i> View</a></li>
                                                    <li><a class="dropdown-item" href="{{ $viewRoutePrefix }}/{{ $item['id'] }}/edit"><i class="fas fa-edit"></i> Edit</a></li>
                                                    <li><hr class="dropdown-divider"></li>
                                                    <li><a class="dropdown-item text-danger" href="#"><i class="fas fa-trash"></i> Delete</a></li>
                                                </ul>
                                            </div>
                                        </td>
                                        @else
                                        @if ($key === 'address')
                                            <td>{!! $value !!}</td>
                                        @else
                                            <td>{{ $value }}</td>
                                        @endif
                                    @endif
                                @endforeach
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
    <style>
        /* Same CSS as in your original code, copied here for completeness */
        :root {
            --primary-color: #4e73df;
            --secondary-color: #f8f9fc;
            --accent-color: #e74a3b;
            --text-primary: #5a5c69;
            --text-secondary: #858796;
            --shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
            --border-radius: 0.35rem;
        }
        .card { border: none; border-radius: var(--border-radius); box-shadow: var(--shadow); margin-bottom: 1.5rem; }
        .card-header { background-color: #fff; border-bottom: 1px solid rgba(0, 0, 0, .05); padding: 1.25rem 1.5rem; }
        .card-header h5 { color: var(--text-primary); font-weight: 600; }
        .btn-primary { background-color: var(--primary-color); border-color: var(--primary-color); }
        .btn-danger { background-color: var(--accent-color); border-color: var(--accent-color); }
        .dropdown-toggle::after { display: none; }
        .dropdown-menu { box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15); border: none; border-radius: var(--border-radius); }
        .dropdown-item { padding: 0.5rem 1rem; font-size: 0.85rem; }
        .dropdown-item i { width: 1rem; text-align: center; margin-right: 0.5rem; }
        .table { color: var(--text-primary); margin-bottom: 0; }
        .table th { background-color: var(--secondary-color); border-bottom: none; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.03em; font-size: 0.8rem; padding: 0.75rem 1rem; vertical-align: middle; }
        .table td { vertical-align: middle; border-top: 1px solid rgba(0, 0, 0, .05); padding: 0.75rem 1rem; font-size: 0.875rem; }
        .table tbody tr:hover { background-color: rgba(78, 115, 223, 0.03); }
        .img-thumbnail { object-fit: cover; border-radius: var(--border-radius); box-shadow: 0 2px 5px rgba(0, 0, 0, .05); }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; }
        .status-active { background-color: rgba(28, 200, 138, 0.1); color: #1cc88a; }
        .status-inactive { background-color: rgba(231, 74, 59, 0.1); color: #e74a3b; }
        .status-stock { background-color: rgba(54, 185, 204, 0.1); color: #36b9cc; }
        .header-actions { display: flex; gap: 10px; }
        .dataTables_wrapper .dataTables_length, .dataTables_wrapper .dataTables_filter { margin-bottom: 0; }
        .dataTables_wrapper .dataTables_filter input { border: 1px solid rgba(0, 0, 0, .1); border-radius: var(--border-radius); padding: 0.375rem 0.75rem; }
        .pagination { margin: 1rem 0 0 0; }
        .page-item.active .page-link { background-color: var(--primary-color); border-color: var(--primary-color); }
        div.dataTables_wrapper div.dataTables_info { padding-top: 1rem; }
        .dataTables_wrapper { padding: 1rem; }
        .dataTables_wrapper .btn-group { margin-bottom: 1rem; }
        #export-tools { margin-bottom: 1rem; }
    </style>
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
        $(function() {
            $('#managementTable').DataTable({
                responsive: true,
                lengthChange: true,
                autoWidth: false,
                pageLength: 10,
                order: [[0, 'asc']],
                dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
                buttons: [
                    { extend: 'copy', className: 'btn-sm btn-primary', text: '<i class="fas fa-copy mr-1"></i>Copy' },
                    { extend: 'csv', className: 'btn-sm btn-primary', text: '<i class="fas fa-file-csv mr-1"></i>CSV' },
                    { extend: 'excel', className: 'btn-sm btn-primary', text: '<i class="fas fa-file-excel mr-1"></i>Excel' },
                    { extend: 'pdf', className: 'btn-sm btn-primary', text: '<i class="fas fa-file-pdf mr-1"></i>PDF' },
                    { extend: 'print', className: 'btn-sm btn-primary', text: '<i class="fas fa-print mr-1"></i>Print' }
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
                initComplete: function() {
                    this.api().buttons().container().appendTo('#export-tools');
                    setTimeout(function() {
                        $('#export-tools .btn').removeClass('dt-button');
                        $('#export-tools .btn-group').addClass('mr-2');
                        $('#export-tools .btn').addClass('mr-1');
                        $('#export-tools').css('display', 'inline-flex');
                    }, 0);
                }
            });
        });
    </script>
@endsection
