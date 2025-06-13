<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="{{ asset('assets/logo.png') }}" type="image/x-icon">
    @include('admin.layout.head')
</head>

<body class="hold-transition sidebar-mini">
    <div class="wrapper">

        <!-- Navbar -->
        @include('admin.layout.main-headerbar')
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        @include('admin.layout.main-sidebar')


        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper p-2">
            <!-- Content Header (Page header) -->


            @yield('content')
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->

        @include('admin.layout.footer')

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->

    @include('admin.layout.footer-scripts')
</body>

</html>
