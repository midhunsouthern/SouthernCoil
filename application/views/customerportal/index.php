<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Southerncoil Customer portal</title>

    <!-- Custom fonts for this template -->
    <link href="<?php echo base_url("assets/customerPortal/vendor/fontawesome-free/css/all.min.css") ?>" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="<?php echo base_url("assets/customerPortal/css/sb-admin-2.css") ?>" rel="stylesheet">

    <!-- Custom styles for this page -->
    <link href="<?php echo base_url("assets/customerPortal/vendor/datatables/dataTables.bootstrap4.min.css") ?>" rel="stylesheet">

</head>

<body id="page-top">

    <?php if ($this->session->has_userdata('phone')) : ?>
        <!-- Page Wrapper -->
        <div id="wrapper">
            <?php include('layout/sidebar.php') ?>

            <!-- Content Wrapper -->
            <div id="content-wrapper" class="d-flex flex-column">

                <!-- Main Content -->
                <div id="content">

                    <?php include('layout/header.php') ?>

                    <!-- Begin Page Content -->
                    <div class="container-fluid">
                        <?php include 'pages/' . $page_name . '.php'; ?>
                        <!-- Footer -->
                        <?php include('layout/footer.php') ?>
                    </div>
                    <!-- /.container-fluid -->

                </div>
                <!-- End of Main Content -->

                <!-- Footer -->
                <div class="sticky-footer bg-white">
                    <div class="container my-auto">
                        <div class="copyright text-center my-auto">
                            <span>Copyright &copy; Your Website 2024</span>
                        </div>
                    </div>
                </div>
                <!-- End of Footer -->

            </div>
            <!-- End of Content Wrapper -->

        </div>
        <!-- End of Page Wrapper -->

        <!-- Scroll to Top Button-->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

        <!-- Logout Modal-->
        <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                        <a class="btn btn-primary" href="<?php echo base_url('index.php/login/customer_logout') ?>">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    <?php else : ?>
        <div>
            <div class="card">
                <div class="card-header">
                    <h2>Southern Coil Industries Customer Portal</h2>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-center">
                        <div class="col-6 d-flex justify-content-center">
                            <img src="<?php echo base_url('/assets/img/logos/logo1.png') ?>" class="img-fluid" alt="Responsive image" />
                        </div>
                    </div>
                    <?php echo form_open('login/customer_access') ?>
                    <div class="d-flex justify-content-center">
                        <div class="col-xs-6">
                            <div class="col-12">
                                <div class="form-group">
                                    <input type="text" placeholder="email" name="email" class="form-control form-control-alternative " id="email" required />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="input-group mb-3">
                                    <input type="password" placeholder="Password / OTP" name="password" class="form-control form-control-alternative " required />
                                    <div class="input-group-append">
                                        <input class="btn btn-primary" value="Sent OTP" id="send_otp" type="button" />
                                    </div>
                                </div>
                                <div class="form-group ">

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 d-flex justify-content-center">
                                    <input class="btn btn-primary" value="login" type="submit" />
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- Bootstrap core JavaScript-->
    <script src="<?php echo base_url("assets/customerPortal/vendor/jquery/jquery.min.js") ?>"></script>
    <script src="<?php echo base_url("assets/customerPortal/vendor/bootstrap/js/bootstrap.bundle.min.js") ?>"></script>

    <!-- Core plugin JavaScript-->
    <script src="<?php echo base_url("assets/customerPortal/vendor/jquery-easing/jquery.easing.min.js") ?>"></script>

    <!-- Custom scripts for all pages-->
    <script src="<?php echo base_url("assets/customerPortal/js/sb-admin-2.min.js") ?>"></script>

    <!-- Page level plugins -->
    <script src="<?php echo base_url("assets/customerPortal/vendor/datatables/jquery.dataTables.min.js") ?>"></script>
    <script src="<?php echo base_url("assets/customerPortal/vendor/datatables/dataTables.bootstrap4.min.js") ?>"></script>
    <script src="<?php echo base_url("assets/customerPortal/js/demo/datatables-demo.js") ?>"></script>
    <!-- Page level custom scripts -->
    <script src="<?php echo base_url("assets/customerPortal/js/demo/datatables-demo.js") ?>"></script>
    <script>
        $(document).on("click", "#send_otp", function() {
            var email = $('#email').val();
            if (email.trim() === '') {
                alert("Please Enter email id.")
            } else {
                $.post("<?php echo base_url('index.php/customerMain/send_otp') ?>", {
                        email: email
                    })
                    .done(function(data) {
                        alert(data)
                    })
            }
        });
    </script>
</body>

</html>