<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login</title>
  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../assets/plugins/fontawesome-free/css/all.min.css">
  <!-- icheck bootstrap -->
  <link rel="stylesheet" href="../assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../assets/css/adminlte.min.css">
  <style>
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Source Sans Pro', sans-serif;
    }
    .login-box {
      max-width: 400px;
      width: 100%;
      transition: transform 0.3s ease;
    }
    .login-box:hover {
      transform: translateY(-5px);
    }
    .card {
      border-radius: 1rem;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .form-control:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
    .btn-primary {
      background-color: #4f46e5;
      border-color: #4f46e5;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .btn-primary:hover {
      background-color: #4338ca;
      border-color: #4338ca;
      transform: translateY(-2px);
    }
    .input-group-text {
      background-color: #f8f9fa;
    }
  </style>
</head>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="card card-outline card-primary">
    <div class="card-header text-center py-4">
      <a href="#" class="d-flex align-items-center justify-content-center">
        <h1 class="h3 mb-0"><b>Shatleh</b></h1>
      </a>
    </div>
    <div class="card-body">
      <form action="{{ route('dashboard.login') }}" method="post">
        @csrf
        <div class="input-group mb-3">
          <input type="email" name="email" class="form-control" placeholder="Email" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-envelope"></span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input type="password" name="password" class="form-control" placeholder="Password" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock"></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <button type="submit" class="btn btn-primary btn-block">Sign In</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</body>
</html>
