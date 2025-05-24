<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Service\AllServiceRequest;
use App\Http\Requests\Dashboard\Service\StoreServiceRequest;
use App\Http\Requests\Dashboard\Service\UpdateServiceRequest;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Traits\HelperTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    use HelperTrait;
    public function index(AllServiceRequest $request)
    {
        $services = Service::all();
        $requested_time= ServiceRequest::select('service_id', DB::raw('COUNT(*) as count'))
        ->groupBy('service_id')
        ->pluck('count', 'service_id')
        ->toArray();

        return view('admin.Service.index', compact('services', 'requested_time'));
    }

    public function create()
    {
        return view('admin.Service.createUpdate');
    }

    public function store(StoreServiceRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('service_images', 'public');
                $imagePaths[] = Storage::url($imagePath);
            }
            $data['image'] = $imagePaths;
        }

        Service::create($data);

        $this->logAction(auth()->id(), 'create_service', 'Service created: ' . $data['name'] . ' (ID: ' . $data['id'] . ')', LogsTypes::INFO->value);
        return redirect()->route('dashboard.service')->with('success', 'Service created successfully.');
    }

    public function edit($id)
    {
        $item = Service::findOrFail($id);
        return view('admin.Service.createUpdate', compact('item'));
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $data = $request->validated();

        try {
            if ($request->hasFile('images')) {
                if ($service->image) {
                    foreach ($service->image as $oldImage) {
                        $oldImagePath = ltrim(parse_url($oldImage, PHP_URL_PATH), '/storage/');
                        Storage::disk('public')->delete($oldImagePath);
                    }
                }
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $imagePath = $image->store('service_images', 'public');
                    $imagePaths[] = Storage::url($imagePath);
                }
                $data['image'] = $imagePaths;
            }

            $service->update($data);

            $this->logAction(auth()->id(), 'update_service', 'Service updated: ' . $data['name'] . ' (ID: ' . $service->id . ')', LogsTypes::INFO->value);
            return redirect()->route('dashboard.service')->with('success', 'Service updated successfully.');
        } catch (\Exception $e) {
            $this->logAction(auth()->id(), 'update_service_error', 'Error updating service: ' . $e->getMessage(), LogsTypes::ERROR->value);
            return redirect()->back()->withErrors(['error' => 'Failed to update service: ' . $e->getMessage()]);
        }
    }

    public function show($service)
    {
        $service = Service::findOrFail($service);
        return view('admin.Service.show', compact('service'));
    }

    public function delete(DeleteProductRequest $request, $id)
    {
        $service = Service::findOrFail($id);
        if ($service->image) {
            foreach ($service->image as $image) {
                $imagePath = ltrim(parse_url($image, PHP_URL_PATH), '/storage/');
                Storage::disk('public')->delete($imagePath);
            }
        }
        $service->delete();

        $this->logAction(auth()->id(), 'delete_service', 'Service deleted: ' . $service->name . ' (ID: ' . $service->id . ')', LogsTypes::WARNING->value);
        return redirect()->route('dashboard.service')->with('success', 'Service deleted successfully.');
    }

}
