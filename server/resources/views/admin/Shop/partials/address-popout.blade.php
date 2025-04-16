<a href="#" data-toggle="modal" data-target="#addressModal-{{ $address['id'] }}">
    {{ $address['title'] }}
</a>

<!-- Modal -->
<div class="modal fade" id="addressModal-{{ $address['id'] }}" tabindex="-1" role="dialog" aria-labelledby="addressModalLabel-{{ $address['id'] }}" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addressModalLabel-{{ $address['id'] }}">Address Details</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p><strong>Country:</strong> {{ $address['country'] }}</p>
        <p><strong>City:</strong> {{ $address['city'] }}</p>
        <p><strong>Address Line:</strong> {{ $address['address_line'] }}</p>
      </div>
    </div>
  </div>
</div>
