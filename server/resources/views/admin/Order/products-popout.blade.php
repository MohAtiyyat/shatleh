<!-- Button to trigger the products modal -->
<button type="button" class="btn btn-sm btn-info" data-toggle="modal" data-target="#productsModal{{ $order->id }}">
    View Products
</button>

<!-- Products Modal -->
<div class="modal fade" id="productsModal{{ $order->id }}" tabindex="-1" role="dialog" aria-labelledby="productsModalLabel{{ $order->id }}" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header bg-gradient-success text-white">
                <h5 class="modal-title" id="productsModalLabel{{ $order->id }}">Products in Order #{{ $order->id }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                @if($order->products && $order->products->count() > 0)
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->products as $product)
                                <tr>
                                    <td>{{ $product->name['en'] ?? 'N/A' }}</td>
                                    <td>{{ $product->pivot->quantity ?? 1 }}</td>
                                    <td>${{ number_format(($product->price ?? 0) / 100, 2) }}</td>
                                    <td>${{ number_format((($product->price ?? 0) * ($product->pivot->quantity ?? 1)) / 100, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class="text-right mt-3">
                        <h6><strong>Total Amount:</strong> ${{ number_format($order->products->sum(function($product) { return ($product->price * $product->pivot->quantity) / 100; }), 2) }}</h6>
                    </div>
                @else
                    <p class="text-muted">No products found for this order.</p>
                @endif
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>