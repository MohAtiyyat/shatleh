@extends('admin.layout.master')

@section('title', 'Dashboard')
@section('dashboard_show', 'active')

@section('content')
<section class="content">
    <div class="container-fluid">
       <div class="container">
            @foreach (collect($data)->chunk(3) as $chunk)
                <div class="row">
                    @foreach ($chunk as $key => $value)
                        <div class="col-lg-4 col-md-6 col-12">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h3 class="card-title">{{ $key }}</h3>
                                </div>
                                <div class="card-body">
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
                                                <!-- Handle 'top products' -->
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
                                                <!-- Handle other products data -->
                                                @foreach ($value as $item => $val)
                                                    @if($item !== 'top products')
                                                        <tr>
                                                            <td>{{ $item }}</td>
                                                            <td>{{ $val }}</td>
                                                        </tr>
                                                    @endif
                                                @endforeach
                                            @elseif($key === 'posts' && isset($value['Highest interaction post']))
                                                <!-- Handle 'posts' with clickable highest interaction post -->
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
                                                <!-- Default handling for other tables -->
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
                            </div>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput && window.location.search.includes('search')) {
            searchInput.focus();
        }

        // Area Chart (Revenue)
        const revenueChart = new Chart(document.getElementById('revenue-chart-canvas'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales',
                    data: [1200, 1900, 3000, 2500, 4000, 3500, 5000, 4500, 6000, 5500, 7000, 6500],
                    fill: true,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Donut Chart (Sales Distribution)
        const salesChart = new Chart(document.getElementById('sales-chart-canvas'), {
            type: 'doughnut',
            data: {
                labels: ['Products', 'Services', 'Discounts'],
                datasets: [{
                    data: [500, 120, 300],
                    backgroundColor: ['#007bff', '#28a745', '#ffc107']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
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


