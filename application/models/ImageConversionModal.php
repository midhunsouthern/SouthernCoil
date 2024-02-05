<?php
defined('BASEPATH') or exit('No direct script access allowed');
ini_set('memory_limit', '256M'); // Increase to 256 MB

class ImageConversionModal extends CI_Model{
function process(){
    $totalImageChange=0;
    $image_path = realpath(APPPATH . '../uploads');
    $orderIdList=$this->db->get_where('order_list')->result_array();
    foreach ($orderIdList as $orderKey => $orderValue) {
        $orders[$orderValue['id']]['ep']=$orderValue['ep_photo'];
        $orders[$orderValue['id']]['asm']=$orderValue['assembly_Photo'];
        $orders[$orderValue['id']]['bz']=$orderValue['brazing_Photo'];
    }
    log_message('debug',print_r($orders,true));
    $imageList=[
        'ep',
        'asm',
        'bz'
    ];
    foreach($orders as $key => $value) {
    foreach($imageList as $imageKey =>$imageListValue) {
        
            if(count($value)>0){
            log_message('debug',print_r($value[$imageListValue],true));
            $drawingImages=$this->db->get_where('drawing_images',array('drawing_refid'=>$value[$imageListValue]))->result_array();
            log_message('debug',print_r(count($drawingImages),true));
            if(count($drawingImages)>0){
            
            $logMessage = (preg_match('/\.webp/', $drawingImages[0]['drawing_base64']) ? "Yes" : "No");
            if($logMessage=='No'){
                log_message('debug',print_r($key,true));    
            $webpData=convert_base64_to_webp($drawingImages[0]['drawing_base64'],$image_path,$key);
            $this->db->insert('drawing_images', array('drawing_refid' => $key, 'drawing_base64' => $webpData,'order_type'=>1,'draw_type'=>$imageListValue));
            $totalImageChange++;
            }
        }
        }
    }
}
return 'Total Image Changes:'.$totalImageChange;
}
}