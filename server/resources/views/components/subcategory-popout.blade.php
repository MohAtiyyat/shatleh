@props(['subcategories' => [], 'title' => 'Subcategories', 'categoryId'])

@php
    $modalId = 'subCategoryModal-' . $categoryId;
@endphp

<a href="#" data-toggle="modal" data-target="#{{ $modalId }}">
    {{ count($subcategories) }}
</a>

<!-- Modal -->
<div class="modal fade" id="{{ $modalId }}" tabindex="-1" role="dialog" aria-labelledby="{{ $modalId }}Label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="{{ $modalId }}Label">{{ $title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                @if(count($subcategories) > 0)
                    <ul class="list-group">
                        @foreach($subcategories as $subcategory)
                            <a href="{{ route('dashboard.category.show', $subcategory->id) }}">
                                <li class="list-group-item">{{ $subcategory->name_ar }}</li>
                            </a>
                        @endforeach
                    </ul>
                @else
                    <p class="text-muted">No subcategories found.</p>
                @endif
            </div>
        </div>
    </div>
</div>
