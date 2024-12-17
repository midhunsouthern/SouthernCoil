<?php
$order_data = $this->cm->customerBasedOrderlist($param1, $param2, $param3)[0];
$pipeBending = '';
if ($order_data['pbStraight'] == 'true') {
    $pipeBending = $pipeBending  . ' ' . 'Straight';
}
if ($order_data['pbSingle'] == 'true') {
    $pipeBending = $pipeBending  . ' ' . 'Single';
}
if ($order_data['pbCross'] == 'true') {
    $pipeBending = $pipeBending  . ' ' . 'Cross';
}
if ($order_data['pbOther'] == 'true') {
    $pipeBending = $pipeBending  . ' ' . 'Other';
}

?>

<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <table class="table table-bordered">
                <tr>
                    <th>Order No</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Size</th>
                    <th>Sq Feet</th>
                </tr>
                <tr>
                    <td><?php echo $order_data['order_id'] ?></td>
                    <td><?php echo $order_data['order_date'] ?></td>
                    <td><?php echo $order_data['full_customer_name'] ?></td>
                    <td><?php echo $order_data['size'] ?></td>
                    <td><?php echo $order_data['sq_feet'] ?></td>

                </tr>
            </table>
            <h5>End Plate</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <td>Material</td>
                        <td><?php echo $order_data['end_plate_material'] ?></td>
                    </tr>
                    <tr>
                        <td>Model</td>
                        <td><?php echo $order_data['end_plate_modal'] ?></td>
                    </tr>
                    <tr>
                        <td>Orientation</td>
                        <td><?php echo $order_data['end_plate_orientation'] ?></td>
                    </tr>
                    <tr>
                        <td>Cover Type</td>
                        <td><?php echo $order_data['cover_detail'] ?></td>
                    </tr>
                </table>
            </div>
            <h5>Pipe</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <td>Pipe Type</td>
                        <td><?php echo $order_data['pipe_type'] ?></td>
                    </tr>
                    <tr>
                        <td>Pipe Bend</td>
                        <td><?php echo $pipeBending ?></td>
                    </tr>
                </table>
            </div>
            <h5>Fins</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <td>Fin Per Inch</td>
                        <td><?php echo $order_data['fin_per_inch'] ?></td>
                    </tr>
                    <tr>
                        <td>Fin Thickness</td>
                        <td><?php echo $this->cm->getThickValue($order_data['fin_per_inch']) ?></td>
                    </tr>
                </table>
            </div>
            <h5>Brazing</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <td>Circuit Model</td>
                        <td><?php echo $order_data['circuit_models'] ?></td>
                    </tr>
                    <tr>
                        <td>No of Circuit</td>
                        <td><?php echo $order_data['circuit_no'] ?></td>
                    </tr>
                    <tr>
                        <td>Liquid Line</td>
                        <td><?php echo $order_data['liquid_line'] ?></td>
                    </tr>
                    <tr>
                        <td>Discharge Line</td>
                        <td><?php echo $order_data['discharge_line'] ?></td>
                    </tr>
                </table>
            </div>
            <h5>Painting, Packing and Dispatch</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <td>Paint</td>
                        <td><?php echo $order_data['paint'] ?></td>
                    </tr>
                    <tr>
                        <td>Packing</td>
                        <td><?php echo $order_data['packing_type'] ?></td>
                    </tr>
                    <tr>
                        <td>Dispatch</td>
                        <td><?php echo $order_data['dispatch_mode'] ?></td>
                    </tr>
                </table>
            </div>
            <h5>Painting, Packing and Dispatch</h5>
            <div class="col">
                <table class="table table-bordered">
                    <tr>
                        <th>Process</th>
                        <th>Date & Time</th>
                    </tr>
                    <tr>
                        <td>CNC Nesting</td>
                        <td><?php echo $order_data['cnc_nesting_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>CNC Program Created </td>
                        <td><?php echo $order_data['cnc_punching_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>CNC end plate punching </td>
                        <td><?php echo $order_data['ep_DateTime'] ?></td>
                    </tr>
                    <tr>
                        <td>End plate bending</td>
                        <td><?php echo $order_data['bending_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Tray/Pan Cover Bending </td>
                        <td><?php echo $order_data['bending_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Copper tube Cutting</td>
                        <td><?php echo $order_data['tcutting_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Copper tube Bending</td>
                        <td><?php echo $order_data['tcutting_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Fins Punching</td>
                        <td><?php echo $order_data['finpunch_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Coil Assembly</td>
                        <td><?php echo $order_data['ca_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Coil Expansion</td>
                        <td><?php echo $order_data['ce_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Coil Breaking & Leak Testing</td>
                        <td><?php echo $order_data['brazing_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Painting</td>
                        <td><?php echo $order_data['pp_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Packing</td>
                        <td><?php echo $order_data['pp_status_dt'] ?></td>
                    </tr>
                    <tr>
                        <td>Dispatch</td>
                        <td><?php echo $order_data['dispatch_status_dt'] ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>