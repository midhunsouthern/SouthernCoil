<?php

defined('BASEPATH') or exit('No direct script access allowed');

class CustomerModal extends CI_Model
{
    public function customerBasedOrderlist($customerId = '', $orderActive = 0, $order_rowid = '')
    {
        $order_que = '';
        if ($order_rowid != '') {
            $order_que = " and a.id='$order_rowid'";
        }

        $liveClause = '';
        if ($orderActive == 'live') {
            $liveClause = "where order_status = 1 and dispatch_status <> 'true' and a.customer_name='$customerId' $order_que";
        } else if ($orderActive == 'history') {
            $liveClause = "where dispatch_status = 'true' and a.customer_name='$customerId' $order_que";
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
            a.tcutting_roll_no,
            a.finpunching_foilno,
            a.ca_actualfpi,
            a.priority,
            a.hold,
            a.order_status,
            a.coil_ready_at,
            a.est_delivery_date,
            a.cnc_nesting_status,
            a.cnc_punching_status,
            a.bending_status,
            a.tcutting_status,
            a.finpunch_status,
            a.ca_status,
            a.ce_status,
            a.brazing_status,
            a.pp_status,
            a.dispatch_status,
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
        return $newOrderList;
    }

    public function  getThickValue($finPerInch)
    {
        $mapper = array(
            "T" => "0.15mm Thick",
            "H" => "0.13mm Thick",
            "B" => "0.12mm Thick Hydrophilic blue Aluminum",
            "PP" => "Not Applicable",
            // Add more mappings as needed
        );
        if (strpos("-", $finPerInch)) {
            $finPerInch = strtoupper(trim(explode("-", $finPerInch)[0]));
        }
        if (gettype($finPerInch) === "string") {
            $finPerInch = strtoupper($finPerInch);
        }
        if (isset($mapper[$finPerInch])) {
            return $mapper[$finPerInch];
        } else {
            // If value is not found in mapper, return a default value
            return "0.12mm Thick"; // You can set your default value here
        }
    }
    public function OTP_SEND($email)
    {

        $otp =  rand(1000, 9999);
        $this->db->where('email', $email);
        $this->db->set('otp', $otp);
        $this->db->update('customers');
        if ($this->db->affected_rows() > 0) {
            $msg = "Welcome \n Your Login OTP to login is $otp";
            $mail = mail($email, "Southerncoil login OTP", $msg);
            if ($mail) {
                return "OTP Set to your email, if not received refer your spam folder as well.";
            } else {
                return "Unable to send email";
            }
        }
        return "This email is not registered with us, please contact us at +91-8939277606 or email to info@southerncoil.com to register yourself.";
    }
}
