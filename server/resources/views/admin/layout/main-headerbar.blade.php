<nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
        <!-- Logout Button -->
        <li class="nav-item d-none d-sm-inline-block ml-2 mr-2 ">
            <form action="{{ route('dashboard.logout') }}" method="POST">
                @csrf
                <button type="submit" class="nav-link border-0 bg-transparent " role="button">
                    <i class="fas fa-sign-out-alt"></i>
                </button>


            </form>
        </li>
    </ul>
</nav>
