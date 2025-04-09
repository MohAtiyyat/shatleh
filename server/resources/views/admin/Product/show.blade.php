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
            font-family: 'Segoe UI', Arial, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            color: #2c3e50;
            line-height: 1.6;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            animation: fadeIn 0.5s ease-in;
        }

        .card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card-header {
            background: linear-gradient(to right, #2c3e50, #4a6278);
            color: white;
            padding: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .card-header h1 {
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .card-body {
            padding: 40px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 40px;
            background: #fafafa;
        }

        .product-image {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            cursor: zoom-in;
        }

        .product-image:hover {
            transform: scale(1.05);
        }

        .details {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .detail-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
        }

        .detail-item:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        }

        .detail-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-value {
            color: #2c3e50;
            font-size: 16px;
            word-wrap: break-word;
        }

        .badge {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            transition: transform 0.2s ease;
        }

        .badge:hover {
            transform: scale(1.1);
        }

        .badge-success { background: #28a745; color: white; }
        .badge-primary { background: #3498db; color: white; }
        .badge-warning { background: #f1c40f; color: #2c3e50; }

        .btn-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
        }

        .btn:hover::after {
            width: 200%;
            height: 200%;
        }

        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #5a6268; }
        .btn-success { background: #28a745; }
        .btn-success:hover { background: #218838; }
        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #c82333; }

        .status-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @media (max-width: 768px) {
            .card-body {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            .card-header {
                flex-direction: column;
                gap: 20px;
                text-align: center;
                padding: 20px;
            }
            .btn {
                padding: 10px 20px;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h1>Product ID: 1 - Sample Product</h1>
                <div class="btn-group">
                    <a href="#" class="btn btn-secondary">Back to Dashboard</a>
                    <button class="btn btn-success">Edit Product</button>
                    <button class="btn btn-danger">Delete Product</button>
                </div>
            </div>
            <div class="card-body">
                <div>
                    <img src="https://via.placeholder.com/300" alt="Product Image" class="product-image">
                </div>
                <div class="details">
                    <div class="detail-item">
                        <span class="detail-label">Name (English)</span>
                        <div class="detail-value">Sample Product</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Name (Arabic)</span>
                        <div class="detail-value" dir="rtl">منتج عينة</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Price</span>
                        <div class="detail-value">$19.99</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Description (English)</span>
                        <div class="detail-value">Short description in English about this sample product.</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Description (Arabic)</span>
                        <div class="detail-value" dir="rtl">وصف قصير بالعربية عن هذا المنتج العينة.</div>
                    </div>
                    <div class="detail-item status-section">
                        <span class="detail-label">Status</span>
                        <div class="detail-value">
                            <span class="badge badge-success">Active</span>
                            <span class="badge badge-primary" style="margin-left: 10px;">In Stock</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Inventory</span>
                        <div class="detail-value">150 units <span class="badge badge-warning" style="margin-left: 10px;">Low Stock Alert</span></div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created</span>
                        <div class="detail-value">2025-04-01 10:00:00</div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated</span>
                        <div class="detail-value">2025-04-05 15:30:00</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Enhanced button handlers
        const editBtn = document.querySelector('.btn-success');
        const deleteBtn = document.querySelector('.btn-danger');
        const backBtn = document.querySelector('.btn-secondary');
        const productImage = document.querySelector('.product-image');

        editBtn.addEventListener('click', () => {
            editBtn.textContent = 'Loading...';
            setTimeout(() => {
                alert('Redirecting to edit page...');
                editBtn.textContent = 'Edit Product';
            }, 1000);
        });

        deleteBtn.addEventListener('click', async () => {
            const confirmation = await customConfirm('Delete Product', 'Are you sure you want to delete this product? This action cannot be undone.');
            if (confirmation) {
                deleteBtn.textContent = 'Deleting...';
                setTimeout(() => {
                    alert('Product deleted successfully');
                    deleteBtn.textContent = 'Delete Product';
                }, 1000);
            }
        });

        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            backBtn.textContent = 'Redirecting...';
            setTimeout(() => {
                alert('Returning to dashboard...');
                backBtn.textContent = 'Back to Dashboard';
            }, 500);
        });

        // Image zoom functionality
        productImage.addEventListener('click', () => {
            productImage.classList.toggle('zoomed');
        });

        // Custom confirmation dialog
        function customConfirm(title, message) {
            return new Promise((resolve) => {
                const existingDialog = document.querySelector('.confirm-dialog');
                if (existingDialog) existingDialog.remove();

                const dialog = document.createElement('div');
                dialog.className = 'confirm-dialog';
                dialog.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                `;

                dialog.innerHTML = `
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="btn btn-secondary" style="margin-right: 10px;" onclick="this.closest('.confirm-dialog').remove();resolve(false)">Cancel</button>
                        <button class="btn btn-danger" onclick="this.closest('.confirm-dialog').remove();resolve(true)">Confirm</button>
                    </div>
                `;
                document.body.appendChild(dialog);
            });
        }
    </script>
</body>
</html>
