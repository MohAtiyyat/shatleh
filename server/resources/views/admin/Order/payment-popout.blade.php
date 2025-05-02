<button type="button" class="btn btn-sm btn-info" data-toggle="modal" data-target="#paymentModal{{ $payment->id }}">
    View
</button>

<div class="modal fade" id="paymentModal{{ $payment->id }}" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Payment Info</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>ID:</strong> {{ $payment->id }}</p>
                <p><strong>Method:</strong> {{ $payment->method ?? 'N/A' }}</p>
                <p><strong>Status:</strong> {{ ucfirst($payment->status ?? 'N/A') }}</p>
                <p><strong>Amount:</strong> ${{ number_format($payment->amount / 100, 2) }}</p>
                <p><strong>Paid At:</strong> {{ $payment->created_at }}</p>
            </div>
        </div>
    </div>
</div>
