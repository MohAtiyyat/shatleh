@props([
    'title' => 'Create New Item',
    'action' => '#',
    'method' => 'POST',
    'item' => null,
    'fields' => [],
    'errors' => null,
    'specialties' => [], // Added specialties
])

<div class="management-form-page">
    <div class="container">
        <div class="header">
            <h1>{{ $title }}</h1>
        </div>

        <div class="form-container">
            <form id="managementForm" enctype="multipart/form-data" method="POST" action="{{ $action }}">
                @csrf
                @if($method === 'PUT' && $item)
                    @method('PUT')
                @endif

                <!-- Render Fields -->
                @foreach($fields as $field)
                    <div class="form-group">
                        <label for="{{ $field['name'] }}">{{ $field['label'] }} {{ $field['required'] ?? false ? '' : '' }}</label>
                        @if($field['type'] === 'select')
                            <select id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                    {{ $field['required'] ?? false ? 'required' : '' }}
                                    {{ $field['multiple'] ?? false ? 'multiple' : '' }}>
                                @foreach($field['options'] ?? [] as $value => $label)
                                    <option value="{{ $value }}"
                                            @if($item)
                                                @if($field['multiple'] ?? false)
                                                    {{ in_array($value, old($field['name'], $item[str_replace('[]', '', $field['name'])] ?? [])) ? 'selected' : '' }}
                                                @else
                                                    {{ old($field['name'], $item[$field['name']] ?? '') == $value ? 'selected' : '' }}
                                                @endif
                                            @endif>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                        @elseif($field['type'] === 'file')
                            @if($item && $item[str_replace('[]', '', $field['name'])] && $field['name'] !== 'images[]' && is_string($item[str_replace('[]', '', $field['name'])]))
                                <div class="mb-3">
                                    <label>Current Image</label>
                                    <div>
                                        <img src="{{ $item[str_replace('[]', '', $field['name'])] }}"
                                             alt="Current Image"
                                             style="max-width: 200px; height: auto; border-radius: 0.35rem;">
                                    </div>
                                </div>
                            @elseif($item && $field['name'] === 'images[]' && is_array($item['image']))
                                <div class="mb-3">
                                    <label>Current Images</label>
                                    <div class="d-flex flex-wrap">
                                        @foreach($item['image'] as $image)
                                            <img src="{{ asset($image) }}"
                                                 alt="Current Image"
                                                 style="max-width: 100px; height: auto; border-radius: 0.35rem; margin: 5px;">
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input"
                                           id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                           accept="{{ $field['accept'] ?? '' }}"
                                           {{ $field['required'] ?? false && !$item ? 'required' : '' }}
                                           {{ $field['multiple'] ?? false ? 'multiple' : '' }}>
                                    <label class="custom-file-label" for="{{ $field['name'] }}">
                                        Choose file{{ $field['multiple'] ?? false ? '(s)' : '' }}
                                    </label>
                                </div>
                            </div>
                            @if($field['name'] === 'images[]')
                                <small class="form-text text-muted">Upload up to 5 images, each up to 2MB (JPEG, PNG, JPG).</small>
                            @elseif($field['type'] === 'file')
                                <small class="form-text text-muted">Upload one image, up to 2MB (JPEG, PNG, JPG).</small>
                            @endif
                        @elseif($field['type'] === 'textarea')
                            <textarea id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                      placeholder="{{ $field['placeholder'] ?? '' }}"
                                      {{ $field['required'] ?? false ? 'required' : '' }}
                                      {{ $field['dir'] ?? '' ? 'dir="' . $field['dir'] . '"' : '' }}
                                      {{ $field['disabled'] ?? false ? 'disabled' : '' }}
                                      class="big" rows="3">{{ old($field['name'], $item[$field['name']] ?? ($field['value'] ?? '')) }}</textarea>
                        @else
                            <input type="{{ $field['type'] ?? 'text' }}"
                                   id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                   placeholder="{{ $field['placeholder'] ?? '' }}"
                                   {{ $field['required'] ?? false ? 'required' : '' }}
                                   {{ $field['dir'] ?? '' ? 'dir="' . $field['dir'] . '"' : '' }}
                                   {{ $field['disabled'] ?? false ? 'disabled' : '' }}
                                   value="{{ old($field['name'], $item[$field['name']] ?? ($field['value'] ?? '')) }}"
                                   {{ $field['step'] ?? '' ? 'step="' . $field['step'] . '"' : '' }}
                                   {{ $field['min'] ?? '' ? 'min="' . $field['min'] . '"' : '' }}
                                   {{ $field['maxlength'] ?? '' ? 'maxlength="' . $field['maxlength'] . '"' : '' }}
                                   {{ $field['type'] == 'button' ? 'onclick=window.location.href=\''.route($field['href']).'\'' : '' }}>
                        @endif
                        @error(str_replace('[]', '', $field['name']))
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                        @if($field['name'] === 'images[]')
                            @error('images.*')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                        @endif
                    </div>
                @endforeach
                @if(isset($specialties))
                    <div id="specialties-container" class="specialties-container hidden">
                        <label class="specialties-title">Specialties</label>
                        <div class="specialties-list">
                            @foreach($specialties as $specialty)
                                <label class="specialty-item" for="specialty-{{ $specialty->id }}">
                                    <input
                                        class="specialty-checkbox"
                                        type="checkbox"
                                        name="specialties[]"
                                        value="{{ $specialty->id }}"
                                        id="specialty-{{ $specialty->id }}"
                                        @if(isset($item) && $item->specialties->contains($specialty->id)) checked @endif
                                    >
                                    <span>{{ $specialty->name_ar }}</span>
                                </label>
                            @endforeach
                        </div>
                    </div>
                @endif
                <div class="footer">
                    <button type="submit" class="btn btn-primary">
                        {{ $item ? 'Update Item' : 'Create Item' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>

@section('css')
    <link rel="stylesheet" href="{{ asset('assets/customCss/form.css') }}">
@endsection

@section('scripts')
    <script>
        document.querySelectorAll('.custom-file-input').forEach(input => {
            input.addEventListener('change', function(e) {
                const files = e.target.files;
                const label = e.target.nextElementSibling;
                if (files.length > 1) {
                    label.textContent = `${files.length} files selected`;
                } else {
                    label.textContent = files[0]?.name || 'Choose file(s)';
                }
            });
        });
        document.addEventListener('DOMContentLoaded', function () {
            const roleSelect = document.getElementById('role');
            const specialtiesContainer = document.getElementById('specialties-container');

            function toggleSpecialties() {
                if (roleSelect.value === 'Expert') {
                    specialtiesContainer.style.display = 'block';
                } else {
                    specialtiesContainer.style.display = 'none';
                    specialtiesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                }
            }

            roleSelect.addEventListener('change', toggleSpecialties);
            toggleSpecialties(); // Initial check
        });
    </script>

@endsection


