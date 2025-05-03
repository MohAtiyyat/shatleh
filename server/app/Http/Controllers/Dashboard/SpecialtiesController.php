<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Specialty\StoreSpecialtyRequest;
use App\Http\Requests\Dashboard\Specialty\UpdateSpecialtyRequest;
use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialtiesController extends Controller
{
    public function index(){
        $specialties = Specialty::with('expert')->withCount('expert')->get();
        return view('admin.specialties.index' , compact('specialties' ));
    }

    public function create(){
        return view('admin.specialties.createUpdate');
    }

    public function store(StoreSpecialtyRequest $request) {
        Specialty::create($request->all());
        return redirect()->route('dashboard.specialties.index')->with('success', 'Specialty created successfully.');
    }

    public function edit($id){
        $specialty = Specialty::find($id);
        return view('admin.specialties.createUpdate' , compact('specialty'));
    }

    public function update(UpdateSpecialtyRequest $request, $id) {
        $specialty = Specialty::findOrFail($id);
        $specialty->update($request->only(['name_ar', 'name_en']));
        return redirect()->route('dashboard.specialties.index')->with('success', 'Specialty updated successfully.');
    }

    public function destroy($id){
        $specialty = Specialty::find($id);
        $specialty->expert()->detach();
        $specialty->delete();
        return back();
    }
}
