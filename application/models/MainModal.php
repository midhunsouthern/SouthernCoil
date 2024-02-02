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
    /**
     * Save Order
     */
    public function saveOrder($data,$orderId,$type){
        try {
            $ref_data=[];
            $statusCode='';
            $message='';
            $orderType=1;
            $orderTableName='order_list';
            if($orderId!=''){
                //Check Type 
                if($type=='save'){
                    $orderTableName='order_list_saved';
                    $orderType=0;
                }
                unset($data['id']);
                $this->db->where('id', $orderId);
                if ($this->db->update($orderTableName, $data)) {
                    $this->updateCE_Status($orderId);
                    $this->saveImageOrder($orderId,$orderType);
                    $statusCode= 200;
                    $message = 'Order Data Update Successful';
                } else {
                    $statusCode = 201;
                    $message = 'Order Data Update UnSuccessful';
                }
            } else {
                if ($type == 'submit') {
                    $data['order_id'] = $this->createOrderId();
                    $orderTableName = 'order_list';
                    $orderId = strval($data['order_id']);
                    $orderType=1;
                } elseif ($type == 'save') {
                    $orderTableName = 'order_list_saved';
                    $orderId = 'n/a';
                    $orderType=0;
                }
                if ($this->db->insert($orderTableName, $data)) {
                    $refId=$this->db->insert_id();
                    if ($orderType == 1) {
                        $this->createBrazingQuantity($data['order_id'], $data['quantity']);
                    }
                    $this->saveImageOrder($refId,$orderType);
                    $statusCode= 200;
                    $message = 'Order Saved Successful';
                }
            }
            return [
                'status_code'=>$statusCode,
                'message'=>$message,
                'order_id'=>$orderId
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    /**
     * Save Images against order id
     */
    private function saveImageOrder($refId,$orderType){
        try {
            $image_path = realpath(APPPATH . '../uploads');
            $imageKeys=[
                'ep'=>'ep',
                'asm'=>'assembly',
                'bz'=>'brazing'
            ];
            log_message('debug','Image Order');
            log_message('debug',$orderType);
            $fetchData=$this->db->select('drawing_base64')
                            ->from('drawing_images')
                            ->where(['drawing_refid'=>$refId,'order_type'=>$orderType])
                            ->get();
                            log_message('debug',json_encode($fetchData->result_array()));
                            $resultSet=$fetchData->result_array();
                            log_message('debug',print_r($resultSet,true));
                            if(count($resultSet)>0){
                                foreach($resultSet as $key=>$value){
                                    if(file_exists($image_path.'/'.$value['drawing_base64'])){ 
                                        if(unlink($image_path.'/'.$value['drawing_base64'])){
                                            log_message('debug','File deleted');
                                        } else {
                                            log_message('debug','Not Deleted');
                                        }
                                    }
                                }
                            }
            $this->db->delete('drawing_images',['drawing_refid'=>$refId,'order_type'=>$orderType]);
    
    foreach($imageKeys as $keys=>$value){
        if(isset($_POST[$value.'Photo'])){
            foreach ($_POST[$value.'Photo'] as $row) {


                $logMessage = (preg_match('/\.webp/', $row) ? "Yes" : "No");
                log_message('debug',print_r($logMessage,true));
                if($logMessage=='No'){
                    $webpData=convert_base64_to_webp($row,$image_path,$refId);
                } else {
                    // Use parse_url() to extract the path part of the URL
                    $path = parse_url($row, PHP_URL_PATH);
                    // Use basename() to get the filename from the path
                    $filename = basename($path);
                    $webpData=$filename;
                }

                 
                 $this->db->insert('drawing_images', array('drawing_refid' => $refId, 'drawing_base64' => $webpData,'order_type'=>$orderType,'draw_type'=>$keys));
                 $data[$value.'_Photo']=$refId;
        }
        }
    }
        } catch (\Throwable $th) {
            throw $th;
        }
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
        $qry = "UPDATE order_list ol
        inner join (select count(h.order_id) as qty, ROUND((ol.length * ol.height * ol.rows * count(h.order_id)) / 144) as sq_feet , ol.order_id, ol.split_id
        from order_list ol left join brazing_details h on ol.order_id = h.order_id and ol.split_id = h.split_id group by ol.order_id, ol.split_id) t 
        on ol.order_id = t.order_id and ol.split_id = t.split_id 
        set ol.quantity = t.qty, ol.sq_feet = t.sq_feet 
        where ol.order_id = '$orderId' and ol.split_id='$splitId';";

        return $this->db->query($qry);
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
        $this->updateOrderQuantity($orderId, $splitId);
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
        $brazingData=$this->db->get("brazing_details")->result_array();
        foreach ($brazingData as $key => $value) {
            $brazingData[$key]['brazing_photo']=$this->db->select('drawing_base64')->from('drawing_images')->where(['order_serial_ref'=>$value['series_ref']])->get()->result_array();
            log_message('debug',print_r($value,true));
        }
        return $brazingData;
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
            $where_clause = "where order_status ='1' and  hold<>'true' and a.dispatch_status<>'true' and a.pp_status='true'";
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

    public function pendingSQ_graph()
    {
        $fieldName = array(
            'CNC Nesting' => 'cncNesting', 'CNC Punching' => 'cncPunchingNumbering', 'CNC Bending' => 'endPlateBending', 'Tube Cutting' => 'tubeCuttingBending',
            'Fin Punch' => 'finsPuncing', 'Coil Assembly' => 'coilAssembly', 'Coil Expansion' => 'coilExpansion', 'Brazing Testing' => 'brazingTesting',
            'Paint & Packing' => 'paintingPacking',
            'Dispatch' => 'dispatch'
        );

        $count = array();
        $label = array();
        foreach ($fieldName as $key => $val) {
            $ret_clause = $this->retQueryClause($val);
            $cnt_pend = $this->db->query("select ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 )) as cnt_pend from order_list a " . $ret_clause['where_clause'] . ";")->row()->cnt_pend;
            array_push($count, $cnt_pend);
            array_push($label, $key);
        }
        $pendData['Label'] = $label;
        $pendData['Count'] = $count;
        return $pendData;
    }

    public function pendingGroupedSQ_graph()
    {
        $PendingSQ_Data = $this->pendingSQ_graph()['Count'];
        $count = array(
            $PendingSQ_Data[0] + $PendingSQ_Data[1] + $PendingSQ_Data[2], // cncnesting, punching, bending
            $PendingSQ_Data[3], //tubecutting
            $PendingSQ_Data[4] + $PendingSQ_Data[5], //finpuncing and coil assembly
            $PendingSQ_Data[6] + $PendingSQ_Data[7], //coilexpansion and brazinb 
            $PendingSQ_Data[8] // paint and packing
        );
        $label = array();
        $label = array(
            'End Plate',
            'Pipe',
            'Fin',
            'Brazing',
            'Paint & Packing'
        );
        $pendData['Label'] = $label;
        $pendData['Count'] = $count;
        return $pendData;
    }

    public function completedModelWiseSQ_graph()
    {
        $fieldName = array(
            'Order Dt' => 'ol_date', 'CNC Nesting' => 'cnc_nest_compsq', 'CNC Punching' => 'cnc_punch_compsq', 'CNC Bending' => 'bending_compsq', 'Tube Cutting' => 'tcutting_compsq',
            'Fin Punch' => 'finpunch_compsq', 'Coil Assembly' => 'ca_compsq', 'Coil Expansion' => 'ce_compsq', 'Brazing Testing' => 'brazing_compsq', 'Paint & Packing' => 'pp_compsq',
            'Dispatch' => 'dispatch_compsq'
        );

        $count['ol_date'] = array();
        $count['cnc_nest_compsq'] = array();
        $count['cnc_punch_compsq'] = array();
        $count['bending_compsq'] = array();
        $count['tcutting_compsq'] = array();
        $count['finpunch_compsq'] = array();
        $count['ca_compsq'] = array();
        $count['ce_compsq'] = array();
        $count['brazing_compsq'] = array();
        $count['pp_compsq'] = array();
        $count['dispatch_compsq'] = array();
        $label = array();

        $this->db->query('call create_past_date()');

        $query = "Select a.past_date as ol_date, cnc_nest_compsq,cnc_punch_compsq,bending_compsq,tcutting_compsq,finpunch_compsq,ca_compsq,ce_compsq,
brazing_compsq, pp_compsq, dispatch_compsq
from past_dates a 
left join (SELECT  count(cnc_nesting_status) as cnc_nest_count, sum(sq_feet) as cnc_nest_compsq, SUBSTRING(cnc_nesting_status_dt, 1, 10) as cnc_nest_stat_date 
FROM `order_list` where cnc_nesting_status= 'true' group by  cnc_nest_stat_date  order by cnc_nesting_status_dt desc ) b on a.past_date = b.cnc_nest_stat_date     
left join (SELECT  count(cnc_punching_status) as cnc_punch_count, sum(sq_feet) as cnc_punch_compsq, SUBSTRING(cnc_punching_status_dt, 1, 10) as cnc_punch_stat_date 
FROM `order_list` where cnc_punching_status= 'true' group by  cnc_punch_stat_date  order by cnc_punching_status_dt desc ) c on a.past_date = c.cnc_punch_stat_date    
left join (SELECT  count(bending_status) as bending_count, sum(sq_feet) as bending_compsq, SUBSTRING(bending_status_dt, 1, 10) as bending_stat_date 
FROM `order_list` where bending_status= 'true' group by  bending_stat_date  order by bending_status_dt desc ) d on a.past_date = d.bending_stat_date
left join (SELECT  count(tcutting_status) as tcutting_count, sum(sq_feet) as tcutting_compsq, SUBSTRING(tcutting_status_dt, 1, 10) as tcutting_stat_date 
FROM `order_list` where tcutting_status= 'true' group by  tcutting_stat_date  order by tcutting_stat_date desc ) e on a.past_date = e.tcutting_stat_date    
left join (SELECT  count(finpunch_status) as finpunch_count, sum(sq_feet) as finpunch_compsq, SUBSTRING(finpunch_status_dt, 1, 10) as finpunch_stat_date 
FROM `order_list` where finpunch_status= 'true' group by  finpunch_stat_date  order by finpunch_status_dt desc ) f on a.past_date = f.finpunch_stat_date  
left join (SELECT  count(ca_status) as ca_count, sum(sq_feet) as ca_compsq, SUBSTRING(ca_status_dt, 1, 10) as ca_stat_date 
FROM `order_list` where ca_status= 'true' group by  ca_stat_date  order by ca_status_dt desc ) g on a.past_date = g.ca_stat_date  
left join (SELECT  count(ce_status) as ce_count, sum(sq_feet) as ce_compsq, SUBSTRING(ce_status_dt, 1, 10) as ce_stat_date 
FROM `order_list` where ce_status= 'true' group by  ce_stat_date  order by ce_status_dt desc ) h on a.past_date = h.ce_stat_date   
left join (SELECT  count(brazing_status) as brazing_count, sum(sq_feet) as brazing_compsq, SUBSTRING(brazing_status_dt, 1, 10) as brazing_stat_date 
FROM `order_list` where brazing_status= 'true' group by  brazing_stat_date  order by brazing_status_dt desc ) i on a.past_date = i.brazing_stat_date    
left join (SELECT  count(pp_status) as pp_count, sum(sq_feet) as pp_compsq, SUBSTRING(pp_status_dt, 1, 10) as pp_stat_date 
FROM `order_list` where pp_status= 'true' group by  pp_stat_date  order by pp_status_dt desc ) j on a.past_date = j.pp_stat_date 
left join (SELECT  count(dispatch_status) as dispatch_count, sum(sq_feet) as dispatch_compsq, SUBSTRING(dispatch_status_dt, 1, 10) as dispatch_stat_date 
FROM `order_list` where dispatch_status= 'true' group by  dispatch_stat_date  order by dispatch_status_dt desc ) k on a.past_date = k.dispatch_stat_date    
group by ol_date having cnc_nest_compsq <> 0 and cnc_punch_compsq <> 0 and bending_compsq  <> 0 and tcutting_compsq <> 0 and finpunch_compsq <> 0 and ca_compsq  <> 0 and ce_compsq <> 0 and 
brazing_compsq <> 0 and  pp_compsq <> 0 and dispatch_compsq <> 0 order by ol_date desc limit 10 ";

        $comp_data = $this->db->query($query)->result_array();
        foreach ($fieldName as $key => $val) {;
            foreach ($comp_data as $row) {
                array_push($count[$val], is_null($row[$val]) ? 0 : $row[$val]);
            }
            array_push($label, $key);
        }
        $retdata['CountData'] = $count;
        $retdata['Label'] = $label;
        $retdata['AllData'] = $comp_data;
        return $retdata;
    }

    public function completedModuleOverAllSQ_graph()
    {
        $count = array();
        $label = array();
        $this->db->query('call create_past_date()');
        $query =
            "Select a.past_date as order_dt, 
(ifnull(cnc_nest_compsq,0)+ ifnull(cnc_punch_compsq,0) + ifnull(bending_compsq,0)+
        ifnull(tcutting_compsq,0) + ifnull(finpunch_compsq,0) + ifnull(ca_compsq,0) + ifnull(ce_compsq,0) +
        ifnull(brazing_compsq,0) + ifnull(pp_compsq,0) + ifnull(dispatch_compsq,0))  as over_all 
from past_dates a 
left join (SELECT  count(cnc_nesting_status) as cnc_nest_count, sum(sq_feet) as cnc_nest_compsq, SUBSTRING(cnc_nesting_status_dt, 1, 10) as cnc_nest_stat_date 
FROM `order_list` where cnc_nesting_status= 'true' group by  cnc_nest_stat_date  order by cnc_nesting_status_dt desc ) b on a.past_date = b.cnc_nest_stat_date     
left join (SELECT  count(cnc_punching_status) as cnc_punch_count, sum(sq_feet) as cnc_punch_compsq, SUBSTRING(cnc_punching_status_dt, 1, 10) as cnc_punch_stat_date 
FROM `order_list` where cnc_punching_status= 'true' group by  cnc_punch_stat_date  order by cnc_punching_status_dt desc ) c on a.past_date = c.cnc_punch_stat_date    
left join (SELECT  count(bending_status) as bending_count, sum(sq_feet) as bending_compsq, SUBSTRING(bending_status_dt, 1, 10) as bending_stat_date 
FROM `order_list` where bending_status= 'true' group by  bending_stat_date  order by bending_status_dt desc ) d on a.past_date = d.bending_stat_date
left join (SELECT  count(tcutting_status) as tcutting_count, sum(sq_feet) as tcutting_compsq, SUBSTRING(tcutting_status_dt, 1, 10) as tcutting_stat_date 
FROM `order_list` where tcutting_status= 'true' group by  tcutting_stat_date  order by tcutting_stat_date desc ) e on a.past_date = e.tcutting_stat_date    
left join (SELECT  count(finpunch_status) as finpunch_count, sum(sq_feet) as finpunch_compsq, SUBSTRING(finpunch_status_dt, 1, 10) as finpunch_stat_date 
FROM `order_list` where finpunch_status= 'true' group by  finpunch_stat_date  order by finpunch_status_dt desc ) f on a.past_date = f.finpunch_stat_date  
left join (SELECT  count(ca_status) as ca_count, sum(sq_feet) as ca_compsq, SUBSTRING(ca_status_dt, 1, 10) as ca_stat_date 
FROM `order_list` where ca_status= 'true' group by  ca_stat_date  order by ca_status_dt desc ) g on a.past_date  = g.ca_stat_date  
left join (SELECT  count(ce_status) as ce_count, sum(sq_feet) as ce_compsq, SUBSTRING(ce_status_dt, 1, 10) as ce_stat_date 
FROM `order_list` where ce_status= 'true' group by  ce_stat_date  order by ce_status_dt desc ) h on a.past_date = h.ce_stat_date   
left join (SELECT  count(brazing_status) as brazing_count, sum(sq_feet) as brazing_compsq, SUBSTRING(brazing_status_dt, 1, 10) as brazing_stat_date 
FROM `order_list` where brazing_status= 'true' group by  brazing_stat_date  order by brazing_status_dt desc ) i on a.past_date = i.brazing_stat_date    
left join (SELECT  count(pp_status) as pp_count, sum(sq_feet) as pp_compsq, SUBSTRING(pp_status_dt, 1, 10) as pp_stat_date 
FROM `order_list` where pp_status= 'true' group by  pp_stat_date  order by pp_status_dt desc ) j on a.past_date = j.pp_stat_date 
left join (SELECT  count(dispatch_status) as dispatch_count, sum(sq_feet) as dispatch_compsq, SUBSTRING(dispatch_status_dt, 1, 10) as dispatch_stat_date 
FROM `order_list` where dispatch_status= 'true' group by  dispatch_stat_date  order by dispatch_status_dt desc ) k on a.past_date = k.dispatch_stat_date    
group by order_dt having over_all <> 0 order by order_dt desc limit 10;";

        $comp_data = $this->db->query($query)->result_array();
        foreach ($comp_data as $row) {
            array_push($count, $row['over_all']);
            array_push($label, $row['order_dt']);
        }

        $completeData['Label'] = $label;
        $completeData['Count'] = $count;
        return $completeData;
    }
    public function dataSummary()
    {
        $query = "SELECT count(*) live_order,ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id 
        and a.split_id = b.split_id)) /144 )) as live_sq
        FROM `order_list` a WHERE order_status = 1 and dispatch_status <> 'true'";
        $summ1 = $this->db->query($query)->row();

        $query = "SELECT count(*) as completed_order FROM `order_list` a WHERE hold <> 'true' and order_status = 1 and pp_status = 'true' and dispatch_status <> 'true'";
        $summ2 = $this->db->query($query)->row();

        $query = "SELECT coil_ready_at FROM `order_list` a WHERE pp_status <> 'true' and hold <> 'true' and order_status = 1 and coil_ready_at is not null order by coil_ready_at desc limit 1";
        $summ3 = $this->db->query($query)->row();

        $query = "select sum(cw.pending_work) as completed_work from (SELECT  
ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 )) *
(case a.cnc_nesting_status when 'true' then 1 else 0 end +
case a.cnc_punching_status when 'true' then 1 else 0 end +
case a.bending_status when 'true' then 1 else 0 end +
case a.tcutting_status when 'true' then 1 else 0 end +
case a.finpunch_status when 'true' then 1 else 0 end +
case a.ca_status when 'true' then 1 else 0 end +
case a.ce_status when 'true' then 1 else 0 end +
case a.brazing_status when 'true' then 1 else 0 end +
case a.pp_status when 'true' then 1 else 0 end) as pending_work
FROM order_list a 
where  dispatch_status <> 'true' and order_status = 1 and hold <> 'true' GROUP by order_id) cw";
        $summ4 = $this->db->query($query)->row();

        $query = "select sum(pw.pending_work) as pending_work from (SELECT  
ROUND(SUM((a.length * a.height * a.rows * (select count(b.order_id) from brazing_details b where a.order_id = b.order_id and a.split_id = b.split_id)) /144 )) *
(case a.cnc_nesting_status when 'true' then 0 else 1 end +
case a.cnc_punching_status when 'true' then 0 else 1 end +
case a.bending_status when 'true' then 0 else 1 end +
case a.tcutting_status when 'true' then 0 else 1 end +
case a.finpunch_status when 'true' then 0 else 1 end +
case a.ca_status when 'true' then 0 else 1 end +
case a.ce_status when 'true' then 0 else 1 end +
case a.brazing_status when 'true' then 0 else 1 end +
case a.pp_status when 'true' then 0 else 1 end) as pending_work
FROM order_list a 
where  dispatch_status <> 'true' and order_status = 1 and hold <> 'true' GROUP by order_id) pw";
        $summ5 = $this->db->query($query)->row();

        $query = "SELECT count(*) as coil_qty FROM order_list a inner join brazing_details b on a.order_id = b.order_id and b.split_id = b.split_id where a.dispatch_status <> 'true' and order_status =1";
        $summ6 = $this->db->query($query)->row();

        $data['live_orders'] = $summ1->live_order;
        $data['live_sq'] = $summ1->live_sq;
        $data['coil_qty'] = $summ6->coil_qty;
        $data['completed_orders'] = $summ2->completed_order;
        $data['pending_orders'] = (int)$summ1->live_order - (int)$summ2->completed_order;
        $data['last_ready'] = $summ3->coil_ready_at;
        $data['completed_work'] = $summ4->completed_work;
        $data['pending_work'] = $summ5->pending_work;
        $total_work = $data['completed_work'] + $data['pending_work'];
        $data['completed_work_cent'] = round(($data['completed_work'] / $total_work) * 100);
        $data['pending_work_cent'] = round(($data['pending_work'] / $total_work) * 100);
        $data['pending_man_hours'] = round($data['pending_work'] / 5400, 1); //(average ourput 600 * no of modules 9)
        return $data;
    }
}
