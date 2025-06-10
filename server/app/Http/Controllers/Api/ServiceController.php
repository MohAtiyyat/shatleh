<?php

namespace App\Http\Controllers\Api;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    use HelperTrait;
    /**
     * Fetch all active services.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $services = Service::where('status', 1)->get(['id', 'name_en', 'name_ar', 'description_en', 'description_ar', 'image']);

        return response()->json([
            'data' => $services,
            'message' => 'Services fetched successfully',
        ], 200);
    }

    public function getServiceRequests()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Fetch service requests for the authenticated user
        $serviceRequests = ServiceRequest::where('customer_id', $user->id)
            ->with(['service', 'address'])
            ->get()
            ->sortByDesc('created_at')
            ->map(function ($serviceRequest) {
                return [
                    'id' => $serviceRequest->id,
                    'service' => $serviceRequest->service ? [
                        'id' => $serviceRequest->service->id,
                        'name_en' => $serviceRequest->service->name_en,
                        'name_ar' => $serviceRequest->service->name_ar,
                    ] : null,
                    'address' => $serviceRequest->address ? [
                        'id' => $serviceRequest->address->id,
                        'title' => $serviceRequest->address->title,
                        'city' => $serviceRequest->address->city,
                        'address_line' => $serviceRequest->address->address_line,
                    ] : null,
                    'details' => $serviceRequest->details,
                    'status' => $serviceRequest->status,
                    'created_at' => $serviceRequest->created_at->toISOString(),
                ];
            })
            ->values(); // Reset keys to ensure an array

        return response()->json([
            'data' => $serviceRequests,
            'message' => $serviceRequests->isEmpty() ? 'No service requests found' : 'Service requests retrieved successfully',
        ], 200);
    }

    /**
     * Store a new service request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function storeServiceRequest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'address_id' => 'required|exists:addresses,id',
            'details' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $data = $validator->validated();
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('service_requests', 'public');
        }

        $serviceRequest = ServiceRequest::create([
            'customer_id' => $user->id, // Use authenticated user's ID
            'service_id' => $data['service_id'],
            'address_id' => $data['address_id'],
            'details' => $data['details'],
            'image' => $imagePath,
            'status' => 'pending',
        ]);

        $this->logAction(
            $user->id,
            'create_service_request',
            'Service request created for service ID ' . $data['service_id'] . ' by customer ID ' . $user->id,
            LogsTypes::INFO->value,
        );

        return response()->json([
            'data' => $serviceRequest,
            'message' => 'Service request created successfully',
        ], 201);
    }

    public function cancelServiceRequest($id)
{
    $serviceRequest = ServiceRequest::findOrFail($id);
    if ($serviceRequest->customer_id !== Auth::id()) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }
    if ($serviceRequest->status !== 'pending') {
        return response()->json(['error' => 'Cannot cancel request that is not pending'], 422);
    }
    $serviceRequest->status = 'cancelled';
    $serviceRequest->save();
    return response()->json(['message' => 'Service request cancelled successfully'], 200);
}
}
