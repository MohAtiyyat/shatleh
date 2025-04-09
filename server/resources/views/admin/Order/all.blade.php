@extends('admin.layout.master')

@section('title', 'Orders Management')
@section('Orders_Show')
    active
@endsection

@section('content')
    <x-management-table title="Orders Management" :headers="['ID', 'Order Code', 'Customer', 'Shop', 'Status', 'Actions']" :items="[
        [
            'id' => 1,
            'order_code' => 'ORD-123',
            'customer' => 'John Doe',
            'shop' => 'Shop A',
            'status' => 'Processing',
            'actions' => true,
        ],
        [
            'id' => 2,
            'order_code' => 'ORD-124',
            'customer' => 'Jane Smith',
            'shop' => 'None',
            'status' => 'Pending',
            'actions' => true,
        ],
    ]" add-route="''"
        view-route-prefix="/order" />




@endsection

@section('css')
    <style>
        .filter-sort-bar {
            padding: 1rem;
            background-color: var(--secondary-color);
            margin-bottom: 1rem;
            border-radius: var(--border-radius);
        }

        .filter-group,
        .sort-group {
            display: inline-flex;
            gap: 10px;
            margin-right: 20px;
        }

        .filter-group select,
        .sort-group select {
            padding: 0.375rem 0.75rem;
            border-radius: var(--border-radius);
            border: 1px solid rgba(0, 0, 0, .1);
        }

        .action-select {
            width: 150px;
            margin: 5px 0 0 20px;
        }
    </style>
@endsection

@section('scripts')
    <script>
        $(function() {


            let table = $('#managementTable').DataTable({
                responsive: true,
                lengthChange: true,
                autoWidth: false,
                pageLength: 10,
                order: [
                    [0, 'asc']
                ],
                dom: '<"filter-sort-bar"<"filter-group"f><"sort-group">>rtip',
                buttons: [{
                        extend: 'copy',
                        className: 'btn-sm btn-primary',
                        text: '<i class="fas fa-copy mr-1"></i>Copy'
                    },
                    {
                        extend: 'csv',
                        className: 'btn-sm btn-primary',
                        text: '<i class="fas fa-file-csv mr-1"></i>CSV'
                    },
                    {
                        extend: 'excel',
                        className: 'btn-sm btn-primary',
                        text: '<i class="fas fa-file-excel mr-1"></i>Excel'
                    },
                    {
                        extend: 'pdf',
                        className: 'btn-sm btn-primary',
                        text: '<i class="fas fa-file-pdf mr-1"></i>PDF'
                    },
                    {
                        extend: 'print',
                        className: 'btn-sm btn-primary',
                        text: '<i class="fas fa-print mr-1"></i>Print'
                    }
                ],
                language: {
                    search: "Search:",
                    lengthMenu: "_MENU_ records per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries"
                },
                initComplete: function() {
                    this.api().buttons().container().appendTo('#export-tools');

                    // Filters
                    $('.filter-group').prepend(`
                        <select class="status-filter">
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                        </select>
                        <select class="customer-filter">
                            <option value="">Customer</option>
                            <!-- Populate dynamically from backend -->
                        </select>
                        <select class="shop-filter">
                            <option value="">Shop</option>
                            <!-- Populate dynamically from backend -->
                        </select>
                    `);

                    // Sort options
                    $('.sort-group').append(`
                        <select class="sort-total">
                            <option value="">Total Price</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                        </select>
                        <select class="sort-date">
                            <option value="">Date</option>
                            <option value="asc">Oldest First</option>
                            <option value="desc">Newest First</option>
                        </select>
                    `);

                    // Filter handling
                    $('.status-filter, .customer-filter, .shop-filter').on('change', function() {
                        table.draw();
                    });

                    // Custom filtering
                    $.fn.dataTable.ext.search.push(
                        function(settings, data, dataIndex) {
                            let status = $('.status-filter').val();
                            let customer = $('.customer-filter').val();
                            let shop = $('.shop-filter').val();

                            let rowStatus = data[4];
                            let rowCustomer = data[2];
                            let rowShop = data[3];

                            return (status === '' || rowStatus === status) &&
                                (customer === '' || rowCustomer === customer) &&
                                (shop === '' || rowShop === shop);
                        }
                    );
                }
            });

            // Customize actions dropdown based on role
            $('.dropdown-menu').each(function() {
                let orderId = $(this).closest('tr').find('td:first').text();
                let baseContent = `
                    <li><a class="dropdown-item" href="/order/${orderId}" data-toggle="modal" data-target="#orderDetailsModal"><i class="fas fa-eye"></i> View</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fas fa-store"></i> Assign Shop</a>
                        <select class="form-control action-select assign-shop" data-order-id="${orderId}">
                            <option value="">Select Shop</option>
                            <!-- Populate dynamically based on Product_Shops -->
                            <option value="Shop A">Shop A</option>
                            <option value="Shop B">Shop B</option>
                        </select>
                    </li>
                    <li><a class="dropdown-item" href="#"><i class="fas fa-sync"></i> Update Status</a>
                        <select class="form-control action-select update-status" data-order-id="${orderId}">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                        </select>
                    </li>
                `;

                if (isAdmin) {
                    baseContent += `
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="/order/${orderId}/edit"><i class="fas fa-edit"></i> Edit</a></li>
                        <li><a class="dropdown-item text-danger" href="#" data-action="delete" data-order-id="${orderId}"><i class="fas fa-trash"></i> Delete</a></li>
                    `;
                }

                $(this).html(baseContent);
            });

            // Handle shop assignment and status updates
            $(document).on('change', '.assign-shop', function() {
                let orderId = $(this).data('order-id');
                let shop = $(this).val();
                // Add AJAX call to update shop assignment
            });

            $(document).on('change', '.update-status', function() {
                let orderId = $(this).data('order-id');
                let status = $(this).val();
                // Add AJAX call to update status
            });
        });

        // Modal for Order Details (to be implemented separately)
        const orderDetailsModal = `
            <div class="modal fade" id="orderDetailsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Details</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Dynamic content for products, address_id, etc. -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    </script>
@endsection
