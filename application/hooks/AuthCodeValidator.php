<?php
class AuthCodeValidator {
    public function validateCode() {
        // Access CI instance
        $ci =& get_instance();
        $ci->load->model('mm');

        // Retrieve token from header or wherever it's stored
        $token = $ci->input->post('authId');
        // Validate the token
        // (Implement your token validation logic here)
        if (!$this->isValidToken($token,$ci)) {
            $ret_data['status_code'] = 401;
            $ret_data['status_msg'] = "Access Code not correct, Please login again.";
            echo json_encode($ret_data);
            return;
        }
    }

    private function isValidToken($token,$ci) {
        if ($ci->mm->access_code_verify($token)){
            return true; // Placeholder, return true or false based on validity
        } else {
            return false;
        }
    }
}
