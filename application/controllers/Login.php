<?php

defined('BASEPATH') or exit('No direct script access allowed');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");

class Login extends CI_Controller
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
     */
    public function index()
    {
        $this->load->view('index');
    }

    public function signup()
    {
        $ret_data = array();
        $data = $this->db->arrayToDataArray($_POST);
        if ($this->db->insert('access_profile', $data)) {
            $ret_data['status_code'] = 200;
            $ret_data['status_msg'] = 'Signup Successful';
        } else {
            $ret_data['status_code'] = 304;
            $ret_data['status_msg'] = 'Signup Not-Successful';
        }

        echo json_encode($ret_data);
    }
    public function login_acc()
    {
        $ret_data = array();
        $uname = $this->input->post('username');
        $pwd = $this->input->post('password');

        $acc = $this->db->get_where('access_profile', array('username' => $uname, 'password' => $pwd));
        if ($acc->num_rows() == 1) {
            $acc_code = time() . $uname;
            $this->db->where('username', $uname);
            $ret = $this->db->update('access_profile', array('access_code' => $acc_code));

            if ($this->mm->update_access_time($acc_code) && ($ret)) {
                $ret_data['accessModuleList'] = $this->db->query("SELECT a.module_name, a.access_rw  FROM module_access a inner join access_profile b on a.access_type = b.access_type where b.access_code ='$acc_code';")->result_array();
                $ret_data['access_code'] = $acc_code;
                $ret_data['status_code'] = 200;
                $ret_data['status_msg'] = 'Login Successful';
            } elseif (!$this->mm->update_access_time($acc_code)) {
                $ret_data['status_code'] = 202;
                $ret_data['status_msg'] = 'Access Time not updated';
            } elseif (!($ret)) {
                $ret_data['status_code'] = 202;
                $ret_data['status_msg'] = 'Access code not updated';
            }
        } else {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Login Not-Successful';
        }
        echo json_encode($ret_data);
    }

    public function accessVerify()
    {
        $ret_data['status_code'] = 200;
        $ret_data['status_msg'] = 'Access Valid';

        $acc = $this->input->post('access_code');
        $ret_q = $this->db->query("SELECT * FROM `access_profile` where access_code ='$acc';");

        if ($ret_q->num_rows() == 0) {
            $ret_data['status_code'] = 201;
            $ret_data['status_msg'] = 'Access inValid';
        }
        echo json_encode($ret_data);
    }
    public function logout()
    {
        $this->session->sess_destroy();
        $this->load->view('login');
    }


    /** Customer portal access code */
    public function customer_access()
    {
        $email = $this->input->post('email');
        $pwd = $this->input->post('password');

        $acc = $this->db->query("SELECT * FROM `customers` where email ='$email' and (password ='$pwd' or otp ='$pwd')");

        if ($acc->num_rows() == 1) {
            $this->session->set_userdata('phone', $acc->row()->phone);
            $this->session->set_userdata('customer_row_id', $acc->row()->id);
            $this->session->set_flashdata('success', 'Access Granted');
        } else {
            $this->session->set_flashdata('error', 'Credential not correct, please try again.');
        }

        header("Location: " . base_url('index.php/customerMain'));
    }

    public function customer_logout()
    {
        $this->session->sess_destroy();
        header("Location: " . base_url('index.php/customerMain'));
    }
    /** End Customer portal access code */
}
