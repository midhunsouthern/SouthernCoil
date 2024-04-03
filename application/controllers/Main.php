<?php

defined('BASEPATH') or exit('No direct script access allowed');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

class Main extends CI_Controller
{
    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     * 	- or -
     * 		http://example.com/index.php/welcome/index
     * 	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see https://codeigniter.com/user_guide/general/urls.html
     * status code : 101 - Access code not correct
     * status code : 200 - Retrival Successful
     */

    public function __construct()
    {
        parent::__construct();
        $this->db->query("SET time_zone='+5:30'");
        $this->load->helper('image');
    }
    public function index()
    {
        return true;
    }

    public function access_type_list()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $ret_data['data'] = json_encode($this->db->get('access_types')->result_array());
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function getProfileData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $ret_data['data_access_type'] = $this->db->get('access_types')->result_array();
        $ret_data['data_profile'] = $this->db->get_where('access_profile', array('access_code' => $this->input->post('authId')))->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function setProfileData()
    {

        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $access_code = $this->input->post('authId');
        unset($_POST['authId']);
        $data = $this->mm->arrayToDataArray($_POST);

        $this->db->where('access_code', $access_code);
        $this->db->update('access_profile', $data);
        if ($this->db->affected_rows() == 1) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Profile Update Successfully';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Profile update UnSuccessful';
        }
        echo json_encode($ret_data);
    }

    public function getUsersData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $this->db->select('id, fname, email, dob, mobile_no,emp_no, profile_image, username, access_type ');
        $ret_data['User_data'] = $this->db->get('access_profile')->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = 'Users Retrival Successful';
        echo json_encode($ret_data);
    }

    public function setNewProfileData()
    {

        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $ret_data['status_code'] = 201;
        $ret_data['status_msg'] = 'Profile update UnSuccessful';

        $type = $this->input->post('type');
        unset($_POST['authId']);
        unset($_POST['type']);
        $data = $this->mm->arrayToDataArray($_POST);
        if ($type == 'Delete') {
            $this->db->where('id', $data['id']);
            $this->db->delete('access_profile');
        } else if ($type == 'Edit') {
            unset($_POST['type']);
            $this->db->where('id', $data['id']);
            $this->db->update('access_profile', $data);
        } else {
            $this->db->insert('access_profile', $data);
        }

        if ($this->db->affected_rows() == 1) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Action Successfully';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Action UnSuccessful';
        }
        echo json_encode($ret_data);
    }

    public function getCustomersDataByID()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $cust_id = $this->input->post('cust_id');
        $cust_data = $this->db->get_where('customers', array('id' => $cust_id));
        if ($cust_data->num_rows() > 0) {
            $ret_data['data_cust'] = $cust_data->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Retrival Successful';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Customer Data Not available';
        }

        echo json_encode($ret_data);
    }

    public function getCustomersDataAll()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $cust_data = $this->db->get('customers');
        if ($cust_data->num_rows() > 0) {
            $ret_data['data_cust'] = $cust_data->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Retrival Successful';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Customer Data Not available';
        }
        echo json_encode($ret_data);
    }

    public function getCustomersDataAll_dd()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $this->db->select('id, fname as label');
        $this->db->order_by('fname', 'asc');
        $cust_data = $this->db->get('customers');
        if ($cust_data->num_rows() > 0) {
            $ret_data['data_cust'] = $cust_data->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Retrival Successful';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Customer Data Not available';
        }
        echo json_encode($ret_data);
    }

    public function setCustomersData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        unset($_POST['authId']);
        $ret_data['status_code'] = 202;
        $ret_data['status_msg'] = 'Not valid input';

        $data = $this->mm->arrayToDataArray($_POST);
        $custID = $this->input->post('id');
        //INSERT IF ID IS NULL
        if (is_null($custID) || $custID == 'null') {
            if ($this->db->insert('customers', $data)) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = 'Customer Data Set Successful';
            } else {
                $ret_data['status_code'] = 201;
                $ret_data['status_msg'] = 'Customer Data Set UnSuccessful';
            }
        } else if (!is_null($custID) && $custID != '') {
            unset($data['id']);
            $this->db->where('id', $custID);
            if ($this->db->update('customers', $data)) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = 'Customer Data Update Successful';
            } else {
                $ret_data['status_code'] = 201;
                $ret_data['status_msg'] = 'Customer Data Update UnSuccessful';
            }
        }

        echo json_encode($ret_data);
    }

    public function delCustomersData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        unset($_POST['authId']);
        $data = $this->mm->arrayToDataArray($_POST);
        $custID = $this->input->post('id');
        //INSERT IF ID IS NULL
        if (is_null($custID)) {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Id not selected to delete.';
        } else if (!is_null($custID)) {
            unset($data['id']);
            $this->db->where('id', $custID);
            if ($this->db->delete('customers')) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = 'Customer Data Delete Successful';
            } else {
                $ret_data['status_code'] = 201;
                $ret_data['status_msg'] = 'Customer Data Delete UnSuccessful';
            }
        }

        echo json_encode($ret_data);
    }
    /**
     * Create a new order
     */
    public function setOrderNew()
    {
        try {
            log_message('debug', 'Set Order New');
            $orderId = $this->input->post('id');
            $type = $this->input->post('type');
            $postData = $this->mm->arrayToDataArray($_POST);
            //Unset columns
            unset($postData['authId']);
            unset($postData['type']);
            $responseOrder = $this->mm->saveOrder($postData, $orderId, $type);
            echo json_encode($responseOrder);
        } catch (\Throwable $th) {
            log_message('debug', $th);
            throw $th;
        }
    }

    public function setOrderSplitNew()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $orderId = $this->input->post('orderId');
        $parentData = $this->input->post('parentData');
        $childData = $this->input->post('childData');
        $parentData = json_decode($parentData, true);
        $childData = json_decode($childData, true);

        $orderSplitId = $this->mm->createSplitOrderId($orderId);

        $data = $this->db->get_where('order_list', array('order_id' => $orderId, 'split_id' => ''));

        if ($data->num_rows() > 0) {
            $data = $data->result_array()[0];
            $data['split_id'] = $orderSplitId;
            $data['quantity'] = count($childData);
            unset($data['id']);

            $this->db->trans_start();
            $this->db->insert('order_list', $data);

            if ($this->db->trans_status()) {
                $this->db->trans_commit();
                $retMsg = $this->mm->setBrazingDetail($orderId, $orderSplitId, $parentData, $childData);
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "$retMsg \n Data updated with the new order id $orderId$orderSplitId";
            } else {
                $this->db->trans_rollback();
                $ret_data['status_code'] = 202;
                $ret_data['status_msg'] = "Order Not added / Brazing quantity not updated";
            }
            $this->db->trans_complete();
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Data not available for the order id $orderId";
        }

        echo json_encode($ret_data);
    }

    public function setOrderImages()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $refid = time();
        $data = $this->mm->arrayToDataArray($_POST);

        $this->db->trans_start();
        $this->db->insert('drawing_images', $data);
        $this->db->$this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "$i number of details updated.";
        } else {
            $this->db->trans_commit();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Transaction not completed please try again";
        }
    }

    public function getOrderAll()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $pageType = $this->input->post('pageType');
        $where_clause = '';
        if ($pageType == 'cncNesting') {
            $where_clause = "where order_status ='1' and hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status<>'true'";
            $order_by = "order by a.end_plate_material,  a.order_id asc";
        } elseif ($pageType == 'cncPunchingNumbering') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status='true' and a.cnc_punching_status<>'true'";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'endPlateBending') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status='true' and a.cnc_punching_status='true' and a.bending_status<>'true'";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'tubeCuttingBending') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.tcutting_status<>'true'";
            $order_by = "order by a.pipe_type, a.order_id asc";
        } elseif ($pageType == 'finsPuncing') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.finpunch_status<>'true'";
            $order_by = "order by a.fin_per_inch,  a.order_id asc";
        } elseif ($pageType == 'coilAssembly') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.bending_status='true' and a.tcutting_status='true' and  a.finpunch_status='true' and a.ca_status<>'true'";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'coilExpansion') {
            $where_clause = "inner join lookup c on c.lkp_value <>'' and a.expansion_type = c.id and (LOWER(c.lkp_value) = 'vertical' or LOWER(c.lkp_value) = 'horizontal') and LOWER(c.lkp_value) <> 'hydraulic'
                where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.ca_status='true' and a.ce_status<>'true'";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'brazingTesting') {
            $where_clause = "inner join lookup c on c.lkp_value <>'' and a.expansion_type = c.id and (((LOWER(c.lkp_value) = 'vertical' or LOWER(c.lkp_value) = 'horizontal') and ce_status ='true') 
                or (LOWER(c.lkp_value) = 'hydraulic' and ca_status ='true')) where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.ca_status='true' and a.brazing_status<>'true' ";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'paintingPacking') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.brazing_status='true' and a.pp_status<>'true'";
            $order_by = "order by a.order_id asc";
        } elseif ($pageType == 'dispatch') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.pp_status='true' and a.dispatch_status<>'true'";
            $order_by = "order by a.order_id asc";
        } else {
            $where_clause = "where order_status ='1' and a.dispatch_status<>'true' ";
            $order_by = "order by a.order_id asc";
        }

        $ret_data['data_orders'] = $this->db->query("SELECT a.id, CONCAT(a.order_id,a.split_id) as 'order_id',a.order_id as unsplit_order_id,  a.split_id, a.order_date,ifnull( b.fname, 'Not Set') as full_customer_name,  a.* 
            FROM order_list a left join customers b on a.customer_name = b.id $where_clause $order_by;")->result_array();

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";
        $ret_data['query'] = $this->db->last_query();

        echo json_encode($ret_data);
    }

    public function getOrderAll_lkpval()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $pageType = $this->input->post('pageType');
        $ret_clause = $this->mm->retQueryClause($pageType);

        $ret_data['data_orders'] = $this->db->query("SELECT a.id, CONCAT(a.order_id,a.split_id) as 'order_id',a.order_id as unsplit_order_id,  a.split_id, a.order_date, 
        ifnull( b.fname, 'Not Set') as full_customer_name, a.customer_name, a.length, a.height, a.rows,  count(h.order_id) as quantity , a.quantity as raw_quantity, count(bd.order_id) as brazing_completed,
        CONCAT(a.length, ' x ', a.height, ' x ', a.rows,'R - ', count(h.order_id)) as size,
            ROUND((a.length * a.height * a.rows *  count(h.order_id)) / 144)  as sq_feet, c.lkp_value as pipe_type, d.lkp_value as expansion_type, 
            a.pbStraight,a.pbStraightQty, a.pbStraightSize, a.pbStraightTotQty, a.pbSingle, a.pbSingleQty, a.pbSingleSize, a.pbSingleTotQty, a.pbCross, a.pbCrossQty, a.pbCrossSize, 
            a.pbCrossTotQty, a.pbOther, a.pbOtherQty,a.pbOtherSize, a.pbOtherTotQty, a.pipe_comment, e.lkp_value as  end_plate_material, f.lkp_value as  end_plate_modal, end_plate_orientation, a.ep_photo, a.cover_type, 
            a.cover_detail,a.ep_comments, a.fin_per_inch, a.assembly_Photo, a.fin_comments, g.lkp_value as circuit_models, a.brazing_Photo, a.circuit_no, a.liquid_line, a.discharge_line, 
            a.brazing_comment, a.paint, a.packing_type, a.dispatch_mode, a.dispatch_comment, a.final_comment, a.cnc_nesting_pgm_no, a.cnc_nested, a.cnc_nesting_status, a.cnc_nesting_status_dt,
                      a.cnc_punching_status, a.cnc_punching_status_dt,
                      a.ep_DateTime,
                      a.bending_status,
                      a.bending_status_dt,
                      a.tcutting_roll_no,
                      a.tcutting_datetime,
                      a.tcutting_status,
                      a.tcutting_status_dt,
                      a.finpunching_foilno,
                      a.finpunch_status,
                      a.finpunch_status_dt,
                      a.brazing_expansion,
                      a.brazing_status,
                      a.brazing_status_dt,
                      a.ca_actualfpi,
                      a.ca_status,
                      a.ce_status,
                      a.pp_status,
                      a.dispatch_status,
                      a.ca_status_dt,
                      a.ce_status_dt,
                      a.pp_status_dt,
                      a.pp_datetime,
                      a.dispatch_status_dt,
                      a.date_submit,
                      a.priority,
                      a.hold,
                      a.is_commitment_important,
                      a.coil_ready_at,
                      a.est_delivery_date,
                      a.order_status,
                      a.created_dt
                      FROM order_list a left join customers b on a.customer_name = b.id
                      left join lookup c on a.pipe_type = c.id
                      left join lookup d on a.expansion_type = d.id
                      left join lookup e on a.end_plate_material = e.id
                      left join lookup f on a.end_plate_modal = f.id
                      left join lookup g on a.circuit_models = g.id 
                      left join brazing_details h on a.order_id = h.order_id and a.split_id = h.split_id
                      left join brazing_details bd on a.order_id = bd.order_id and a.split_id = bd.split_id and h.series_id = bd.series_id and bd.leak in ('noLeak','leakFound','notRecord')
                       " . $ret_clause['where_clause'] . " group by h.order_id, h.split_id " . $ret_clause['order_by'] . ";")->result_array();


        $orders = array();
        foreach ($ret_data['data_orders'] as $order) {

            if ($order["pp_status"] == "true") {

                $order["coil_ready_at"] = "Ready";
                $orders[] = $order;
            } else {

                $orders[] = $order;
            }
        }

        $ret_data['data_orders'] = $orders;
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function getOrderHistory()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $where_clause = "where order_status ='0' or dispatch_status = 'true' ";
        $order_by = "order by a.order_id asc";

        $ret_data['data_orders'] = $this->db->query("SELECT a.id, CONCAT(a.order_id,a.split_id) as order_id, a.order_date, ifnull( b.fname, 'Not Set') as full_customer_name, a.length, a.height, 
            a.rows, a.quantity, CONCAT(a.length, ' x ', a.height, ' x ', a.rows,'R - ', a.quantity) as size,
            a.sq_feet, c.lkp_value as pipe_type, d.lkp_value as expansion_type, a.pbStraight,a.pbStraightQty, a.pbStraightSize, a.pbStraightTotQty, a.pbSingle, a.pbSingleQty, 
            a.pbSingleSize, a.pbSingleTotQty, a.pbCross, a.pbCrossQty, a.pbCrossSize, a.pbCrossTotQty, a.pbOther,  a.pbOtherQty, a.pbOtherSize, a.pbOtherTotQty, a.pipe_comment, 
            e.lkp_value as  end_plate_material, f.lkp_value as  end_plate_modal,end_plate_orientation, a.ep_photo, a.cover_type, a.cover_detail,a.ep_comments, a.fin_per_inch, a.assembly_Photo, 
            a.fin_comments, g.lkp_value as circuit_models, a.brazing_Photo, a.circuit_no, a.liquid_line, a.discharge_line, a.brazing_comment, a.paint, a.packing_type, 
            a.dispatch_mode, a.dispatch_comment, a.final_comment, a.cnc_nesting_pgm_no, a.cnc_nested, a.cnc_nesting_status, a.cnc_nesting_status_dt,
            a.cnc_punching_status, a.cnc_punching_status_dt,
            a.ep_DateTime,
            a.bending_status,
            a.bending_status_dt,
            a.tcutting_roll_no,
            a.tcutting_datetime,
            a.tcutting_status,
            a.tcutting_status_dt,
            a.finpunching_foilno,
            a.finpunch_status,
            a.finpunch_status_dt,
            a.brazing_expansion,
            a.brazing_status,
            a.brazing_status_dt,
            a.ca_actualfpi,
            a.ca_status,
            a.ce_status,
            a.pp_status,
            a.dispatch_status,
            a.ca_status_dt,
            a.ce_status_dt,
            a.pp_status_dt,
            a.pp_datetime,
            a.dispatch_status_dt,
            a.date_submit,
            a.priority,
            a.hold,
            a.order_status,
            a.created_dt
            FROM order_list a left join customers b on a.customer_name = b.id
            left join lookup c on a.pipe_type = c.id
            left join lookup d on a.expansion_type = d.id
            left join lookup e on a.end_plate_material = e.id
            left join lookup f on a.end_plate_modal = f.id
            left join lookup g on a.circuit_models = g.id $where_clause $order_by;")->result_array();

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function getOrderHistory_dd()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $where_clause = "where order_status ='0' or dispatch_status = 'true' ";
        $order_by = "order by a.order_id asc";

        $order_data = $this->db->query("SELECT a.id, a.order_id as label from order_list a $where_clause $order_by;");

        if ($order_data->num_rows() > 0) {
            $ret_data['data_his_id'] = $order_data->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Retrival Successful';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Customer Data Not available';
        }

        echo json_encode($ret_data);
    }

    public function getOrderAll_dd()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $order_by = "order by a.order_id asc";

        $order_data = $this->db->query("SELECT a.id, concat(a.order_id, a.split_id) as label from order_list a  $order_by;");

        if ($order_data->num_rows() > 0) {
            $ret_data['data_his_id'] = $order_data->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Retrival Successful';
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Customer Data Not available';
        }

        echo json_encode($ret_data);
    }

    public function getOrderDataByID()
    {
        try {
            if (!$this->mm->access_code_verify($this->input->post('authId'))) {
                $ret_data['status_code'] = 101;
                $ret_data['status_msg'] = "Access Code not correct, Please login again.";
                echo json_encode($ret_data);
                return;
            }
            $id = $this->input->post('id');
            log_message('debug', print_r($id, true));
            $isSplit=$this->db->get_where('order_list',array('id'=>$id,'split_id!='=>''))->result_array();
            
            $customerDetails = $this->db->get_where('lookup', array('category' => 'brazingLkp'))->result_array();
            $ret_data['data_orders'] = $this->db->query("SELECT ifnull( b.fname, 'Not Set') as full_customer_name, a.* FROM order_list a left join customers b on a.customer_name = b.id where a.id = '$id';")->result_array();
            if(count($isSplit)>0){
                $orderNoList=$this->db->get_where('order_list',array('order_id'=>$isSplit[0]['order_id'],'split_id='=>''))->result_array();
                $id=$orderNoList[0]['id'];
            }
            $imagesList = $this->db->get_where('drawing_images', array('drawing_refid' => $id))->result_array();
            $brazingDetails = $this->db->get_where('brazing_details', array('order_id' => $ret_data['data_orders'][0]['order_id'], 'split_id' => $ret_data['data_orders'][0]['split_id']))->result_array();

            if (count($brazingDetails) > 0) {
                $brazingIds = [
                    'uBend',
                    'inletOutlet',
                    'headder',
                    'headderFix',
                    'distributor',
                    'distributorFix'
                ];
                foreach ($brazingDetails as $brazingId => $brazingValue) {
                    foreach ($customerDetails as $customerKey => $customerValue) {
                        foreach ($brazingIds as $key => $value) {
                            if ($customerValue['id'] == $brazingValue[$value]) {
                                $brazingDetails[$brazingId][$value] = $customerValue['lkp_value'];
                            }
                        }
                    }
                }
                log_message('debug', print_r($brazingDetails, true));
                //$imagesResult = $this->db->get();
                $ret_data['data_orders'][0]['brazing_details'] = $brazingDetails;
            }
            $arr = array();
            $indices = [];
            if (count($imagesList) > 0) {
                foreach ($imagesList as $item) {
                    // Get the current draw_type
                    $drawType = $item['draw_type'];

                    // Initialize the index for this draw_type if it hasn't been set yet
                    if (!isset($indices[$drawType])) {
                        $indices[$drawType] = 0;
                    }

                    // Assign the item to the new array and increment the index for this draw_type
                    if ($drawType == 'bz-t') {
                        if (!isset($arr[$drawType][explode('-', $item['order_serial_ref'])[1]])) {
                            $indices[$drawType] = 0;
                        }
                        $arr[$drawType][explode('-', $item['order_serial_ref'])[1]][$indices[$drawType]] = 'uploads/' . $item['drawing_base64'];
                    } else {
                        $arr[$drawType][$indices[$drawType]] = 'uploads/' . $item['drawing_base64'];
                    }
                    $indices[$drawType]++;
                }
                if (isset($arr['ep'])) {
                    $ret_data['data_orders'][0]['ep_photo'] = $arr['ep'];
                } else {
                    $ret_data['data_orders'][0]['ep_photo'] = [];
                }
                if (isset($arr['asm'])) {
                    $ret_data['data_orders'][0]['assembly_Photo'] = $arr['asm'];
                } else {
                    $ret_data['data_orders'][0]['assembly_Photo'] = [];
                }
                if (isset($arr['bz'])) {
                    $ret_data['data_orders'][0]['brazing_Photo'] = $arr['bz'];
                } else {
                    $ret_data['data_orders'][0]['brazing_Photo'] = [];
                }
                if (isset($arr['bz-t'])) {
                    $ret_data['data_orders'][0]['brazing_testing_Photo'] = $arr['bz-t'];
                } else {
                    $ret_data['data_orders'][0]['brazing_testing_Photo'] = [];
                }
            } else {
                $ret_data['data_orders'][0]['ep_photo'] = [];
                $ret_data['data_orders'][0]['assembly_Photo'] = [];
                $ret_data['data_orders'][0]['brazing_Photo'] = [];
                $ret_data['data_orders'][0]['brazing_testing_Photo'] = [];
            }
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Data retrival successful";
            echo json_encode($ret_data);
        } catch (\Throwable $th) {
            //throw $th;

        }
    }

    public function getImagesOnly()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $orderId = $this->input->post('order_id');
        $drawType = $this->input->post('draw_type');
        $isSplit=$this->db->get_where('order_list',array('id'=>$orderId,'split_id!='=>''))->result_array();
        if(count($isSplit)>0){
            $orderNoList=$this->db->get_where('order_list',array('order_id'=>$isSplit[0]['order_id'],'split_id='=>''))->result_array();
            $orderId=$orderNoList[0]['id'];
        }
        if ($drawType == 'ep') {
            $this->db->select('drawing_base64');
            $ret_data['data_orders']['ep_photo'] = $this->db->get_where('drawing_images', array('draw_type' => $drawType, 'drawing_refid' => $orderId))->result_array();
        } else if ($drawType == 'asm') {
            $this->db->select('drawing_base64');
            $ret_data['data_orders']['assembly_Photo'] = $this->db->get_where('drawing_images', array('draw_type' => $drawType, 'drawing_refid' => $orderId))->result_array();
        } else if ($drawType == 'bz') {
            $this->db->select('drawing_base64');
            $ret_data['data_orders']['brazing_Photo'] = $this->db->get_where('drawing_images', array('draw_type' => $drawType, 'drawing_refid' => $orderId))->result_array();
        }
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function getPendingCompletedSQ()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $pageType = $this->input->post('pageName');
        $ret_clause = $this->mm->retQueryClause($pageType);
        //var_dump("SELECT ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 )) as pendingsq FROM `order_list` a " . $ret_clause['where_clause'] . "");die;
        $ret_data['pendingsq'] = $this->db->query("SELECT ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 )) as pendingsq FROM `order_list` a " . $ret_clause['where_clause'] . "")->row();
        $ret_data['completedSq'] = $this->db->query("Select * from (SELECT  count(" . $ret_clause['fieldName'] . ") as count, sum(sq_feet) as compsq, SUBSTRING(" . $ret_clause['fieldName'] . '_dt' . ", 1, 10) as stat_date 
            FROM `order_list` where " . $ret_clause['fieldName']  . "= 'true' group by stat_date order by " . $ret_clause['fieldName'] . "_dt desc limit 15)
            as order_gp order by stat_date asc;")->result_array();
        $ret_data['completed_count'] = $this->db->query("SELECT  sum(a.sq_feet) as completed_count FROM `order_list` a where " . $ret_clause['fieldName']  . "= 'true' and substring(" . $ret_clause['fieldName'] . '_dt, 1,10)= CURRENT_DATE()' . ";")->row();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";
        echo json_encode($ret_data);
    }

    public function setOrderFields()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $id = $this->input->post('id');
        $priority = $this->input->post('priority');

        $this->db->where('id', $id);
        if ($this->db->update('order_list', array('priority' => $priority))) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Priority updated successful.";
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Priority not updated successful.";
        }

        echo json_encode($ret_data);
    }

    public function setOrderGeneric()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $id = $this->input->post('id');
        $data = $this->mm->arrayToDataArray($_POST);
        unset($data['id']);
        unset($data['authId']);
        //if variable is [field]_status then add [field]_status_dt
        foreach ($data as $key => $value) {
            $keyExp = explode("_", $key);
            if (end($keyExp) == 'status') {
                $data[$key . "_dt"] = date("Y-m-d H:i:s");
            }
            if ($key == 'ce_status') {
                $this->mm->updateBrazingExpansion($id, $value);
            }
        }

        $this->db->where('id', $id);
        if ($this->db->update('order_list', $data)) {
            if ($this->db->affected_rows() > 0) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Order Data updated successful.";
            } else {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Data Not Impacted.";
            }
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Hold not updated successful.";
        }
        echo json_encode($ret_data);
    }

    public function setOrderDelete()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $id = $this->input->post('id');

        $this->db->where('id', $id);
        if ($this->db->update('order_list', array('order_status' => 0))) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Delete Order successful.";
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Delete Order unsuccessful.";
        }

        echo json_encode($ret_data);
    }

    public function getSaveOrderGeneric()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $ret = $this->db->query("SELECT a.id, a.order_date,ifnull( b.fname, 'Not Set') as full_customer_name,  a.* 
            FROM order_list_saved a left join customers b on a.customer_name = b.id ;");
        if ($ret->num_rows() > 0) {
            $ret_data['data'] = $ret->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Data Retrieved";
        } else {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "No Data To Retrieve.";
        }
        echo json_encode($ret_data);
    }

    public function getSavedOrderDataByID()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $id = $this->input->post('id');
        $ret_data['data_orders'] = $this->db->query("SELECT ifnull( b.fname, 'Not Set') as full_customer_name,  a.*  FROM order_list_saved a left join customers b on a.customer_name = b.id 
            where a.id = '$id';")->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }
    /**need to delete */
    function getAccessNameList()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $ret_data['access_data'] = $this->db->query('select min(id) as id, a.access_type as label from module_access a group by a.access_type;')->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function getModuleList()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $this->db->select("id, module_name,module_des, '1' as access_rw");
        $ret_data['module_data'] = $this->db->get('module_list')->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrival successful";

        echo json_encode($ret_data);
    }

    public function setAccessModuleList()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $accName = $this->input->post('access_type');
        $moduleList = json_decode($this->input->post('module_list'), true);

        $this->db->where('access_type', $accName);
        $acc_avail = $this->db->get('module_access');
        if ($acc_avail->num_rows() > 0) {
            $this->db->trans_start();
            $this->db->where('access_type', $accName);
            $this->db->delete('module_access');
            /** make an insert */
            foreach ($moduleList as $row) {
                $data['access_type'] = $accName;
                $data['module_name'] = $row['module_name'];
                $data['access_rw'] = $row['access_rw'];
                $this->db->insert('module_access', $data);
            }
            $this->db->trans_complete();

            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Updation Transaction was not successful.";
            } else {
                $this->db->trans_commit();
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Access Type is Updated.";
            }
        } else {
            $this->db->trans_start();
            /** make an insert */
            foreach ($moduleList as $row) {
                $data['access_type'] = $accName;
                $data['module_name'] = $row['module_name'];
                $data['access_rw'] = $row['access_rw'];
                $this->db->insert('module_access', $data);
            }
            $this->db->trans_complete();
            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Insertion Transaction was not successful.";
            } else {
                $this->db->trans_commit();
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Access Type is Inserted.";
            }
        }

        echo json_encode($ret_data);
    }

    public function getExistingAccessModuleList()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $accName = $this->input->post('access_type');

        $ret_data['module_data'] = $this->db->query("select a.id, a.module_name, a.module_des, IFNULL(b.access_rw, 0) as access_rw from module_list a 
            left join module_access b on a.module_name = b.module_name and b.access_type = '$accName';")->result_array();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Access Type Retrieved.";

        echo json_encode($ret_data);
    }
    /**end need to delete */
    public function setLookupData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        unset($_POST['authId']);

        $data = $this->mm->arrayToDataArray($_POST);
        $lkpId = $data['lkpId'];
        unset($data['lkpId']);
        if (!is_null($lkpId) && $lkpId != '' && $lkpId != 'undefined') {
            $this->db->where('id', $lkpId);
            if ($this->db->update('lookup', $data)) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Lookup data is  updated.";
            } else {
                $ret_data['status_code'] = $this->db->error();
                $ret_data['status_msg'] = "Lookup data is not set.";
            }
        } else {
            if ($this->db->insert('lookup', $data)) {
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = "Lookup data is  set.";
            } else {
                $ret_data['status_code'] = $this->db->error();
                $ret_data['status_msg'] = "Lookup data is not set.";
            }
        }
        echo json_encode($ret_data);
    }

    public function getLookupData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $lkpId = $this->input->post('lkpId');
        if (!is_null($lkpId) && $lkpId != '' && $lkpId != 'undefined') {

            $data = $this->db->get_where('lookup', array('id' => $lkpId))->result_array()[0];
            $ret_data[$data['category']] = $data;
            if ($data['category'] == 'coverDetail') {
                $ret_data['coverType'] = $this->db->get_where('lookup', array('category' => 'coverType'))->result_array();
            }
        } else {
            $ret_data['pipeType'] = $this->db->get_where('lookup', array('category' => 'pipeType'))->result_array();
            $ret_data['expansionType'] = $this->db->get_where('lookup', array('category' => 'expansionType'))->result_array();
            $ret_data['pipeBend'] = $this->db->get_where('lookup', array('category' => 'pipeBend'))->result_array();
            $ret_data['epMaterial'] = $this->db->get_where('lookup', array('category' => 'epMaterial'))->result_array();
            $ret_data['epModal'] = $this->db->get_where('lookup', array('category' => 'epModal'))->result_array();
            $ret_data['oreientation'] = $this->db->get_where('lookup', array('category' => 'oreientation'))->result_array();
            $ret_data['coverType'] = $this->db->get_where('lookup', array('category' => 'coverType'))->result_array();
            $ret_data['coverDetail'] = $this->db->query("select b.id, b.category,a.lkp_value, a.id as lkp_id,b.sublkp_val,b.create_dt 
                from lookup a inner join lookup b on a.id = b.lkp_value where b.category = 'coverDetail';")->result_array();
            $ret_data['circuitModel'] = $this->db->get_where('lookup', array('category' => 'circuitModel'))->result_array();
            $ret_data['liquidLine'] = $this->db->get_where('lookup', array('category' => 'liquidLine'))->result_array();
            $ret_data['dischargeLine'] = $this->db->get_where('lookup', array('category' => 'dischargeLine'))->result_array();
            $ret_data['paintType'] = $this->db->get_where('lookup', array('category' => 'paintType'))->result_array();
            $ret_data['packingType'] = $this->db->get_where('lookup', array('category' => 'packingType'))->result_array();
            $ret_data['dispatchMode'] = $this->db->get_where('lookup', array('category' => 'dispatchMode'))->result_array();
            $ret_data['brazingLkp'] = $this->db->get_where('lookup', array('category' => 'brazingLkp'))->result_array();
        }

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Lookup data retrieved.";

        echo json_encode($ret_data);
    }

    public function deleteLookupData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $this->db->where('id', $this->input->post('id'));
        if ($this->db->delete('lookup')) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Lookup data delete successful.";
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Lookup data delete not successful.";
        }

        echo json_encode($ret_data);
    }

    public function getBrazingDetail()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $orderId = $this->input->post('orderId');
        $splitId = $this->input->post('splitId');

        $ret = $this->mm->getBrazingDetailsObj($orderId, $splitId);

        if (count($ret) > 0) {
            $ret_data['data'] = $ret;
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Lookup data retrieved.";
        } else {
            $ret_data['status_code'] = 202;
            $ret_data['status_msg'] = "No Data to retrieved.";
        }

        echo json_encode($ret_data);
    }

    public function setBrazingDetails()
    {

        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $orderId = $this->input->post('orderId');
        $splitId = $this->input->post('splitId');
        $data = $this->input->post('data');
        $data = json_decode($data, true);
        $brazingImages = json_decode($this->input->post('brazingPhoto'));
        $array = json_decode(json_encode($brazingImages), true);
        log_message('debug', print_r($array, true));
        log_message('debug', print_r($data, true));
        $this->db->trans_start();

        $this->db->where('order_id', $orderId);
        $this->db->where('split_id', $splitId);
        $this->db->delete('brazing_details');

        $i = 0;
        foreach ($data as $row) {
            unset($row['brazing_photo']);
            if ($this->db->insert('brazing_details', $row)) {
                $i = $i + 1;
            }
        }
        // Get order information

        $refId = $this->db->select('id')
            ->from('order_list')
            ->where(['order_id' => $orderId])
            ->get()
            ->row();
        log_message('debug', print_r($refId->id, true));

        //Save Images 
        $image_path = realpath(APPPATH . '../uploads');
        foreach ($array as $serial_ref => $row) {
            // Delete Entry
            $this->db->where('order_serial_ref', $serial_ref)->delete('drawing_images');
            foreach ($row as $key => $imgData) {
                $logMessage = (preg_match('/\.webp/', $imgData) ? "Yes" : "No");
                log_message('debug', print_r($logMessage, true));
                if ($logMessage == 'No') {
                    $webpData = convert_base64_to_webp($imgData, $image_path, $refId->id);
                } else {

                    // Use parse_url() to extract the path part of the URL
                    $path = parse_url($imgData, PHP_URL_PATH);

                    // Use basename() to get the filename from the path
                    $filename = basename($path);
                    $webpData = $filename;
                }
                $this->db->insert('drawing_images', array('drawing_refid' => $refId->id, 'drawing_base64' => $webpData, 'order_type' => '2', 'draw_type' => 'bz-t', 'order_serial_ref' => $serial_ref));
            }
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "$i number of details updated.";
        } else {
            $this->db->trans_commit();
            $this->mm->updateOrderQuantity($orderId, $splitId);
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Transaction not completed please try again";
        }
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Brazing Quantity details updated.";
        echo json_encode($ret_data);
    }

    public function setAddBrazingQuantity()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $maxSeriesId = 1;
        $orderId = $this->input->post('orderId');
        $splitId = $this->input->post('splitId');
        $qtyCount = $this->input->post('qtyCount');
        $this->db->select('max(series_id) as max_series_id');
        $this->db->group_by('order_id, split_id');
        $maxSeriesId = $this->db->get_where('brazing_details', array('order_id' => $orderId, 'split_id' => $splitId))->row();

        if (isset($maxSeriesId->max_series_id)) {
            $maxSeriesId = $maxSeriesId->max_series_id;
        } else {
            $maxSeriesId = 1;
        }

        $this->db->trans_start();
        for ($i = 0; $i <= $qtyCount - 1; $i++) {
            $maxSeriesId = $maxSeriesId + 1;
            $this->db->insert('brazing_details', array('order_id' => $orderId, 'split_id' => $splitId, 'series_id' => $maxSeriesId, 'series_ref' => $orderId . $splitId . '-' . $maxSeriesId));
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Quantity not added.";
        } else {
            $this->db->trans_commit();
            $this->mm->updateOrderQuantity($orderId, $splitId);
            $ret = $this->mm->getBrazingDetailsObj($orderId, $splitId);
            $ret_data['data'] = $ret;
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "$i Quantity Added to the list";
        }
        echo json_encode($ret_data);
    }

    public function setDeleteBrazingQuantity()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $orderId = $this->input->post('orderId');
        $splitId = $this->input->post('splitId');
        $deleteSeries = json_decode($this->input->post('deleteSeries'), true);
        $this->db->trans_start();

        foreach ($deleteSeries as $row) {
            $this->db->where('id', $row['id']);
            $this->db->delete('brazing_details');
        }
        $this->mm->updateOrderQuantity($orderId, $splitId);
        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = "Quantity not removed.";
        } else {
            $this->db->trans_commit();
            $this->mm->updateOrderQuantity($orderId, $splitId);
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Quantities removed";
        }

        echo json_encode($ret_data);
    }

    public function getLatestOrder()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $ret_data['data'] = $this->mm->createOrderId();
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Number order created.";
        echo json_encode($ret_data);
    }

    public function replicate_quantity_count_brazing()
    {
        $data = $this->db->get('order_list')->result_array();

        foreach ($data as $row) {
            for ($i = 1; $i <= $row['quantity']; $i++) {
                $this->db->insert('brazing_details', array(
                    'order_id' => $row['order_id'], 'split_id' => $row['split_id'], 'series_id' => $i,
                    'series_ref' => $row['order_id'] . $row['split_id'] . '-' . $i
                ));
            }
        }
    }

    public function getOrderBrazingLeak()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
        $ret = $this->db->query("SELECT a.order_id, a.split_id,a.series_ref as \"Series\", cu.fname as \"Customer Name\", 
        CONCAT(h.length, ' x ', h.height, ' x ', h.rows,'R - ', h.quantity) as size, a.leak,a.A, a.B, a.D, a.E, a.F, a.G, a.H, a.K, a.L, a.N, 
        (a.A + a.B + a.D + a.E + a.F + a.G + a.H + a.K + a.L + a.N)  as \"Total Leak Count\", b.lkp_value as \"U Bend\", c.lkp_value as \"L Bend\", 
        d.lkp_value as Header, e.lkp_value as \"Header Fix\", f.lkp_value as Distributor, g.lkp_value as \"Distributor Fix\", a.completion, 
        h.brazing_status_dt as \"Brazing Completed Date\" FROM brazing_details a left join lookup b on a.uBend = b.id and b.category ='brazingLkp'
left join lookup c on a.inletOutlet = c.id and b.category ='brazingLkp'
left join lookup d on a.headder = d.id and b.category ='brazingLkp'
left join lookup e on a.headderFix = e.id and b.category ='brazingLkp'
left join lookup f on a.distributor = f.id and b.category ='brazingLkp'
left join lookup g on a.distributorFix = g.id and b.category ='brazingLkp'
left join order_list h on a.order_id=h.order_id and a.split_id = h.split_id
left join customers cu on h.customer_name = cu.id");

        if ($ret->num_rows() > 0) {
            $ret_data['data'] = $ret->result_array();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Brazing Leak retrieved.";
        } else {
            $ret_data['status_code'] = 202;
            $ret_data['status_msg'] = "No Brazing Leak Data to retrieved.";
        }

        echo json_encode($ret_data);
    }
    /**Ameer Freelancer */

    public function getOrdersToBeDispatched()
    {
        $ret_data = array();
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $starting_date = date('Y-m-d');
        $orders_dates = array();

        /**Get the old order with status not ready START*/
        $this->db->select("id,coil_ready_at");
        $this->db->order_by("coil_ready_at", "asc");
        $this->db->where("pp_status != ", "true");
        $this->db->where("coil_ready_at IS NOT NULL");
        //$this->db->where("coil_ready_at !=", '0000-00-00');
        $uncompleted_order = $this->db->get("order_list")->row();
        if ($uncompleted_order && $uncompleted_order->coil_ready_at) {

            $starting_date = $uncompleted_order->coil_ready_at;
        }
        /**Get the old order with status not ready END*/

        /***SELECT HOLIDAYS*/
        $this->db->select("date");
        $this->db->where("date >=", $starting_date);
        $ret_data["holidays"] = array_column($this->db->get("holidays")->result_array(), "date");
        /***SELECT HOLIDAYS*/


        $this->db->select("
        CASE 
            WHEN a.pp_status = 'true' THEN 'ready'
            WHEN COALESCE(NULLIF(a.coil_ready_at, null), 'unassigned') = 'unassigned' THEN 'unassigned'
            ELSE a.coil_ready_at 
        END as row_labels,
        COUNT(*) as total_orders,
        (ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 ))) as total_sq_feet", FALSE);

        $this->db->where(
            array(
                'order_status =' => '1',
                //'hold<>' => 'true',
                'dispatch_status<>' => 'true',
                //'pp_status = ' => 'true',
            )
        );

        $this->db->from("order_list a");
        $this->db->group_by("row_labels");
        $this->db->order_by("CASE WHEN row_labels = 'unassigned' THEN 1 WHEN row_labels = 'ready' THEN 2 ELSE 3 END, coil_ready_at ASC");

        $orders_result = $this->db->get()->result_array('array');
        $orders = array();
        $minDate = null; // Variable to store the smallest date

        foreach ($orders_result as $order) {

            if (!in_array($order["row_labels"], array("unassigned", "ready"))) {

                $minDate = $order["row_labels"];
                break;
            }
        }

        //prepare for 45 days
        for ($i = 0; $i < 45; $i++) {
            $orders_dates[] = date('Y-m-d', strtotime($minDate . " +{$i} days"));
        }

        // Check if the date exists in the result set
        foreach ($orders_result as $result) {
            if (in_array($result['row_labels'], array("unassigned", "ready"))) {
                $orders[$result['row_labels']] = $result;
            } else {

                break;
            }
        }

        foreach (array("unassigned", "ready") as $label) {

            if (!isset($orders[$label])) {

                $orders[$label] = array(
                    "row_labels" => $label,
                    "total_orders" => 0,
                    "total_sq_feet" => 0,
                    "is_holiday" => false
                );
            }
        }

        $orders = array_values($orders);
        foreach ($orders_dates as $date) {

            $date_found = false;

            // Check if the date exists in the result set
            foreach ($orders_result as $result) {
                if ($result['row_labels'] == $date) {

                    if (in_array($date, $ret_data["holidays"])) {
                        $result["is_holiday"] = true;
                    }

                    $orders[] = $result;
                    $date_found = true;
                    break;
                }
            }

            if (!$date_found) {

                $orders[] = array(
                    "row_labels" => $date,
                    "total_orders" => 0,
                    "total_sq_feet" => 0,
                    "is_holiday" => in_array($date, $ret_data["holidays"])
                );
            }
        }


        $ret_data["data"] = $orders;
        $ret_data["orders_result"] = $orders_result;

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data retrieval successful";

        echo json_encode($ret_data);
    }

    public function updateSchedulerHoliday()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $date = $this->input->post("date");
        $is_holiday = $this->input->post("is_holiday");
        if ($date) {

            if ($is_holiday != "true") {
                //delete 'holidays' table entry with that date
                $this->db->delete('holidays', array('date' => $date));
            } else {
                // Insert entry into 'holidays' table if the date doesn't exist
                $q = $this->db->get_where('holidays', array('date' => $date));
                if (!$q->num_rows()) {
                    $this->db->insert('holidays', array('date' => $date, 'created_at' => date('Y-m-d'), 'updated_at' => date('Y-m-d')));
                }
            }

            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Scheduler holiday updated successfully.";
            echo json_encode($ret_data);
        } else {

            $ret_data['status_code'] = 422;
            $ret_data['status_msg'] = "Invalid data received";
            echo json_encode($ret_data);
        }
    }

    public function updateSchedulerOrderDate()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $date = $this->input->post("date");
        $column = $this->input->post("column");
        if ($date and in_array($column, array("est_delivery_date", "coil_ready_at"))) {

            $this->db->where('id', $this->input->post("id"));
            if (empty($date) || $date === "Invalid date") {

                $date = null;
            }
            $this->db->update('order_list', array($column => $date));

            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Scheduler $column updated successfully.";
            echo json_encode($ret_data);
        } else {

            $ret_data['status_code'] = 422;
            $ret_data['status_msg'] = "Invalid data received";
            echo json_encode($ret_data);
        }
    }

    public function updateSchedulerCommitmentStatus()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $is_important = 0;
        if ($this->input->post('is_commitment_important') && $this->input->post('is_commitment_important') == 'true') {

            $is_important = 1;
        }

        $this->db->where('id', $this->input->post("id"));
        $this->db->update('order_list', array('is_commitment_important' => $is_important));

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Commitment status updated.";
        echo json_encode($ret_data);
    }
    public function getActiveOrders()
    {
        try {
            $this->db->select(['order_id', 'id']);
            $result = $this->db->get_where('order_list', [])->result_array();
            echo json_encode($result);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function allData_excel()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $reqType = $this->input->post('reqType');
        $liveClause = '';
        if ($reqType == 'live') {
            $liveClause = $this->mm->retQueryClause('live')['where_clause'];
        }

        $orderList = $this->db->query("SELECT a.id, CONCAT(a.order_id,a.split_id) as order_id, a.order_date, a.created_dt as date_submit, ifnull( b.fname, 'Not Set') as full_customer_name, a.length, a.height, 
            a.rows, a.quantity, CONCAT(a.length, ' x ', a.height, ' x ', a.rows,'R - ', a.quantity) as size,
            a.sq_feet, c.lkp_value as pipe_type, d.lkp_value as expansion_type, a.pbStraight,a.pbStraightQty, a.pbStraightSize, a.pbStraightTotQty, a.pbSingle, a.pbSingleQty, 
            a.pbSingleSize, a.pbSingleTotQty, a.pbCross, a.pbCrossQty, a.pbCrossSize, a.pbCrossTotQty, a.pbOther,  a.pbOtherQty,a.pbOtherSize, a.pbOtherTotQty, a.pipe_comment, 
            e.lkp_value as  end_plate_material, f.lkp_value as  end_plate_modal,end_plate_orientation, a.cover_type, a.cover_detail,a.ep_comments, a.fin_per_inch, 
            a.fin_comments, g.lkp_value as circuit_models, a.circuit_no, a.liquid_line, a.discharge_line, a.brazing_comment, a.paint, a.packing_type, 
            a.dispatch_mode, a.dispatch_comment, a.final_comment, a.cnc_nesting_pgm_no, a.cnc_nested, 
            a.cnc_nesting_status_dt,
            a.cnc_punching_status_dt,
            a.ep_DateTime,
            a.bending_status_dt,
            a.tcutting_datetime,
            a.tcutting_status_dt,
            a.finpunch_status_dt,
            a.ca_status_dt,
            a.ce_status_dt,
            a.brazing_status_dt,
            a.pp_datetime,
            a.pp_status_dt,
            a.dispatch_status_dt,
            -- a.cnc_nesting_status, 
            -- a.cnc_punching_status, 
            -- a.bending_status,
            -- a.tcutting_status,
            -- a.finpunch_status,
            -- a.brazing_status,
            -- a.ca_status,
            -- a.ce_status,
            -- a.pp_status,
            -- a.dispatch_status,
            a.tcutting_roll_no,
            a.finpunching_foilno,
            a.ca_actualfpi,
            a.priority,
            a.hold,
            a.order_status,
            a.coil_ready_at,
            a.est_delivery_date,
            concat((case a.cnc_nesting_status when 'true' then 1 else 0 end +
                case a.cnc_punching_status when 'true' then 1 else 0 end +
                case a.bending_status when 'true' then 1 else 0 end +
                case a.tcutting_status when 'true' then 1 else 0 end +
                case a.finpunch_status when 'true' then 1 else 0 end +
                case a.ca_status when 'true' then 1 else 0 end +
                case a.ce_status when 'true' then 1 else 0 end +
                case a.brazing_status when 'true' then 1 else 0 end +
                case a.pp_status when 'true' then 1 else 0 end +
                case a.dispatch_status when 'true' then 1 else 0 end) * 10,'%') as status_cent
            FROM order_list a left join customers b on a.customer_name = b.id
            left join lookup c on a.pipe_type = c.id
            left join lookup d on a.expansion_type = d.id
            left join lookup e on a.end_plate_material = e.id
            left join lookup f on a.end_plate_modal = f.id
            left join lookup g on a.circuit_models = g.id
            $liveClause;")->result_array();

        $newOrderList = array();
        foreach ($orderList  as $row) {

            if ($row['pbStraight'] == 'false') {
                $row['pbStraightQty'] = 0;
                $row['pbStraightSize'] = 0;
                $row['pbStraightTotQty'] = 0;
            }
            if ($row['pbSingle'] == 'false') {
                $row['pbSingleQty'] = 0;
                $row['pbSingleSize'] = 0;
                $row['pbSingleTotQty'] = 0;
            }
            if ($row['pbCross'] == 'false') {
                $row['pbCrossQty'] = 0;
                $row['pbCrossSize'] = 0;
                $row['pbCrossTotQty'] = 0;
            }
            if ($row['pbOther'] == 'false') {
                $row['pbOtherQty'] = 0;
                $row['pbOtherSize'] = 0;
                $row['pbOtherTotQty'] = 0;
            }

            $row["end_plate_orientation"] = $this->mm->lookupIdToValue($row["end_plate_orientation"], "oreientation");
            $row["cover_type"] = $this->mm->lookupIdToValue($row["cover_detail"], "coverType");
            $row["cover_detail"] = $this->mm->lookupIdToValue($row["cover_detail"], "coverDetail");
            $row["liquid_line"] = $this->mm->lookupIdToValue($row["liquid_line"], "liquidLine");
            $row["discharge_line"] = $this->mm->lookupIdToValue($row["discharge_line"], "dischargeLine");
            $row["packing_type"] = $this->mm->lookupIdToValue($row["packing_type"], "packingType");
            $row["paint"] = $this->mm->lookupIdToValue($row["paint"], "paintType");
            $row["dispatch_mode"] = $this->mm->lookupIdToValue($row["dispatch_mode"], "dispatchMode");
            array_push($newOrderList,  $row);
        }
        $ret_data['data'] = $newOrderList;
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Commitment status updated.";
        echo json_encode($ret_data);
    }

    public function dashboardGraphData()
    {
        if (!$this->mm->access_code_verify($this->input->post('authId'))) {
            $ret_data['status_code'] = 101;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }

        $pendingCount =  $this->mm->pendingSQ_graph();
        $pendingGroupCount =  $this->mm->pendingGroupedSQ_graph();
        $completedModelOverAll = $this->mm->completedModuleOverAllSQ_graph();
        $completeModalWise = $this->mm->completedModelWiseSQ_graph();
        $summaryData = $this->mm->dataSummary();

        $ret_data['pendingCount'] = $pendingCount;
        $ret_data['pendingGroupCount'] = $pendingGroupCount;
        $ret_data['completedModelOverAll']
            = $completedModelOverAll;
        $ret_data['completedModelWise'] = $completeModalWise;
        $ret_data['summaryData'] = $summaryData;

        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "Data Retrieved";
        echo json_encode($ret_data);
    }

    //module Access

    // public function pageList()
    // {
    //     $groupaccessname = $this->input->post('accessName');
    //     if ($groupaccessname <> '') {
    //         $data = $this->db->query("SELECT a.id, a.page_mod_name, a.page_name, b.access_type FROM tbl_access_pagesname a 
    // left join tbl_access_module b on a.page_mod_name = b.page_name where access_name ='$groupaccessname';")->result_array();
    //     } else {
    //         $data = $this->db->query("SELECT a.id, a.page_mod_name, a.page_name, 'deny' as access_type FROM tbl_access_pagesname a ")->result_array();
    //     }

    //     $ret_data['status_code'] = 200;
    //     $ret_data['status_msg'] = "Data Retrieved";
    //     $ret_data['pageData'] = $data;
    //     echo json_encode($ret_data);
    // }

    // public function setAccessSetup()
    // {

    //     $data = $this->mm->arrayToDataArray($_POST);
    //     $accessName = $data['accessName'];
    //     $accessList = json_decode($data['pageListData'], true);
    //     var_dump($accessList);
    //     unset($data['authId']);
    //     unset($data['accessName']);

    //     $acc_exist = $this->db->get_where('tbl_access_module', array('access_name' => $accessName));
    //     if ($acc_exist->num_rows() > 0) {
    //         $this->db->delete('tbl_access_module', array('access_name' => $accessName));
    //     }
    //     foreach ($accessList as $row) {
    //         $this->db->insert('tbl_access_module', array('access_name' => $accessName, 'page_name' => $row['page_name'], 'access_type' => $row['access_type']));
    //     }

    //     $ret_data['status_code'] = 200;
    //     $ret_data['status_msg'] = "Data Updated";
    //     echo json_encode($ret_data);
    // }


    public function test()
    {
        $data = $this->mm->completedModelWiseSQ_graph();
        var_dump($data);
    }
    public function convert_sf_to_webp()
    {
        return $this->im->process();
    }
}
