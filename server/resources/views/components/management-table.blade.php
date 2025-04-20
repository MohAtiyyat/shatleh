@props([
    'title' => 'Management Table',
    'headers' => [],
    'items' => [],
    'Route' => '#',
])

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
                <a href="{{ route($Route . '.create') }}" class="btn btn-primary">
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
                                <td>{{ $item['id'] ?? 'N/A' }}</td>
                                <td>
                                    <img src="{{ $item['image'] ? asset('storage/image/' . $item['image']) : 'https://placehold.co/75' }}"
                                         alt="Product Image"
                                         class="img-thumbnail"
                                         style="width: 60px; height: 60px;">
                                </td>
                                <td>{{ $item['name_en'] ?? 'N/A' }}</td>
                                <td>{{ $item['name_ar'] ?? 'N/A' }}</td>
                                <td>
                                    {{ is_numeric($item['price']) ? '$' . number_format($item['price'], 2) : 'N/A' }}
                                </td>
                                <td>
                                    @php
                                        $statusMap = [
                                            '1' => 'Active',
                                            '0' => 'Inactive',
                                            '2' => 'Draft'
                                        ];
                                        $status = $statusMap[$item['status'] ?? ''] ?? 'N/A';
                                        $statusClass = $status === 'Active' ? 'status-active' : 'status-inactive';
                                    @endphp
                                    <span class="status-badge {{ $statusClass }}">{{ $status }}</span>
                                </td>
                                <td>
                                    @php
                                        $availabilityMap = [
                                            '1' => 'In Stock',
                                            '0' => 'Out of Stock',
                                            '2' => 'Pre-order'
                                        ];
                                        $availability = $availabilityMap[$item['availability'] ?? ''] ?? 'N/A';
                                        $availabilityClass = $availability === 'In Stock' ? 'status-stock' : 'status-inactive';
                                    @endphp
                                    <span class="status-badge {{ $availabilityClass }}">{{ $availability }}</span>
                                </td>
                                <td style="width: 140px; overflow: auto;">
                                    {{ $item['description_en'] ? Str::limit($item['description_en'], 50) : 'No description available' }}
                                </td>
                                <td style="width: 140px; overflow: auto;">
                                    {{ $item['description_ar'] ? Str::limit($item['description_ar'], 50) : 'No description available' }}
                                </td>
                                <td>
                                    {{ $item['updated_at'] ? \Carbon\Carbon::parse($item['updated_at'])->toDateString() : 'N/A' }}
                                </td>
                                <td>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="{{route( $Route . '.show' , $item['id']) }}"><i class="fas fa-eye"></i> View</a></li>
                                            <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item['id']) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <form action="{{ route($Route . '.destroy', $item['id']) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this item?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
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
