<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="index3.html" class="brand-link">
        <!-- will put the logo here when its ready -->
        <span class="brand-text font-weight-light"><b>Shatleh</b> System</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="assets/img/user1-128x128.jpg" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block">Admin</a>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                data-accordion="false">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="home-outline"></ion-icon>
                        <p>Dashboard Home</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="people-outline"></ion-icon>
                        <p>Users Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('product') }}" class="nav-link @yield('Products_Show')">
                        <ion-icon class="nav-icon" name="cube-outline"></ion-icon>
                        <p>Products Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="cart-outline"></ion-icon>
                        <p>Carts Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('customer') }}" class="nav-link @yield('Customers_Show')">
                        <ion-icon class="nav-icon" name="people-outline"></ion-icon>
                        <p>Customers Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="shield-outline"></ion-icon>
                        <p>Roles Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link @yield('Categories_Show')">
                        <ion-icon class="nav-icon" name="file-tray-stacked-outline"></ion-icon>
                        <p>Categories Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="document-text-outline"></ion-icon>
                        <p>Posts Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="star-outline"></ion-icon>
                        <p>Specialties Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="card-outline"></ion-icon>
                        <p>Payments Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link @yield('Services_Show')">
                        <ion-icon class="nav-icon" name="diamond-outline"></ion-icon>
                        <p>Services Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="document-outline"></ion-icon>
                        <p>Logs Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="location-outline"></ion-icon>
                        <p>Addresses Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="wallet-outline"></ion-icon>
                        <p>Payment Info Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="pricetag-outline"></ion-icon>
                        <p>Coupons Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="globe-outline"></ion-icon>
                        <p>Countries Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="storefront-outline"></ion-icon>
                        <p>Product Shops Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('dashboard.Shop') }}" class="nav-link @yield('Shops_Show')">
                        <ion-icon class="nav-icon" name="storefront-outline"></ion-icon>
                        <p>Shops Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link @yield('Orders_Show')">
                        <ion-icon class="nav-icon" name="bag-handle-outline"></ion-icon>
                        <p>Orders Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="list-outline"></ion-icon>
                        <p>Order Details Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="help-outline"></ion-icon>
                        <p>Service Requests Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="grid-outline"></ion-icon>
                        <p>Category Products Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="pricetags-outline"></ion-icon>
                        <p>Coupon Products Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link @yield('Experts_Show')">
                        <ion-icon class="nav-icon" name="ribbon-outline"></ion-icon>
                        <p>Expert Specialty Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <ion-icon class="nav-icon" name="chatbubble-outline"></ion-icon>
                        <p>Reviews Management</p>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    <!-- /.sidebar -->
</aside>
