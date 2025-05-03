@props(['experts' => [], 'title' => 'Experts', 'specialtyId'])

@php
    $modalId = 'expertModal-' . $specialtyId;
@endphp

<a href="#" data-toggle="modal" data-target="#{{ $modalId }}">
    {{ count($experts) }}
</a>

<!-- Modal -->
<div class="modal fade" id="{{ $modalId }}" tabindex="-1" role="dialog" aria-labelledby="{{ $modalId }}Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="{{ $modalId }}Label">{{ $title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                @if(count($experts) > 0)
                    <ul class="list-group">
                        @foreach($experts as $expert)
                            <a href="{{ url('dashboard/staff/' . $expert->id) }}">
                                <li class="list-group-item">{{ $expert->first_name ?? $expert->name }} {{ $expert->last_name ?? $expert->name }}</li>
                            </a>
                        @endforeach
                    </ul>
                @else
                    <p class="text-muted">No experts found for this specialty.</p>
                @endif
            </div>
        </div>
    </div>
</div>
