<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRequestController extends Controller
{
    public function index()
    {
        $serviceRequests = ServiceRequest::with([
            'service',
            'customer.user',
            'employee',
            'expert'
        ])->get();

        $experts = User::whereHas('roles', fn($q) => $q->where('name', 'Expert'))->pluck('first_name','last_name', 'id');

        $employees = User::whereHas('roles', fn($q) => $q->where('name', 'Employee'))->pluck('first_name', 'id');

        return view('admin.ServiceRequest.index', compact('serviceRequests', 'experts', 'employees'));
    }
    public function assign(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'expert_id' => 'required|exists:users,id',
        ]);

        $serviceRequest->update(['expert_id' => $request->expert_id, 'employee_id' => auth()->user()->id]);

        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Expert assigned successfully.')
        ->withFragment($serviceRequest->id);
    }

}
