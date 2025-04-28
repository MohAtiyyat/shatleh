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
            <div class="btn-group" id="export-tools"></div>
            <div class="ml-auto">
                @if (Route::has($Route . '.create'))
                    <a href="{{ route($Route . '.create') }}" class="btn btn-primary">
                        <i class="fas fa-plus fa-sm mr-2"></i>Add New
                    </a>
                @endif
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
                        {{ $rows }}
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
        var table = $('#managementTable').DataTable({
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

                // Prefill the DataTable search input from the URL (without pressing Enter)
                var searchInput = $('div.dataTables_filter input');
                var url = new URL(window.location.href);
                var searchQuery = url.searchParams.get('search');

                if (searchQuery) {
                    searchInput.val(searchQuery); // fill the search box
                    this.api().search(searchQuery).draw(); // trigger the frontend search
                }
            }
        });
      });

    </script>
@if(session('success'))
<script>
    Swal.fire({
        toast: true,
        position: 'top-end', // top-right corner
        icon: 'success',
        title: '{{ session('success') }}',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: false,
    });
</script>
@endif

@if(session('error'))
<script>
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: '{{ session('error') }}',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
</script>
@endif


@endsection
