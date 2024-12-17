<?php $customer_id = $this->session->userdata('customer_row_id') ?>
<!-- Page Heading -->
<div class="row">
    <div class="col-6">
        <h1 class="h3 mb-2 text-gray-800">Order Status</h1>
        <p class="mb-4">Your list of the order list.</p>
    </div>
</div>


<ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-toggle="tab" data-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Live Orders</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-toggle="tab" data-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">History Orders</button>
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Live Orders</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th class="text-center">Order no.</th>
                                <th class="text-center">Order Date</th>
                                <th class="text-center">Name</th>
                                <th class="text-center">Size</th>
                                <th class="text-center">Sq ft</th>
                                <th class="text-center">Completed %</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Est Delievery Date</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($this->cm->customerBasedOrderlist($customer_id, 'live', '') as $row) : ?>
                                <tr>
                                    <td class="text-center"><?php echo $row['order_id'] ?></td>
                                    <td class="text-center"><?php echo $row['order_date'] ?></td>
                                    <td><?php echo $row['full_customer_name'] ?></td>
                                    <td><?php echo $row['size'] ?></td>
                                    <td class="text-center"><?php echo $row['sq_feet'] ?></td>
                                    <td class="text-center"><?php echo $row['status_cent'] ?></td>
                                    <td><?php echo $this->load->view('customerportal/component/statusBar', array('row_data' => $row), TRUE)  ?></td>
                                    <td class="text-center"><?php echo $row['est_delivery_date'] ?></td>
                                    <td>
                                        <div class="row offset-2">
                                            <div class="col-1"><a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" onclick="largeModal('<?php echo base_url('index.php/customerMain/modalView/order_view/' . $customer_id . '/live/' . $row['id']) ?>', 'Order View')"><i class="fa fa-eye"></i></a></div>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">History Orders</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th class="text-center">Order no.</th>
                                <th class="text-center">Order Date</th>
                                <th class="text-center">Name</th>
                                <th class="text-center">Size</th>
                                <th class="text-center">Sq ft</th>
                                <th class="text-center">Completed %</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Est Delievery Date</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($this->cm->customerBasedOrderlist($customer_id, 'history', '') as $row) : ?>
                                <tr>
                                    <td class="text-center"><?php echo $row['order_id'] ?></td>
                                    <td class="text-center"><?php echo $row['order_date'] ?></td>
                                    <td><?php echo $row['full_customer_name'] ?></td>
                                    <td><?php echo $row['size'] ?></td>
                                    <td class="text-center"><?php echo $row['sq_feet'] ?></td>
                                    <td class="text-center"><?php echo $row['status_cent'] ?></td>
                                    <td><?php echo $this->load->view('customerportal/component/statusBar', array('row_data' => $row), TRUE)  ?></td>
                                    <td class="text-center"><?php echo $row['est_delivery_date'] ?></td>
                                    <td>
                                        <div class="row offset-2">
                                            <div class="col-1"><a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" onclick="largeModal('<?php echo base_url('index.php/customerMain/modalView/order_view/' . $customer_id . '/history/' . $row['id']) ?>', 'Order View')"><i class="fa fa-eye"></i></a></div>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>