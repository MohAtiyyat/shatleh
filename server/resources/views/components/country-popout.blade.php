@props([
    'countries' => [],
    'couponId' => null,
    'title' => 'Country List'
])

<div>
    <button type="button" class="btn btn-sm btn-info" data-toggle="modal" data-target="#countryModal{{ $couponId }}">
        <i class="fas fa-globe"></i> View Country
    </button>

    <div class="modal fade" id="countryModal{{ $couponId }}" tabindex="-1" role="dialog" aria-labelledby="countryModalLabel{{ $couponId }}" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="countryModalLabel{{ $couponId }}">{{ $title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    @if (empty($countries) || $countries[0] === null)
                        <p>No country assigned to this coupon.</p>
                    @else
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name (EN)</th>
                                    <th>Name (AR)</th>
                                    <th>Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($countries as $index => $country)
                                    <tr>
                                        <td>{{ $index + 1 }}</td>
                                        <td>{{ $country->name_en }}</td>
                                        <td>{{ $country->name_ar }}</td>
                                        <td>{{ $country->code }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
