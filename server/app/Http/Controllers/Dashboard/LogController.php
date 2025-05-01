<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index()
    {
        return view('admin.LogsManagement.index');
    }

    public function CustomerLog(Request $request)
{
    $search = $request->input('search');
    $type = $request->input('type');

    $logs = Log::whereHas('user.roles', function ($query) {
            $query->where('name', 'Customer');
        })
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                        $uq->where('first_name', 'like', "%{$search}%")
                           ->orWhere('last_name', 'like', "%{$search}%")
                           ->orWhere('id', $search);
                    })
                  ->orWhere('action', 'like', "%{$search}%");
            });
        })
        ->when($type, function ($query) use ($type) {
            $query->where('log_type', $type);
        })
        ->with('user.roles')
        ->orderByDesc('created_at')
        ->paginate(20);

    return view('admin.LogsManagement.customerLogs', compact('logs'));
}
public function StaffLog(Request $request)
{
    $search = $request->input('search');
    $type = $request->input('type');

    $logs = Log::whereHas('user.roles', function ($query) {
            $query->where('name', '!=', 'Customer');
        })
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                        $uq->where('first_name', 'like', "%{$search}%")
                           ->orWhere('last_name', 'like', "%{$search}%")
                           ->orWhere('id', $search);
                    })
                  ->orWhere('action', 'like', "%{$search}%");
            });
        })->when($type, function ($query) use ($type) {
            $query->where('log_type', $type);
        })
        ->with('user.roles')
        ->orderByDesc('created_at')
        ->paginate(20);

    return view('admin.LogsManagement.staffLogs', compact('logs'));
}

}
