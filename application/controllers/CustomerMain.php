<?php
defined('BASEPATH') or exit('No direct script access allowed');

class CustomerMain extends CI_Controller
{

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     *	- or -
     * 		http://example.com/index.php/welcome/index
     *	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see https://codeigniter.com/user_guide/general/urls.html
     */
    public function index()
    {
        $data['page_name'] = 'order_status';
        $this->load->view('customerportal/index', $data);
    }

    public function modalView($pageName, $param1 = "", $param2 = "", $param3 = "")
    {
        $pageData['param1'] = $param1;
        $pageData['param2'] = $param2;
        $pageData['param3'] = $param3;
        if (isset($_POST)) {
            $pageData['pdata'] = $this->mm->arrayToDataArray($_POST);
        }

        return $this->load->view('customerportal/modal/' . $pageName . ".php", $pageData);
    }

    public function change_password()
    {
        if (trim($this->input->post('new_pwd'))  != '') {
            $this->db->where('id', $this->input->post('customer_id'));
            $this->db->update('customers', array('password' => $this->input->post('new_pwd')));
        }
        header('Location: ' . base_url('index.php/customerMain'));
    }

    public function send_otp()
    {
        $email = $this->input->post('email');
        echo $this->cm->OTP_SEND($email);
    }
}
