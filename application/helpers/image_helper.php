<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

function convert_base64_to_webp($base64_image, $output_path, $quality = 60)
{
    $base64_image = preg_replace('/^data:image\/(jpeg|png|webp);base64,/', '', $base64_image);
    $image_data = base64_decode($base64_image);
    $image_info = getimagesizefromstring($image_data);
    if ($image_info === false) {
        echo 'Invalid base64-encoded image.';
        return;
    }

    $image_type = $image_info[2];
    $temp_image_path = tempnam(sys_get_temp_dir(), 'webp_conversion_');
    file_put_contents($temp_image_path, $image_data);
    $data=convert_file_to_webp($temp_image_path, $output_path, $quality);
    unlink($temp_image_path);
    return $data;
}

function convert_file_to_webp($image_path, $output_path, $quality = 80)
{
        if (extension_loaded('gd') && function_exists('imagewebp')) {
        $image_info = getimagesize($image_path);
        $image_type = $image_info[2];
        $webpImagePath=$output_path.'dd.webp';
        switch ($image_type) {
            case IMAGETYPE_JPEG:
                $original_image = imagecreatefromjpeg($image_path);
                break;
            case IMAGETYPE_PNG:
                $original_image = imagecreatefrompng($image_path);
                break;
            default:
                echo 'Unsupported image type.';
                return;
        }
        imagewebp($original_image, $webpImagePath, $quality);
        $imageData=file_get_contents($webpImagePath);
        $base64Webp=base64_encode($imageData);
        $src = 'data:'.mime_content_type($webpImagePath).';base64,'.$base64Webp;
        imagedestroy($original_image);
        imagedestroy(imagecreatefromwebp($webpImagePath));
        return $src;
        } else {
       return false;
    }
}