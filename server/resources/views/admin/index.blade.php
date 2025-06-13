@extends('admin.layout.master')

@section('title', 'Admin Dashboard')
@section('dashboard_show', 'active')

@section('styles')
<style>
    :root {
        --primary: #6366f1;
        --secondary: #6b7280;
        --success: #10b981;
        --danger: #ef4444;
        --warning: #f59e0b;
        --info: #06b6d4;
        --light: #f8f9fa;
    }

    .dashboard-card {
        transition: all 0.3s ease;
        border-radius: 15px;
        border: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        overflow: hidden;
        position: relative;
    }

    .dashboard-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
    }

    .dashboard-card .card-body {
        padding: 2rem;
        position: relative;
        z-index: 2;
    }

    .dashboard-card .card-icon {
        font-size: 2.5rem;
        opacity: 0.15;
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    .stat-number {
        font-size: 2.4rem;
        font-weight: 700;
        margin: 0;
    }

    .stat-title {
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.3rem;
    }

    .clickable-card {
        cursor: pointer;
        text-decoration: none;
        color: inherit;
    }

    .clickable-card:hover {
        text-decoration: none;
    }

    .chart-card {
        border-radius: 15px;
        border: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
    }

    .chart-card:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }

    .chart-card .card-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.25rem;
        font-weight: 600;
        border-radius: 15px 15px 0 0;
        border-bottom: none;
    }

    .featured-post-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 15px;
        border: none;
    }

    .featured-post-card .card-header {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
    }

    @media (max-width: 768px) {
        .stat-number {
            font-size: 2rem;
        }

        .dashboard-card .card-body {
            padding: 1.5rem;
        }

        .card-icon {
            font-size: 2rem;
        }

        .chart-card canvas {
            height: 220px !important;
        }
    }

    @media (max-width: 576px) {
        .container-fluid {
            padding: 1rem !important;
        }

        .stat-number {
            font-size: 1.8rem;
        }

        .stat-title {
            font-size: 0.8rem;
        }
    }
</style>
@endsection

@section('content')
<div class="container-fluid p-4 bg-light min-vh-100">

    <!-- Statistic Cards -->
    <section class="row g-4 mb-5">
        @php
            $cards = [
                ['route' => 'dashboard.order', 'icon' => 'fa-box', 'title' => 'Total Orders', 'count' => $data['orders']['total'], 'bg' => 'success'],
                ['route' => 'dashboard.service-request.index', 'icon' => 'fa-wrench', 'title' => 'Service Requests', 'count' => $data['serviceRequests']['total'], 'bg' => 'primary'],
                ['route' => 'dashboard.product', 'icon' => 'fa-store', 'title' => 'Total Products', 'count' => $data['products']['productsCount'], 'bg' => 'info'],
                ['route' => 'dashboard.post.index', 'icon' => 'fa-pen-nib', 'title' => 'Total Posts', 'count' => $data['posts']['postsCount'], 'bg' => 'warning'],
                ['route' => 'dashboard.staff', 'icon' => 'fa-users', 'title' => 'Total Staff', 'count' => $data['staff']['staffCount'], 'bg' => 'secondary'],
                ['route' => 'dashboard.service', 'icon' => 'fa-cogs', 'title' => 'Total Services', 'count' => $data['services']['servicesCount'], 'bg' => 'danger'],
            ];
        @endphp

        @foreach($cards as $card)
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6">
            <a href="{{ route($card['route']) }}" class="clickable-card">
                <div class="dashboard-card card bg-{{ $card['bg'] }} text-white">
                    <div class="card-body">
                        <div class="card-icon"><i class="fas {{ $card['icon'] }}"></i></div>
                        <h5 class="stat-title">{{ $card['title'] }}</h5>
                        <h3 class="stat-number">{{ number_format($card['count']) }}</h3>
                    </div>
                </div>
            </a>
        </div>
        @endforeach
    </section>

    <!-- Charts -->
    <section class="row g-4 mb-5">
        @foreach([
            ['id' => 'orderChart', 'title' => '📊 Orders Status Distribution'],
            ['id' => 'serviceRequestChart', 'title' => '🔧 Service Requests Status'],
            ['id' => 'topProductsChart', 'title' => '🏆 Top 5 Products by Quantity Sold'],
            ['id' => 'topPostsChart', 'title' => '📚 Top 5 Posts by Bookmarks'],
        ] as $chart)
        <div class="col-xl-6 col-lg-6 col-md-12">
            <div class="chart-card card">
                <div class="card-header">
                    <h6 class="mb-0">{{ $chart['title'] }}</h6>
                </div>
                <div class="card-body">
                    <canvas id="{{ $chart['id'] }}" style="max-height: 300px;"></canvas>
                </div>
            </div>
        </div>
        @endforeach
    </section>

    <!-- Featured Post -->
    @if($data['posts']['highestInteractionPost'])
    <section class="row">
        <div class="col-12">
            <div class="featured-post-card card shadow-lg">
                <div class="card-header">
                    <h6 class="mb-0">🌟 Most Popular Post</h6>
                </div>
                <div class="card-body d-md-flex justify-content-between align-items-center">
                    <div>
                        <h5>{{ $data['posts']['highestInteractionPost']['title_en'] }}</h5>
                        <p class="mb-1"><strong>Post ID:</strong> #{{ $data['posts']['highestInteractionPost']['id'] }}</p>
                        <p class="mb-0"><strong>Total Bookmarks:</strong> {{ number_format($data['posts']['highestInteractionPost']['bookmark_count']) }}</p>
                    </div>
                    <div>
                        <a href="{{ route('dashboard.post.show', $data['posts']['highestInteractionPost']['id']) }}"
                           class="btn btn-light btn-lg mt-3 mt-md-0">
                            View Post <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    @endif

</div>
@endsection

@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    function truncateText(text, maxLength = 15) {
        return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
    }

    const chartConfig = {
        orderChart: {
            type: 'doughnut',
            data: {
                labels: @json($data['orderChartData']['labels']),
                datasets: [{
                    data: @json($data['orderChartData']['data']),
                    backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    title: { display: true, text: 'Order Status Distribution' },
                    legend: { position: 'bottom' }
                }
            }
        },
        serviceRequestChart: {
            type: 'doughnut',
            data: {
                labels: @json($data['serviceRequestChartData']['labels']),
                datasets: [{
                    data: @json($data['serviceRequestChartData']['data']),
                    backgroundColor: ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                plugins: {
                    title: { display: true, text: 'Service Request Status' },
                    legend: { position: 'bottom' }
                }
            }
        },
        topProductsChart: {
            type: 'bar',
            data: {
                labels: @json($data['products']['topProductsChartData']['labels']).map(label => truncateText(label)),
                datasets: [{
                    label: 'Quantity Sold',
                    data: @json($data['products']['topProductsChartData']['data']),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Top Selling Products' },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (ctx) => @json($data['products']['topProductsChartData']['labels'])[ctx[0].dataIndex]
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Units Sold' }},
                    x: { title: { display: true, text: 'Product' }}
                }
            }
        },
        topPostsChart: {
            type: 'bar',
            data: {
                labels: @json($data['posts']['topPostsChartData']['labels']).map(label => truncateText(label)),
                datasets: [{
                    label: 'Bookmarks',
                    data: @json($data['posts']['topPostsChartData']['data']),
                    backgroundColor: 'rgba(6, 182, 212, 0.8)',
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Top Bookmarked Posts' },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (ctx) => @json($data['posts']['topPostsChartData']['labels'])[ctx[0].dataIndex]
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Bookmarks' }},
                    x: { title: { display: true, text: 'Posts' }}
                }
            }
        }
    };

    for (const [id, config] of Object.entries(chartConfig)) {
        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, config);
    }
</script>
@endsection
