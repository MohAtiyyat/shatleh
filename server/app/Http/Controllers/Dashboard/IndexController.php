<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Post;
use App\Models\Product;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $data = [];
        $ordersData = Order::query();
        $serviceRequests = ServiceRequest::query();

        $serviceRequests = $serviceRequests->get();
        $orders = $ordersData->get();

        $ordersCount = $orders->count();
        $inProgressOrdersCount = $orders->whereNotIn('status', ['delivered', 'canceled'])->count();
        $doneOrdersCount = $orders->where('status', 'delivered')->count();
        $canceledOrdersCount = $orders->where('status', 'canceled')->count();
        $serviceRequestsCount = $serviceRequests->count();
        $inProgressServiceRequestsCount = $serviceRequests->whereNotIn('status', ['done', 'canceled'])->count();
        $doneServiceRequestsCount = $serviceRequests->where('status', 'done')->count();
        $canceledServiceRequestsCount = $serviceRequests->where('status', 'canceled')->count();
        
        $posts = Post::select('id', 'title_en', 'like')->get();
        $postsCount = $posts->count();
        $postsInteractionCount = $posts->sum('like');
        $highestInteractionPost = $posts->sortByDesc('like')->first();

        $experts = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('name', 'Expert');
        });
        $employees = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('name', 'Employee');
        });

        $expertCount = $experts->count();
        $employeeCount = $employees->count();
        $staffCount = $expertCount + $employeeCount;

        $data = [
            'serviceRequests' => [
                'Service requests count' => $serviceRequestsCount,
                'In progress service requests count' => $inProgressServiceRequestsCount,
                'Done service requests count' => $doneServiceRequestsCount,
                'Canceled service requests count' => $canceledServiceRequestsCount,
                'In progress service requests percentage' => $serviceRequestsCount > 0 ? ($inProgressServiceRequestsCount / $serviceRequestsCount * 100) : 0,
                'Done service requests percentage' => $serviceRequestsCount > 0 ? ($doneServiceRequestsCount / $serviceRequestsCount * 100) : 0,
                'Canceled service requests percentage' => $serviceRequestsCount > 0 ? ($canceledServiceRequestsCount / $serviceRequestsCount * 100) : 0,
            ],
            'orders' => [
                'Orders count' => $ordersCount,
                'In progress orders count' => $inProgressOrdersCount,
                'Done orders count' => $doneOrdersCount,
                'Canceled orders count' => $canceledOrdersCount,
                'In progress orders percentage' => $ordersCount > 0 ? ($inProgressOrdersCount / $ordersCount * 100) : 0,
                'Done orders percentage' => $ordersCount > 0 ? ($doneOrdersCount / $ordersCount * 100) : 0,
                'Canceled orders percentage' => $ordersCount > 0 ? ($canceledOrdersCount / $ordersCount * 100) : 0,
            ],
            'products' => [
                'top products' => Product::select('id', 'name_en', 'sold_quantity')->orderBy('sold_quantity', 'desc')->take(5)->get(),
                'products count' => Product::count(),
            ],
            'posts' => [
                'Posts count' => $postsCount,
                'Posts interaction count' => $postsInteractionCount,
                'Highest interaction post' => $highestInteractionPost ? [
                    'id' => $highestInteractionPost->id,
                    'title_en' => $highestInteractionPost->title_en,
                ] : null,
            ],
            'staff' => [
                'Expert count' => $expertCount,
                'Employee count' => $employeeCount,
                'Staff count' => $staffCount,
            ],
            'services' => [
                'services count' => Service::count(),
            ],
        ];

        return view('admin.index', compact('data'));
    }
    public function calculateStatusCounts(string $model, $doneStatus, $canceledStatus): array
    {
        $doneStatus = $doneStatus.'';
        $canceledStatus = $canceledStatus.'';
        $statusCounts = $model::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalCount = $statusCounts->sum();
        $inProgressCount = $statusCounts->except([$doneStatus, $canceledStatus])->sum();
        $doneCount = $statusCounts->get($doneStatus, 0);
        $canceledCount = $statusCounts->get($canceledStatus, 0);

        return [
            'total' => $totalCount,
            'inProgress' => $inProgressCount,
            'done' => $doneCount,
            'canceled' => $canceledCount,
            'inProgressPercentage' => $totalCount > 0 ? ($inProgressCount / $totalCount * 100) : 0,
            'donePercentage' => $totalCount > 0 ? ($doneCount / $totalCount * 100) : 0,
            'canceledPercentage' => $totalCount > 0 ? ($canceledCount / $totalCount * 100) : 0,
        ];
    }
}
