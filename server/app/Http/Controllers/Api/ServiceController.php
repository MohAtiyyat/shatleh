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
            'customer_id' => 'required|exists:users,id', // Validate customer_id
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
            'customer_id' => $data['customer_id'], // Use customer_id
            'service_id' => $data['service_id'],
            'address_id' => $data['address_id'],
            'details' => $data['details'],
            'image' => $imagePath,
            'status' => 'pending',
        ]);

        $this->logAction(
            $user->id,
            'create_service_request',
            'Service request created for service ID ' . $data['service_id'] . ' by customer ID ' . $data['customer_id'],
            LogsTypes::INFO->value,
        );
        return response()->json([
            'data' => $serviceRequest,
            'message' => 'Service request created successfully',
        ], 201);
    }
}