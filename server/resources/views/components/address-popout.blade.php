@if(!empty($addresses) && count($addresses))
    @php
        $firstAddress = $addresses[0];
        $modalId = 'addressModal-' . ($prefix ?? '') . $firstAddress['id'];
    @endphp

    <!-- Link to trigger modal -->
    <a href="#" data-toggle="modal" data-target="#{{ $modalId }}">
        {{ $firstAddress['title'] ?? ($firstAddress['city'] ?? 'View Addresses') }}
    </a>

    <!-- Modal -->
    <div class="modal fade" id="{{ $modalId }}" tabindex="-1" role="dialog" aria-labelledby="{{ $modalId }}Label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="{{ $modalId }}Label">Addresses</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    @foreach($addresses as $address)
                        <div class="mb-3 p-2 border rounded">
                            <p><strong>Country:</strong> {{ $address['country']['name_en'] ?? ($address['country']['name_ar'] ?? 'N/A') }}</p>
                            <p><strong>City:</strong> {{ $address['city'] ?? 'N/A' }}</p>
                            <p><strong>Address Line:</strong> {{ $address['address_line'] ?? 'N/A' }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endif
