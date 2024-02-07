<?php

defined('BASEPATH') or exit('No direct script access allowed');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");

class One extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->db->query("SET time_zone='+5:30'");
        $this->load->helper('image');
    }
    public function index()
    {
        //log_message('debug',print_r($this->im->process(),true));
        echo $this->im->process();
    }
}