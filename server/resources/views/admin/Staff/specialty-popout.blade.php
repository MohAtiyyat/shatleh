@if ($specialties && $specialties->isNotEmpty())
    <a href="#" data-toggle="modal" data-target="#specialtyModal-{{ $recordId }}">
        {{ $specialties->first()->name_ar }}
    </a>

    <!-- Modal -->
    <div class="modal fade" id="specialtyModal-{{ $recordId }}" tabindex="-1" role="dialog" aria-labelledby="specialtyModalLabel-{{ $recordId }}" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="specialtyModalLabel-{{ $recordId }}">Specialties</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul>
                        @foreach ($specialties as $specialty)
                            <li>{{ $specialty->name_ar . ' - ' . $specialty->name_en ?? 'N/A' }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
@else
    N/A
@endif
