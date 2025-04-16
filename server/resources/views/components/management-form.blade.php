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
            <form id="managementForm" enctype="multipart/form-data" method="{{ $method }}" action="{{ $action }}">
                @if($method === 'POST' && !$item)
                    @csrf
                @elseif($method === 'PUT' && $item)
                    @csrf
                    @method('PUT')
                @endif

                <!-- Render Fields -->
                @foreach($fields as $field)
                    <div class="form-group">
                        <label for="{{ $field['name'] }}">{{ $field['label'] }} {{ $field['required'] ?? false ? '*' : '' }}</label>
                        @if($field['type'] === 'select')
                            <select id="{{ $field['name'] }}" name="{{ $field['name'] }}" {{ $field['required'] ?? false ? 'required' : '' }}>
                                @foreach($field['options'] ?? [] as $value => $label)
                                    <option value="{{ $value }}" {{ $item && $item[$field['name']] === $value ? 'selected' : '' }}>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                        @elseif($field['type'] === 'file')
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                           {{ $field['required'] ?? false && !$item ? 'required' : '' }}>
                                    <label class="custom-file-label" for="{{ $field['name'] }}">
                                        {{ $item && $item[$field['name']] ? basename($item[$field['name']]) : ($field['placeholder'] ?? 'Choose file') }}
                                    </label>
                                </div>
                            </div>
                        @else
                            <input type="{{ $field['type'] ?? 'text' }}" id="{{ $field['name'] }}" name="{{ $field['name'] }}"
                                   placeholder="{{ $field['placeholder'] ?? '' }}"
                                   {{ $field['required'] ?? false ? 'required' : '' }}
                                   {{ $field['dir'] ?? '' ? 'dir="' . $field['dir'] . '"' : '' }}
                                   {{ $field['disabled'] ?? false ? 'disabled' : '' }}
                                   value="{{ $item[$field['name']] ?? ($field['value'] ?? '') }}">
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
