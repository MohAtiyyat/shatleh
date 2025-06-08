@extends('admin.layout.master')

@section('title', 'Dashboard')
@section('dashboard_show', 'active')

@section('content')
<section class="content">
    <div class="container-fluid">
        @foreach (collect($data)->chunk(3) as $chunk)
            <div class="row">
                @foreach ($chunk as $key => $value)
                    <div class="col-lg-4 col-md-6 col-12">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h3 class="card-title">{{ $key }}</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-primary btn-sm toggle-view" data-section="{{ $key }}">Show Chart</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <!-- Table View (Default) -->
                                <div class="display-section" id="{{ $key }}-table" style="display: block;">
                                    <table class="table table-bordered">
                                        <caption class="visually-hidden">Details for {{ $key }}</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">Item</th>
                                                <th scope="col">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @if($key === 'products' && isset($value['top products']))
                                                @foreach ($value['top products'] as $product)
                                                    <tr>
                                                        <td>
                                                            <a href="{{ url('/dashboard/product/' . $product->id) }}">
                                                                {{ $product->name_en }}
                                                            </a>
                                                        </td>
                                                        <td>{{ $product->sold_quantity }}</td>
                                                    </tr>
                                                @endforeach
                                                @foreach ($value as $item => $val)
                                                    @if($item !== 'top products')
                                                        <tr>
                                                            <td>{{ $item }}</td>
                                                            <td>{{ $val }}</td>
                                                        </tr>
                                                    @endif
                                                @endforeach
                                            @elseif($key === 'posts' && isset($value['Highest interaction post']))
                                                @foreach ($value as $item => $val)
                                                    <tr>
                                                        <td>{{ $item }}</td>
                                                        <td>
                                                            @if($item === 'Highest interaction post' && $val)
                                                                <a href="{{ url('/dashboard/post/' . $val['id']) }}">
                                                                    {{ $val['title_en'] }}
                                                                </a>
                                                            @else
                                                                {{ $val }}
                                                            @endif
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            @elseif(is_array($value) || is_object($value))
                                                @foreach ($value as $item => $val)
                                                    <tr>
                                                        <td>{{ $item }}</td>
                                                        <td>{{ $val }}</td>
                                                    </tr>
                                                @endforeach
                                            @else
                                                <tr>
                                                    <td colspan="2">No iterable data available</td>
                                                </tr>
                                            @endif
                                        </tbody>
                                    </table>
                                </div>
                                <!-- Chart View -->
                                <div class="display-section" id="{{ $key }}-chart" style="display: none;">
                                    <canvas id="{{ $key }}-chart-canvas" style="height: 200px;"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>
</section>
@endsection

@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Data for charts
        const data = {
            serviceRequests: {
                labels: ['Service requests count', 'In progress service requests count', 'Done service requests count', 'Canceled service requests count'],
                values: [1, 1, 0, 0],
                percentages: ['In progress service requests percentage', 'Done service requests percentage', 'Canceled service requests percentage'],
                percentageValues: [100, 0, 0]
            },
            orders: {
                labels: ['Orders count', 'In progress orders count', 'Done orders count', 'Canceled orders count'],
                values: [5, 5, 0, 0],
                percentages: ['In progress orders percentage', 'Done orders percentage', 'Canceled orders percentage'],
                percentageValues: [100, 0, 0]
            },
            products: {
                labels: ['Basil Plant', 'Hybrid Tomato Seeds', 'Deltamethrin 2.5% EC', 'Drip Irrigation Kit', 'Local Variety Cucumber Seeds'],
                values: [0, 0, 0, 0, 15]
            },
            posts: {
                labels: ['Posts count', 'Posts interaction count'],
                values: [8, 0]
            },
            staff: {
                labels: ['Expert count', 'Employee count', 'Staff count'],
                values: [1, 2, 3]
            },
            services: {
                labels: ['services count'],
                values: [3]
            }
        };

        // Colors for charts
        const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'];

        // Initialize charts for each section
        Object.keys(data).forEach(section => {
            const chartType = in_array(section, ['serviceRequests', 'orders', 'products', 'staff']) ? 'doughnut' : 'line';
            new Chart(document.getElementById(`${section}-chart-canvas`), {
                type: chartType,
                data: {
                    labels: section === 'serviceRequests' || section === 'orders' ? data[section].labels.concat(data[section].percentages) : data[section].labels,
                    datasets: [{
                        label: section.charAt(0).toUpperCase() + section.slice(1),
                        data: section === 'serviceRequests' || section === 'orders' ? data[section].values.concat(data[section].percentageValues) : data[section].values,
                        fill: chartType === 'line' ? false : true,
                        borderColor: '#007bff',
                        backgroundColor: chartType === 'doughnut' ? colors.slice(0, (section === 'serviceRequests' || section === 'orders') ? data[section].labels.length + data[section].percentages.length : data[section].labels.length) : 'rgba(0, 123, 255, 0.2)',
                        tension: chartType === 'line' ? 0.1 : 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: chartType === 'line' ? {
                        y: {
                            beginAtZero: true
                        }
                    } : {}
                }
            });
        });

        // Toggle between table and chart
        document.querySelectorAll('.toggle-view').forEach(button => {
            button.addEventListener('click', function() {
                const section = this.dataset.section;
                const table = document.getElementById(`${section}-table`);
                const chart = document.getElementById(`${section}-chart`);

                if (table.style.display === 'block') {
                    table.style.display = 'none';
                    chart.style.display = 'block';
                    this.textContent = 'Show Table';
                } else {
                    table.style.display = 'block';
                    chart.style.display = 'none';
                    this.textContent = 'Show Chart';
                }
            });
        });

        // Helper function to check if value is in array
        function in_array(value, array) {
            return array.indexOf(value) !== -1;
        }
    });
</script>
@if(session('success'))
<script>
    Swal.fire({
        toast: true,
        position: 'top-end',
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