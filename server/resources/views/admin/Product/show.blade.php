<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body {
            background: #f5f7fa;
            min-height: 100vh;
            padding: 40px 20px;
            color: #2c3e50;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .card-header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-header h1 {
            font-size: 22px;
            margin: 0;
            font-weight: 600;
        }

        .card-body {
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }

        .product-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .details {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
        }

        .detail-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .detail-value {
            color: #2c3e50;
            font-size: 16px;
            line-height: 1.5;
        }

        .detail-value p {
            margin: 0;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-success {
            background: #28a745;
            color: white;
        }

        .badge-primary {
            background: #3498db;
            color: white;
        }

        .btn-group {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            color: white;
            transition: background-color 0.3s ease;
            font-size: 14px;
        }

        .btn-secondary {
            background: #6c757d;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .btn-success {
            background: #28a745;
        }

        .btn-success:hover {
            background: #218838;
        }

        .btn-danger {
            background: #dc3545;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        @media (max-width: 768px) {
            .card-body {
                grid-template-columns: 1fr;
            }
            .card-header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            .btn-group {
                justify-content: center;
                flex-wrap: wrap;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h1>Product ID: 1</h1>
                <div class="btn-group">
                    <a href="#" class="btn btn-secondary">Back to List</a>
                    <button class="btn btn-success">Edit</button>
                    <button class="btn btn-danger">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div>
                    <img src="https://via.placeholder.com/300" alt="Product Image" class="product-image">
                </div>
                <div class="details">
                    <div class="detail-item">
                        <span class="detail-label">Name (English):</span>
                        <div class="detail-value">Sample Product</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Name (Arabic):</span>
                        <div class="detail-value" dir="rtl">منتج عينة</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Price:</span>
                        <div class="detail-value">$19.99</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <div class="detail-value"><span class="badge badge-success">Active</span></div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Availability:</span>
                        <div class="detail-value"><span class="badge badge-primary">In Stock</span></div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Description (English):</span>
                        <div class="detail-value">Short description in English about this sample product.</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Description (Arabic):</span>
                        <div class="detail-value" dir="rtl">وصف قصير بالعربية عن هذا المنتج العينة.</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created At:</span>
                        <div class="detail-value">2025-04-01 10:00:00</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Updated At:</span>
                        <div class="detail-value">2025-04-05 15:30:00</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Button click handlers (for demo purposes)
        document.querySelector('.btn-success').addEventListener('click', () => {
            alert('Edit functionality would be implemented here');
        });

        document.querySelector('.btn-danger').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                alert('Delete functionality would be implemented here');
            }
        });

        document.querySelector('.btn-secondary').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Would navigate back to product list');
        });
    </script>
</body>
</html>
