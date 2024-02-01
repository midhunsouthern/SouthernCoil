<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

function convert_base64_to_webp($base64_image, $output_path, $webpName,$quality = 60)
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
    $data=convert_file_to_webp($temp_image_path, $output_path,$webpName, $quality);
    unlink($temp_image_path);
    return $data;
}
function correctImageOrientation($original_image, $image_path) {
    $exif = exif_read_data($image_path);
    if ($exif && isset($exif['Orientation'])) {
        $orientation = $exif['Orientation'];
        if ($orientation != 1) {
            $deg = 0;
            switch ($orientation) {
                case 3:
                    $deg = 180;
                    break;
                case 6:
                    $deg = 270;
                    break;
                case 8:
                    $deg = 90;
                    break;
            }
            if ($deg) {
                $original_image = imagerotate($original_image, $deg, 0);
            }
        }
    }
    return $original_image;
}
function convert_file_to_webp($image_path, $output_path,$webpName, $quality = 80)
{
        if (extension_loaded('gd') && function_exists('imagewebp')) {
        $image_info = getimagesize($image_path);
        $image_type = $image_info[2];
        $uuid = generate_uuid();
        $webFileName=$uuid.'.webp';
        $webpImagePath=$output_path.'/'.$webFileName;
        switch ($image_type) {
            case IMAGETYPE_JPEG:
                $original_image = imagecreatefromjpeg($image_path);
                $original_image = correctImageOrientation($original_image, $image_path);
                break;
            case IMAGETYPE_PNG:
                $original_image = imagecreatefrompng($image_path);
                break;
            default:
                echo 'Unsupported image type.';
                return;
        }
        imagewebp($original_image, $webpImagePath, $quality);
        imagedestroy($original_image);
        return $webFileName;
        } else {
       return false;
    }
}