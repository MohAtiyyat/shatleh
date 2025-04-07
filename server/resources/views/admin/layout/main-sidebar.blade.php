<aside class="main-sidebar sidebar-dark-primary elevation-4">
  <!-- Brand Logo -->
  <a href="index3.html" class="brand-link">
    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
    <span class="brand-text font-weight-light">Shatleh System</span>
  </a>

  <!-- Sidebar -->
  <div class="sidebar">
    <!-- Sidebar user panel (optional) -->
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      <div class="image">
        <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
      </div>
      <div class="info">
        <a href="#" class="d-block">Admin</a>
      </div>
    </div>

    

    <!-- Sidebar Menu -->
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <!-- Add icons to the links using the .nav-icon class
             with font-awesome or any other icon font library -->
        <!--<li class="nav-item menu-open">
          <a href="#" class="nav-link active">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>
              Starter Pages
              <i class="right fas fa-angle-left"></i>
            </p>
          </a>
          <ul class="nav nav-treeview">
            <li class="nav-item">
              <a href="#" class="nav-link active">
                <i class="far fa-circle nav-icon"></i>
                <p>Active Page</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="far fa-circle nav-icon"></i>
                <p>Inactive Page</p>
              </a>
            </li>
          </ul>
        </li>-->
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Products_Show')">
            <ion-icon class="nav-icon" name="cube-outline"></ion-icon>
            <p>
              Products
              <!--<span class="right badge badge-danger">New</span>-->
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Categories_Show')">
            <ion-icon class="nav-icon" name="file-tray-stacked-outline"></ion-icon>
            <p>
              Categories
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Customers_Show')">
            <ion-icon class="nav-icon" name="people-outline"></ion-icon>
            <p>
              Customers
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Experts_Show')">
            <ion-icon class="nav-icon" name="ribbon-outline"></ion-icon>
            <p>
              Experts
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Employees_Show')">
            <ion-icon class="nav-icon" name="man-outline"></ion-icon>
            <p>
              Employees
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Shops_Show')">
            <ion-icon class="nav-icon" name="storefront-outline"></ion-icon>
            <p>
              Gardening Shops
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Orders_Show')">
            <ion-icon class="nav-icon" name="bag-handle-outline"></ion-icon>
            <p>
              Orders
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Services_Show')">
            <ion-icon class="nav-icon" name="diamond-outline"></ion-icon>
            <p>
              Services                
            </p>
          </a>
        </li> 
        <li class="nav-item">
          <a href="#" class="nav-link @yield('Education_Content_Show')">
            <ion-icon class="nav-icon" name="library-outline"></ion-icon>
            <p>
              Educational Posts                
            </p>
          </a>
        </li>         
      </ul>
    </nav>    
  </div>
  <!-- /.sidebar -->
</aside>




<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>