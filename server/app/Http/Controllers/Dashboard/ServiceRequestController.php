<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRequestController extends Controller
{
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

        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Expert assigned successfully.');
    }

    public function update(ServiceRequest $serviceRequest)
    {
        $serviceRequest->update(['status' => request('status')]);
        return redirect()->route('dashboard.service-request.index')
        ->with('success', 'Status updated successfully.');
    }

}
