@extends('admin.layout.master')

@section('title', isset($item) ? 'Edit Product' : 'Create Product')
@section('Products_Show', 'active')

@section('content')
    @php
        // Get the selected main category ID if editing
        $selectedMainCategoryId = null;
        $selectedSubCategoryIds = [];

        if (isset($item) && $item->categories) {
            foreach ($item->categories as $category) {
                if ($category->parent_id === null) {
                    $selectedMainCategoryId = $category->id;
                } else {
                    $selectedSubCategoryIds[] = $category->id;
                }
            }
        }
    @endphp

    <x-management-form
        :title="isset($item) ? 'Edit Product' : 'Create New Product'"
        :action="isset($item) ? route('dashboard.product.update', $item->id) : route('dashboard.product.create')"
        :method="isset($item) ? 'PUT' : 'POST'"
        enctype="multipart/form-data"
        :item="$item ?? null"
        :fields="[
            ['name' => 'name_en', 'label' => 'Name (English)', 'type' => 'text', 'placeholder' => 'Enter English name', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'name_ar', 'label' => 'Name (Arabic)', 'type' => 'text', 'placeholder' => 'Enter Arabic name', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'price', 'label' => 'Price', 'type' => 'number', 'placeholder' => 'Enter price (e.g., 99.99)', 'step' => '0.01', 'min' => '0', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'images[]', 'label' => 'Images', 'type' => 'file', 'accept' => 'image/*', 'multiple' => true, 'required' => !isset($item), 'aria-required' => !isset($item) ? 'true' : 'false'],
            ['name' => 'categories[]', 'label' => 'Main Category', 'type' => 'select', 'options' => $categories->pluck('name_ar', 'id')->toArray(), 'required' => true, 'aria-required' => 'true'],
            ['name' => 'sub_categories[]', 'label' => 'Sub Categories', 'type' => 'select', 'options' => [], 'multiple' => true, 'required' => true, 'aria-required' => 'true'],
            ['name' => 'description_en', 'label' => 'Description (English)', 'type' => 'textarea', 'placeholder' => 'Enter English description', 'required' => true, 'aria-required' => 'true'],
            ['name' => 'description_ar', 'label' => 'Description (Arabic)', 'type' => 'textarea', 'placeholder' => 'Enter Arabic description', 'required' => true, 'dir' => 'rtl', 'aria-required' => 'true'],
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['1' => 'Active', '0' => 'Inactive', '2' => 'Draft'], 'required' => true, 'aria-required' => 'true'],
            ['name' => 'availability', 'label' => 'Availability', 'type' => 'select', 'options' => ['1' => 'In Stock', '0' => 'Out of Stock', '2' => 'Pre-order'], 'required' => true, 'aria-required' => 'true']
        ]"
        :groupedSubcategories="$groupedSubcategories"
        :errors="$errors ?? []"
    />

    @if(isset($item) && is_array($item->image) && count($item->image) > 0)
        <div class="mt-4 p-4 border rounded">
            <h4 class="mb-3">Current Images</h4>
            <div class="d-flex flex-wrap">
                @foreach($item->image as $image)
                    <div class="mr-3 mb-3">
                        <img src="{{ $image }}" alt="Product Image" style="max-width: 150px; max-height: 150px;">
                    </div>
                @endforeach
            </div>
            <div class="mt-2 text-muted">
                <small>* If you upload new images, these current images will be replaced</small>
            </div>
        </div>
    @endif
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Category data
            const subcategoriesMap = @json($groupedSubcategories);
            const selectedMainCategoryId = @json($selectedMainCategoryId);
            const selectedSubCategoryIds = @json($selectedSubCategoryIds);

            // DOM elements
            const categorySelect = document.querySelector('select[name="categories[]"]');
            const subcategorySelect = document.querySelector('select[name="sub_categories[]"]');

            // Pre-select main category if editing
            if (selectedMainCategoryId && categorySelect) {
                for (let i = 0; i < categorySelect.options.length; i++) {
                    if (categorySelect.options[i].value == selectedMainCategoryId) {
                        categorySelect.options[i].selected = true;
                        break;
                    }
                }
            }

            function updateSubcategories() {
                if (!subcategorySelect) return;

                const selectedCategoryId = categorySelect.value;

                // Save attributes
                const isMultiple = subcategorySelect.multiple;
                const isRequired = subcategorySelect.required;
                const className = subcategorySelect.className;

                // Clear options
                subcategorySelect.innerHTML = '';

                // Add new options based on the selected category
                if (subcategoriesMap[selectedCategoryId]) {
                    Object.entries(subcategoriesMap[selectedCategoryId]).forEach(([id, name]) => {
                        const option = document.createElement('option');
                        option.value = id;
                        option.textContent = name;

                        // Pre-select if in selected subcategories
                        if (selectedSubCategoryIds.includes(parseInt(id))) {
                            option.selected = true;
                        }

                        subcategorySelect.appendChild(option);
                    });
                }

                // Restore attributes
                if (isMultiple) subcategorySelect.multiple = true;
                if (isRequired) subcategorySelect.required = true;
                subcategorySelect.className = className;
            }

            // Add event listener
            if (categorySelect) {
                categorySelect.addEventListener('change', updateSubcategories);

                // Initial load of subcategories
                updateSubcategories();
            }
        });
    </script>
@endsection
