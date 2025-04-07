<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Product</title>
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
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
        }

        .form-container {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #2c3e50;
        }

        input[type="text"],
        input[type="file"],
        select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        input[type="text"]:focus,
        select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .input-group {
            position: relative;
        }

        .custom-file {
            position: relative;
        }

        .custom-file-input {
            opacity: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        .custom-file-label {
            display: block;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #fff;
            color: #666;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .footer {
            padding: 20px;
            background: #f8f9fa;
            text-align: right;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .btn-primary {
            background: #3498db;
            color: white;
        }

        .btn-primary:hover {
            background: #2980b9;
        }

        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            .container {
                margin: 0 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Create New Product</h1>
        </div>

        <div class="form-container">
            <form id="productForm" enctype="multipart/form-data">
                <div class="form-row">
                    <div class="form-group">
                        <label for="name_en">Name (English) *</label>
                        <input type="text" id="name_en" name="name_en" required placeholder="Enter English name">
                    </div>
                    <div class="form-group">
                        <label for="name_ar">Name (Arabic) *</label>
                        <input type="text" id="name_ar" name="name_ar" required placeholder="Enter Arabic name" dir="rtl">
                    </div>
                </div>

                <div class="form-group">
                    <label for="price">Price *</label>
                    <input type="text" id="price" name="price" required placeholder="Enter price (e.g., 99.99)">
                </div>

                <div class="form-group">
                    <label>Image *</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="image" name="image" required>
                            <label class="custom-file-label" for="image">Choose product image</label>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="description_en">Description (English) *</label>
                        <input type="text" id="description_en" name="description_en" required placeholder="Enter English description">
                    </div>
                    <div class="form-group">
                        <label for="description_ar">Description (Arabic) *</label>
                        <input type="text" id="description_ar" name="description_ar" required placeholder="Enter Arabic description" dir="rtl">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="status">Status *</label>
                        <select id="status" name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="availability">Availability *</label>
                        <select id="availability" name="availability" required>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="pre_order">Pre-order</option>
                        </select>
                    </div>
                </div>

                <div class="footer">
                    <button type="submit" class="btn btn-primary">Create Product</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Update file input label
        document.getElementById('image').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || 'Choose product image';
            document.querySelector('.custom-file-label').textContent = fileName;
        });

        // Form submission handler
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            console.log('Product Data:', Object.fromEntries(formData));
            alert('Product created successfully! Check console for form data.');
        });
    </script>
</body>
</html>
