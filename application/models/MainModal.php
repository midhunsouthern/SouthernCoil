<?php

defined('BASEPATH') or exit('No direct script access allowed');

class MainModal extends CI_Model
{
    public function arrayToDataArray($arrayData)
    {
        foreach ($arrayData as $key => $value) {
            if (is_string($value)) {
                $data[$key] = $value;
            }
        }
        return isset($data) ? $data : null;
    }

    public function update_access_time($access_code)
    {
        $this->db->where('access_code', $access_code);
        $ret_val = $this->db->update('access_profile', array('last_acces_dt' => date("Y/m/d h:i:s")));
        if ($this->db->affected_rows() == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function access_code_verify($access_code)
    {
        $ret_val = $this->db->get_where('access_profile', array('access_code' => $access_code));
        if ($ret_val->num_rows() == 1) {
            return $ret_val->row()->access_type;
        } else {
            return false;
        }
    }

    public function createOrderId()
    {
        $yr = substr(date("Y"), 2);
        $oId = $this->db->query("select IFNULL(max(order_id),0) as order_id from order_list where order_id like '$yr%'")->row()->order_id;
        return $yr . str_pad((int)substr($oId, 2) + 1, 4, "00", STR_PAD_LEFT);
    }

    private function upload_files($path, $title, $files)
    {
        $config = array(
            'upload_path'   => $path,
            'allowed_types' => 'jpg|gif|png',
            'overwrite'     => 1,
        );

        $this->load->library('upload', $config);

        $images = array();

        foreach ($files['name'] as $key => $image) {
            $_FILES['images[]']['name'] = $files['name'][$key];
            $_FILES['images[]']['type'] = $files['type'][$key];
            $_FILES['images[]']['tmp_name'] = $files['tmp_name'][$key];
            $_FILES['images[]']['error'] = $files['error'][$key];
            $_FILES['images[]']['size'] = $files['size'][$key];

            $fileName = $title . '_' . $image;

            $images[] = $fileName;

            $config['file_name'] = $fileName;

            $this->upload->initialize($config);

            if ($this->upload->do_upload('images[]')) {
                $this->upload->data();
            } else {
                return false;
            }
        }
        return $images;
    }

    public function formBase64Array($imgArray)
    {
        $comb = [];
        foreach ($imgArray as $row) {
            array_push($comb, $row['drawing_base64']);
        }
        return $comb;
    }

    public function updateBrazingExpansion($id = null, $value = null)
    {
        $where = $id != null ? "where a.id = '$id' " : '';
        $qry = "update order_list a inner join lookup b on a.expansion_type = b.id and a.expansion_type <> '' 
        and (LOWER(b.lkp_value) = 'vertical' or LOWER(b.lkp_value) = 'Horizontal') set a.brazing_expansion = '$value' $where";
        $this->db->query($qry);
    }

    public function updateCE_Status($id = null)
    {
        $where = $id != null ? "where a.id = '$id' " : '';
        $qry1 = "update order_list a inner join lookup b on a.expansion_type = b.id and a.expansion_type <> '' 
        and LOWER(b.lkp_value) not in ('vertical','Horizontal') set a.ce_status = 'true'  $where;";
        $this->db->query($qry1);

        return true;
    }

    public function createBrazingQuantity($orderId, $quantity, $splitid = null)
    {
        if ($quantity > 0) {
            $insArr = [];
            $this->db->trans_start();
            $splitid = is_null($splitid) ? '' : $splitid;
            for ($i = 1; $i <= $quantity; $i++) {
                array_push($insArr, array('order_id' => $orderId, 'split_id' => $splitid, 'series_id' => $i));
                $this->db->insert('brazing_details', array('order_id' => $orderId, 'split_id' => $splitid, 'series_id' => $i, 'series_ref' => $orderId . $splitid . '-' . $i));
            }
            $this->db->trans_complete();
            $this->updateOrderQuantity($orderId, $splitid);
            return $this->db->trans_status();
        }
        return false;
    }

    public function updateOrderQuantity($orderId, $splitId)
    {
        $splitId = is_null($splitId) ? '' : $splitId;
        $count = $this->db->get_where('brazing_details', array('order_id' => $orderId, 'split_id' => $splitId))->num_rows();

        $this->db->where('order_id', $orderId);
        $this->db->where('split_id', $splitId);
        $this->db->update('order_list', array('quantity' => $count));
    }

    public function getAlphabet($alph)
    {
        $alphabet = range('A', 'Z');
        $ind = array_search($alph, $alphabet);
        return $alphabet[$ind + 1];
    }

    public function setBrazingDetail($orderId, $splitId, $parentData, $childData)
    {


        $this->db->trans_start();

        $this->db->where('order_id', $orderId);
        $this->db->where('split_id', '');
        $this->db->delete('brazing_details');

        $i = 0;
        foreach ($childData as $row) {
            $childData[$i]['split_id'] = $splitId;
            $i = $i + 1;
        }

        $data = array_merge($parentData, $childData);
        $i = 0;
        foreach ($data as $row) {
            if ($this->db->insert('brazing_details', $row)) {
                $i = $i + 1;
            }
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "$i number of details updated.";
        } else {
            $this->db->trans_commit();
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = "Transaction not completed please try again";
        }
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = "$i number of details updated.";

        return $ret_data['status_msg'];
    }
    public function getBrazingDetailsObj($orderId, $splitId)
    {

        $this->db->select('id, order_id, split_id, series_id,series_ref, leak, A, B,  D, E, F, G, H, K, L, N, uBend, inletOutlet, headder, headderFix, distributor, distributorFix, completion');
        $this->db->where('order_id', $orderId);
        if ($splitId !== null) {
            $this->db->where('split_id', $splitId);
        }
        return $this->db->get("brazing_details");
    }

    public function createSplitOrderId($orderId)
    {
        $this->db->limit(1);
        $this->db->order_by('split_id', 'desc');
        $orderDetail = $this->db->get_where('order_list', array('order_id' => $orderId));
        $alphaSplit = 'A';
        if ($orderDetail->num_rows() > 0) {
            if ($orderDetail->row()->split_id !== '') {
                $alphaSplit = $this->getAlphabet($orderDetail->row()->split_id);
            }
        }
        return $alphaSplit;
    }

    public function retQueryClause($pageType)
    {
        $where_clause = '';
        $order_by = '';
        if ($pageType == 'cncNesting') {
            $where_clause = "where order_status ='1' and hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status<>'true'";
            $order_by = "order by a.end_plate_material,  a.order_id asc";
            $fieldName = 'cnc_nesting_status';
        } elseif ($pageType == 'cncPunchingNumbering') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status='true' and a.cnc_punching_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'cnc_punching_status';
        } elseif ($pageType == 'endPlateBending') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.cnc_nesting_status='true' and a.cnc_punching_status='true' and a.bending_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'bending_status';
        } elseif ($pageType == 'tubeCuttingBending') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.tcutting_status<>'true'";
            $order_by = "order by a.pipe_type, a.order_id asc";
            $fieldName = 'tcutting_status';
        } elseif ($pageType == 'finsPuncing') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.finpunch_status<>'true'";
            $order_by = "order by a.fin_per_inch,  a.order_id asc";
            $fieldName = 'finpunch_status';
        } elseif ($pageType == 'coilAssembly') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.bending_status='true' and a.tcutting_status='true' and  a.finpunch_status='true' and a.ca_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'ca_status';
        } elseif ($pageType == 'coilExpansion') {
            $where_clause = "inner join lookup i on i.lkp_value <>'' and a.expansion_type = i.id and LOWER(i.lkp_value) <> 'hydraulic'
                where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.ca_status='true' and a.ce_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'ce_status';
        } elseif ($pageType == 'brazingTesting') {
            $where_clause = "inner join lookup i on i.lkp_value <>'' and a.expansion_type = i.id and (((LOWER(i.lkp_value) = 'vertical' or LOWER(i.lkp_value) = 'horizontal') 
            and ce_status ='true') 
                or (LOWER(i.lkp_value) = 'hydraulic' and ca_status ='true')) where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.ca_status='true' and a.brazing_status<>'true' ";
            $order_by = "order by a.order_id asc";
            $fieldName = 'brazing_status';
        } elseif ($pageType == 'paintingPacking') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.brazing_status='true' and a.pp_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'pp_status';
        } elseif ($pageType == 'dispatch') {
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.pp_status='true' and a.dispatch_status<>'true'";
            $order_by = "order by a.order_id asc";
            $fieldName = 'dispatch_status';
        }
        /*elseif($pageType === "scheduler") {

            $where_clause = "where a.pp_status!='true'";
            $order_by = "order by a.order_id asc";
            $fieldName = '';
        }*/ else {
            $where_clause = "where order_status ='1' and a.dispatch_status<>'true' ";
            $order_by = "order by a.order_id asc";
            $fieldName = '';
        }

        $retval['where_clause'] = $where_clause;
        $retval['order_by'] = $order_by;
        $retval['fieldName'] = $fieldName;

        return $retval;
    }

    public function lookupIdToValue($lkpStr, $lkpCat)
    {
        $lkpStr_Split = explode(",", $lkpStr);
        $ret_str = '';
        if (count($lkpStr_Split) > 0) {
            foreach ($lkpStr_Split as $row) {
                if (trim($row) <> '') {
                    if ($lkpCat == 'coverDetail') {
                        $ret_q = $this->db->get_where('lookup', array('category' => $lkpCat, 'id' => $row))->row();
                        $ret_str = isset($ret_q->sublkp_val) ? $ret_q->sublkp_val . ',' . $ret_str : '' . ',' . $ret_str;
                    } else if ($lkpCat == 'coverType') { // input is the cover Detail data;
                        $ret_q = $this->db->get_where('lookup', array('category' => "coverDetail", 'id' => $row))->row();
                        $lkp_value = isset($ret_q->lkp_value) ? $ret_q->lkp_value : '';
                        $ret_q = $this->db->get_where('lookup', array('category' => $lkpCat, 'id' => $lkp_value))->row();
                        $ret_str = isset($ret_q->lkp_value) ? $ret_q->lkp_value . ',' . $ret_str : '' . ',' . $ret_str;
                    } else {
                        $ret_q = $this->db->get_where('lookup', array('category' => $lkpCat, 'id' => $row))->row();
                        $ret_str = isset($ret_q->lkp_value) ? $ret_q->lkp_value . ',' . $ret_str : '' . ',' . $ret_str;
                    }
                }
            }
        }
        return $ret_str;
    }

    public function splitLookupString($lkpStr)
    {
        $lkpstr = trim($lkpStr);
    }
}
