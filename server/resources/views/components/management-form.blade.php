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
    <style>
        .management-form-page { padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { margin-bottom: 20px; }
        .header h1 { font-size: 24px; font-weight: 600; color: #5a5c69; }
        .form-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15); }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #5a5c69; }
        .form-group input, .form-group select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        .form-group select { height: 38px; }
        .custom-file { position: relative; overflow: hidden; }
        .custom-file-input { width: 100%; height: 38px; opacity: 0; position: absolute; top: 0; left: 0; cursor: pointer; }
        .custom-file-label { display: block; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #fff; color: #858796; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .footer { margin-top: 20px; text-align: right; }
        .btn-primary { background-color: #4e73df; border: none; padding: 10px 20px; color: #fff; border-radius: 4px; cursor: pointer; }
        .btn-primary:hover { background-color: #375ec8; }
    </style>
@endsection

@section('scripts')
    <script>
        document.querySelectorAll('.custom-file-input').forEach(input => {
            input.addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name || 'Choose file';
                e.target.nextElementSibling.textContent = fileName;
            });
        });

        document.getElementById('managementForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('Form Data:', data);
            alert(`Item ${@json($item ? 'updated' : 'created')} successfully! Check console for form data.`);
        });
    </script>
@endsection
