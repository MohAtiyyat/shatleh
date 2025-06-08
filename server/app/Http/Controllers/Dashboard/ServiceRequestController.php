<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRequestController extends Controller
{
    use HelperTrait;
    public function index()
    {
        if(auth()->user()->hasRole('Expert'))
        {
            $serviceRequests = ServiceRequest::where('expert_id', auth()->user()->id)->with([
                'address',
                'service',
                'customer',
                'employee',
                'expert',
                ])->get();
        }
        else
        {
            $serviceRequests = ServiceRequest::with([
                'address',
                'service',
                'customer',
                'employee',
                'expert',
            ])->get();
        }
            $experts = User::whereHas('roles', fn($q) => $q->where('name', 'Expert'))->pluck('first_name', 'id');
        return view('admin.ServiceRequest.index', compact('serviceRequests', 'experts'));
    }

    public function show(ServiceRequest $serviceRequest)
    {
        $serviceRequest->load([
            'address',
            'service',
            'customer',
            'employee',
            'expert',
        ]);

        $experts = User::whereHas('roles', fn($q) => $q->where('name', 'Expert'))->pluck('first_name', 'id');

        return view('admin.ServiceRequest.show', compact('serviceRequest' , 'experts'));
    }
    public function assign(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'expert_id' => 'required|exists:users,id',
        ]);

        $serviceRequest->update(['expert_id' => $request->expert_id, 'employee_id' => auth()->user()->id]);

        $this->logAction(auth()->id(), 'assign_service_request', 'Service request assigned: Service Request ID ' . $serviceRequest->id . ' to Expert ID: ' . $request->expert_id, LogsTypes::INFO->value);
        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Expert assigned successfully.');
    }

    public function update(ServiceRequest $serviceRequest)
    {
        $serviceRequest->update(['status' => request('status')]);
        
        $this->logAction(auth()->id(), 'update_service_request_status', 'Service request status updated: Service Request ID ' . $serviceRequest->id . ' to ' . request('status'), LogsTypes::INFO->value);
        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Status updated successfully.');
    }

}
