@props([
    'title' => 'Create New Item',
    'action' => '#',
    'method' => 'POST',
    'item' => null,
    'fields' => [],
])

<div class="management-form-page">
    <div class="container">
        <div class="header">
            <h1>{{ $title }}</h1>
        </div>

        <div class="form-container">
            <form id="managementForm" enctype="multipart/form-data" method="POST" action="{{ $action }}">
                @if($method === 'POST' && !$item)
                    @csrf
                @elseif($method === 'PUT' && $item)
                    @csrf
                    @method('PUT')
                @endif

                <!-- Render Fields -->
                @foreach($fields as $field)
                    <div class="form-group">
                        <label for="{{ $field['name'] }}">{{ $field['label'] }} {{ $field['required'] ?? false ? '' : '' }}</label>
                        @if($field['type'] === 'select')
                            <select id="{{ $field['name'] }}" name="{{ $field['name'] }}" {{ $field['required'] ?? false ? 'required' : '' }}>
                                @foreach($field['options'] ?? [] as $value => $label)
                                    <option value="{{ $value }}" {{ $item && $item[$field['name']] === $value ? 'selected' : '' }}>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                        @elseif($field['type'] === 'file')
                            @if($item && $item[$field['name']] && $field['name'] === 'image')
                                <div class="mb-3">
                                    <label>Current Image</label>
                                    <div>
                                        <img src="{{ $item[$field['name']] }}" alt="Current Image" style="max-width: 200px; height: auto; border-radius: 0.35rem;">
                                    </div>
                                </div>
                            @endif
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                           accept="{{ $field['accept'] ?? '' }}"
                                           {{ $field['required'] ?? false && !$item ? 'required' : '' }}>
                                    <label class="custom-file-label" for="{{ $field['name'] }}">
                                        {{ $item && $item[$field['name']] ? basename($item[$field['name']]) : ($field['placeholder'] ?? 'Choose file') }}
                                    </label>
                                </div>
                            </div>
                        @elseif($field['type'] === 'textarea')
                            <textarea id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                      placeholder="{{ $field['placeholder'] ?? '' }}"
                                      {{ $field['required'] ?? false ? 'required' : '' }}
                                      {{ $field['dir'] ?? '' ? 'dir="' . $field['dir'] . '"' : '' }}
                                      {{ $field['disabled'] ?? false ? 'disabled' : '' }} cols="155" rows="3">{{ $item[$field['name']] ?? ($field['value'] ?? '') }}</textarea>
                        @else
                            <input type="{{ $field['type'] ?? 'text' }}" id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                   placeholder="{{ $field['placeholder'] ?? '' }}"
                                   {{ $field['required'] ?? false ? 'required' : '' }}
                                   {{ $field['dir'] ?? '' ? 'dir="' . $field['dir'] . '"' : '' }}
                                   {{ $field['disabled'] ?? false ? 'disabled' : '' }}
                                   value="{{ $item[$field['name']] ?? ($field['value'] ?? '') }}"
                                   {{ $field['step'] ?? '' ? 'step="' . $field['step'] . '"' : '' }}
                                   {{ $field['min'] ?? '' ? 'min="' . $field['min'] . '"' : '' }}>
                        @endif

                    </div>
                @endforeach

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
                const fileName = e.target.files[0]?.name || 'Choose file';
                e.target.nextElementSibling.textContent = fileName;
            });
        });
    </script>
@endsection
