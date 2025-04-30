<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Product\DeleteProductRequest;
use App\Http\Requests\Dashboard\Service\AllServiceRequest;
use App\Http\Requests\Dashboard\Service\StoreServiceRequest;
use App\Http\Requests\Dashboard\Service\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index(AllServiceRequest $request)
    {
        $services = Service::all();

        return view('admin.Service.index', compact('services'));
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
            $data['image'] = json_encode($imagePaths);
        }

        Service::create($data);

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
                $data['image'] = json_encode($imagePaths);
            }

            $service->update($data);


            return redirect()->route('dashboard.service')->with('success', 'Service updated successfully.');
        } catch (\Exception $e) {
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

        return redirect()->route('dashboard.service')->with('success', 'Service deleted successfully.');
    }

}
