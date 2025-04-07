<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="" class="brand-link">
      <img src="../images/../images/logo.png" alt=" " class="brand-image img-circle elevation-3" style="opacity: .8">
      <span class="brand-text font-weight-light">ATTAR JO</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img width="37px" height="37px" style="height: 37px" src="" class="img-circle elevation-2" alt="">
        </div>
        <div class="info">
          <a href="#" class="d-block"></a>
        </div>
      </div>


      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item menu-open">
            <a href="" class="nav-link @yield('Dashboard')">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
                <i class="right fas "></i>
              </p>
            </a>
          </li>

          {{-- _______________________________________ --}}

          <li class="nav-item">
            <a href="#" class="nav-link @yield('Orders') ">
              <i class="nav-icon far fa-calendar-alt"></i>
              <p>
                Orders                <i class="fas fa-angle-left right"></i>
                {{-- <span class="badge badge-info right">{{$todayReservation}}</span> --}}
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="" class="nav-link @yield('Orders')">

                  <i class="far fa-circle nav-icon"></i>
                  <p>Show</p>
                </a>
              </li>
              {{-- <li class="nav-item">
                <a href="pages/layout/top-nav-sidebar.html" class="nav-link @yield('ReservationEdite')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Edite</p>
                </a>
              </li> --}}
            </ul>

          </li>
             {{-- _______________________________________ --}}
          <li class="nav-item">
            <a href="#" class="nav-link @yield('productsShow') @yield('productsCreate')">
              <i class="nav-icon far fa-star"></i>
              <p>
                Product
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityShow')"> --}}
                <a href="" class="nav-link @yield('productsShow')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show Product</p>
                </a>
              </li>

              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityCreate')"> --}}
                <a href="/" class="nav-link @yield('productsCreate')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Add Product</p>
                </a>
              </li>
            </ul>

          </li>
             {{-- _______________________________________ --}}
          <li class="nav-item">
            <a href="#" class="nav-link @yield('CategoryShow') @yield('CategoryCreate')">
              <i class="nav-icon far fa-star"></i>
              <p>
                Category
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityShow')"> --}}
                <a href="" class="nav-link @yield('CategoryShow')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show Category</p>
                </a>
              </li>

              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityCreate')"> --}}
                <a href="" class="nav-link @yield('CategoryCreate')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Add Category</p>
                </a>
              </li>
            </ul>
          </li>
          {{-- _______________________________________ --}}
             {{-- _______________________________________ --}}
          <li class="nav-item">
            <a href="" class="nav-link @yield('comments') ">
              <i class="nav-icon far fa-star"></i>
              <p>
                Reviws
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityShow')"> --}}
                <a href="" class="nav-link @yield('comments')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show Reviws</p>
                </a>
              </li>
            </ul>
          </li>
          {{-- _______________________________________ --}}
             {{-- _______________________________________ --}}
          <li class="nav-item">
            <a href="#" class="nav-link @yield('discount') ">
              <i class="nav-icon far fa-star"></i>
              <p>
                DISCOUNT
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityShow')"> --}}
                <a href="" class="nav-link @yield('discount')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show DISCOUNT TABLE</p>
                </a>
              </li>
            </ul>
          </li>
          {{-- _______________________________________ --}}
             {{-- _______________________________________ --}}

          <li class="nav-item">
            <a href="#" class="nav-link @yield('Show_posts') @yield('Add_post')">
              <i class="nav-icon far fa-star"></i>
              <p>
                Blog
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityShow')"> --}}
                <a href="" class="nav-link @yield('Show_posts')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show posts</p>
                </a>
              </li>

              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('ActivityCreate')"> --}}
                <a href="" class="nav-link @yield('Add_post')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Add post</p>
                </a>
              </li>
            </ul>
          </li>
          {{-- _______________________________________ --}}
          <li class="nav-item">
            <a href="#" class="nav-link @yield('UsersShow')">
              <i class="nav-icon fas fa-users"></i>
              <p>
                Users
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                {{-- <a href="" class="nav-link @yield('UsersShow')"> --}}
                <a href="" class="nav-link @yield('UsersShow')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show</p>
                </a>
              </li>



            </ul>
          </li>
           {{-- _______________________________________ --}}
          {{-- _______________________________________ --}}

           {{-- _______________________________________ --}}

           <li class="nav-item">
            <a href="#" class="nav-link @yield('ContactShow')">
              <i class="nav-icon fas fa-comments"></i>
              <p>
                Contact
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="" class="nav-link @yield('ContactShow')">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Show</p>
                </a>
              </li>
            </ul>
          </li>
          {{-- _______________________________________ --}}
          <li class="nav-header"></li>
          <li class="nav-item">
            <a href="" class="nav-link @yield('Users')">
              <i class="nav-icon fas fa-edit"></i>
              <p>Add New Admin</p>
            </a>
          </li>
          <li class="nav-item">
            <a href="" class="nav-link @yield('UsersShow')">
              <i class="nav-icon fas fa-users"></i>
              <p>
                Edit Profile
                {{-- <i class="fas fa-angle-left right"></i> --}}
              </p>
            </a>

          </li>
          <li class="nav-item">
            <a href="" class="nav-link">
              <i class="nav-icon far fa-circle text-danger"></i>
              <p class="text">Logout</p>
            </a>
          </li>
          {{-- _______________________________________ --}}

        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
