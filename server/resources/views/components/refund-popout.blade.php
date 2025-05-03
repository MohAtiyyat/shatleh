@props([
    'payment' => null,
    'title' => 'Refund Details'
])

<div>
    <button type="button" class="btn btn-sm btn-info" data-toggle="modal" data-target="#refundModal{{ $payment->id }}">
        <i class="fas fa-info-circle"></i> View Refund
    </button>

    <div class="modal fade" id="refundModal{{ $payment->id }}" tabindex="-1" role="dialog" aria-labelledby="refundModalLabel{{ $payment->id }}" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="refundModalLabel{{ $payment->id }}">{{ $title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    @if ($payment->refund_status !== 'fully_refunded')
                        <p><strong>Paid by Us:</strong> {{ $payment->amount_paid_by_us ?? 0 }}</p>
                        <p><strong>Paid by Customer:</strong> {{ $payment->amount_paid_by_customer ?? 0 }}</p>
                        <p><strong>Total Amount:</strong> {{ $payment->amount }}</p>
                        <p><strong>Refund Status:</strong> {{ $payment->refund_status }}</p>
                    @else
                        <p>This payment has been fully refunded.</p>
                    @endif
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
