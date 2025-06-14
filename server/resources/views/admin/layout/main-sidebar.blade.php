<aside class="main-sidebar layout-fixed sidebar-dark-primary elevation-4" style="position: fixed;">
    <a href="{{ route('dashboard.home') }}" class="brand-link">
        <span class="brand-text font-weight-light"><b>Shatleh</b> System</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar" style="position: sticky; top: 0; height: 90vh; overflow-y: auto;">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                @if (auth()->user()->hasRole('Admin'))
                <li class="nav-item">
                    <a href="{{route('dashboard.home')}}" class="nav-link @yield('dashboard_show')">
                        <ion-icon class="nav-icon" name="home-outline"></ion-icon>
                        <p>Dashboard Home</p>
                    </a>
                </li>
                @endif
                 @if (auth()->user()->hasAnyRole('Admin|Employee'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.staff') }}" class="nav-link @yield('Staff_Show')">
                        <ion-icon class="nav-icon" name="people-outline"></ion-icon>
                        <p>Staff Management</p>
                    </a>
                </li>
                @endif
                <li class="nav-item">
                    <a href="{{ route('dashboard.product') }}" class="nav-link @yield('Products_Show')">
                        <ion-icon class="nav-icon" name="cube-outline"></ion-icon>
                        <p>Products Management</p>
                    </a>
                </li>
                @if (auth()->user()->hasAnyRole('Admin|Employee'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.customer.index') }}" class="nav-link @yield('Customers_Show')">
                        <ion-icon class="nav-icon" name="people-outline"></ion-icon>
                        <p>Customers Management</p>
                    </a>
                </li>
                @endif
                <li class="nav-item">
                    <a href="{{route('dashboard.category')}}" class="nav-link @yield('Categories_Show')">
                        <ion-icon class="nav-icon" name="file-tray-stacked-outline"></ion-icon>
                        <p>Categories Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('dashboard.post.index') }}" class="nav-link @yield('Posts_Show')">
                        <ion-icon class="nav-icon" name="document-text-outline"></ion-icon>
                        <p>Posts Management</p>
                    </a>
                </li>
                    @if (auth()->user()->hasAnyRole('Admin|Employee'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.specialties.index') }}" class="nav-link @yield('Specialties_Show')">
                        <ion-icon class="nav-icon" name="star-outline"></ion-icon>
                        <p>Specialties Management</p>
                    </a>
                </li>
                @endif
                <li class="nav-item">
                    <a href="{{ route('dashboard.service') }}" class="nav-link @yield('Services_Show')">
                        <ion-icon class="nav-icon" name="diamond-outline"></ion-icon>
                        <p>Services Management</p>
                    </a>
                </li>
                @if (auth()->user()->hasRole('Admin'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.logs.index') }}" class="nav-link @yield('Logs_Show')">
                        <ion-icon class="nav-icon" name="document-outline"></ion-icon>
                        <p>Logs Management</p>
                    </a>
                </li>
                @endif
                @if (auth()->user()->hasAnyRole('Admin|Employee'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.coupon.index') }}" class="nav-link @yield('Coupon_Show')">
                        <ion-icon class="nav-icon" name="pricetag-outline"></ion-icon>
                        <p>Coupons Management</p>
                    </a>
                </li>
                @endif
                <li class="nav-item">
                    <a href="{{ route('dashboard.productShop') }}" class="nav-link @yield('ProductShop_Show')">
                        <ion-icon class="nav-icon" name="storefront-outline"></ion-icon>
                        <p>Products in Shops</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('dashboard.shop') }}" class="nav-link @yield('Shops_Show')">
                        <ion-icon class="nav-icon" name="storefront-outline"></ion-icon>
                        <p>Shops Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('dashboard.order') }}" class="nav-link @yield('Order_Show')">
                        <ion-icon class="nav-icon" name="bag-handle-outline"></ion-icon>
                        <p>Orders Management</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="{{ route('dashboard.service-request.index') }}" class="nav-link @yield('ServiceRequests_Show')">
                        <ion-icon class="nav-icon" name="help-outline"></ion-icon>
                        <p>Service Requests</p>
                    </a>
                </li>
                @if (auth()->user()->hasRole('Admin|Employee'))
                <li class="nav-item">
                    <a href="{{ route('dashboard.review.index') }}" class="nav-link @yield('Review_Show')">
                        <ion-icon class="nav-icon" name="chatbubble-outline"></ion-icon>
                        <p>Reviews Management</p>
                    </a>
                </li>
                @endif
            </ul>
        </nav>
    </div>
    <!-- /.sidebar -->
</aside>
