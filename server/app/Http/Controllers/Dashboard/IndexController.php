<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\Order;
use App\Models\Post;
use App\Models\Product;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        // Order statistics
        $orderStats = $this->calculateStatusCounts(Order::class, ['pending', 'inProgress', 'delivered', 'cancelled']);
        $orderChartData = [
            'labels' => ['Pending', 'In Progress', 'Delivered', 'Cancelled'],
            'data' => [
                $orderStats['pending'],
                $orderStats['inProgress'],
                $orderStats['delivered'],
                $orderStats['cancelled']
            ]
        ];

        // Service request statistics
        $serviceRequestStats = $this->calculateStatusCounts(ServiceRequest::class, ['pending', 'inProgress', 'completed', 'cancelled']);
        $serviceRequestChartData = [
            'labels' => ['Pending', 'In Progress', 'Completed', 'Cancelled'],
            'data' => [
                $serviceRequestStats['pending'],
                $serviceRequestStats['inProgress'],
                $serviceRequestStats['completed'],
                $serviceRequestStats['cancelled']
            ]
        ];

        // Top products by quantity sold
        $topProducts = DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->select('products.name_en', DB::raw('SUM(order_details.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name_en')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();
        $productsCount = Product::count();

        // Posts data with bookmark count
        $topPosts = Post::select('id', 'title_en', DB::raw('(SELECT COUNT(*) FROM bookmarks WHERE bookmarks.post_id = posts.id) as bookmark_count'))
            ->orderBy('bookmark_count', 'desc')
            ->take(5)
            ->get();
        $postsCount = Post::count();
        $totalBookmarkCount = Bookmark::count();
        $highestInteractionPost = $topPosts->first();

        // Staff counts
        $experts = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('name', 'Expert');
        })->count();
        $employees = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('name', 'Employee');
        })->count();
        $staffCount = $experts + $employees;

        // Services count
        $servicesCount = Service::count();

        // Chart data preparation
        $topProductsChartData = [
            'labels' => $topProducts->pluck('name_en')->toArray(),
            'data' => $topProducts->pluck('total_sold')->toArray(),
        ];

        $topPostsChartData = [
            'labels' => $topPosts->pluck('title_en')->toArray(),
            'data' => $topPosts->pluck('bookmark_count')->toArray(),
        ];

        // Data array for the view
        $data = [
            'serviceRequests' => $serviceRequestStats,
            'serviceRequestChartData' => $serviceRequestChartData,
            'orders' => $orderStats,
            'orderChartData' => $orderChartData,
            'products' => [
                'topProducts' => $topProducts,
                'productsCount' => $productsCount,
                'topProductsChartData' => $topProductsChartData,
            ],
            'posts' => [
                'postsCount' => $postsCount,
                'totalBookmarkCount' => $totalBookmarkCount,
                'highestInteractionPost' => $highestInteractionPost ? [
                    'id' => $highestInteractionPost->id,
                    'title_en' => $highestInteractionPost->title_en,
                    'bookmark_count' => $highestInteractionPost->bookmark_count,
                ] : null,
                'topPostsChartData' => $topPostsChartData,
            ],
            'staff' => [
                'expertCount' => $experts,
                'employeeCount' => $employees,
                'staffCount' => $staffCount,
            ],
            'services' => [
                'servicesCount' => $servicesCount,
            ],
        ];

        return view('admin.index', compact('data'));
    }

    /**
     * Calculate counts for specified statuses of a model.
     */
    public function calculateStatusCounts(string $model, array $statuses): array
    {
        $statusCounts = $model::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $counts = [];
        foreach ($statuses as $status) {
            $counts[$status] = $statusCounts->get($status, 0);
        }
        $totalCount = $statusCounts->sum();

        return array_merge($counts, ['total' => $totalCount]);
    }
}
