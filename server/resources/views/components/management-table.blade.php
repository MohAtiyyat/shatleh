@props(['title' => 'Management Table', 'headers' => [], 'items' => [], 'addRoute' => '#', 'viewRoutePrefix' => '#'])

<div class="container-fluid">
    <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $title }}</h5>
        </div>
        <div class="flex header-actions w-full p-3">
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
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/customCss/table.css') }}">

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
                data: @json($items),
                columns: [
                    { data: 'id', render: function(data) { return data ?? 'N/A'; } },
                    {
                        data: 'image',
                        render: function(data) {
                            return '<img src="' + (data || 'https://via.placeholder.com/75') +
                                   '" alt="Product Image" class="img-thumbnail" style="width: 60px; height: 60px;">';
                        }
                    },
                    { data: 'name_en', render: function(data) { return data ?? 'N/A'; } },
                    { data: 'name_ar', render: function(data) { return data ?? 'N/A'; } },
                    {
                        data: 'price',
                        render: function(data) {
                            return isNaN(data) || data === null ? 'N/A' : '$' + parseFloat(data).toFixed(2);
                        }
                    },
                    {
                        data: 'status',
                        render: function(data) {
                            var className = data === 'Active' ? 'status-active' : 'status-inactive';
                            return '<span class="status-badge ' + className + '">' + (data ?? 'N/A') + '</span>';
                        }
                    },
                    {
                        data: 'availability',
                        render: function(data) {
                            var className = data === 'In Stock' ? 'status-stock' : 'status-inactive';
                            return '<span class="status-badge ' + className + '">' + (data ?? 'N/A') + '</span>';
                        }
                    },
                    { data: 'description_en', render: function(data) { return data ?? 'No description available'; } },
                    { data: 'description_ar', render: function(data) { return data ?? 'No description available'; } },
                    {
                        data: 'updated_at',
                        render: function(data) {
                            return data ? new Date(data).toISOString().split('T')[0] : 'N/A';
                        }
                    },
                    {
                        data: 'id',
                        render: function(data) {
                            return `
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="{{ $viewRoutePrefix }}/${data}"><i class="fas fa-eye"></i> View</a></li>
                                        <li><a class="dropdown-item" href="{{ $viewRoutePrefix }}/${data}/edit"><i class="fas fa-edit"></i> Edit</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item text-danger" href="#"><i class="fas fa-trash"></i> Delete</a></li>
                                    </ul>
                                </div>
                            `;
                        }
                    }
                ],
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
