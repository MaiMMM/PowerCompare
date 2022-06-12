<?php
    include('inc/phpFITFileAnalysis.php');
    // file upload
    $all_test_passed = true;
    if(isset($_FILES['myFiles']['name'])) {
        //some stats of the uploads
        $fit_upload_name = $_FILES['myFiles']['name']; //array of file name
        $total_size = 0; //total size of the file
        $allowed_ext = array("fit"); //allowed file type
        $num_files = count($fit_upload_name); //number of file uploaded


        //stat reports
        if($num_files > 5){echo "more than five files";}

        echo "total number of file uploaded: " . count($fit_upload_name). "\n";
        for($i = 0; $i < count($fit_upload_name); $i++){
            //file extension of each file
            $file_ext = explode('.', $fit_upload_name[$i]);
            $file_ext = strtolower(end($file_ext));
            echo "file name: " . $fit_upload_name[$i] . 
            " ### filesize: " . $_FILES['myFiles']['size'][$i] . 
            " ### file type: " . $file_ext . "\n";

            //add to total size
            $total_size += $_FILES['myFiles']['size'][$i];

            //file type check(must be fit, more type might be supported in the future)
            if (!in_array($file_ext,$allowed_ext)){
                echo "ERROR: one or some of the file types are not supported!";
                $all_test_passed = false;
                break;
            } 
        }

        //size check (if > 10M, no upload)
        if($total_size >= 10000000){echo "file size too large"; $all_test_passed = false;}

        //all files pass all tests, moving files to upload folders
        if($all_test_passed){
            for($i = 0; $i < count($fit_upload_name); $i++){
                $tmp_name = $_FILES["myFiles"]["tmp_name"][$i];
                // basename() may prevent filesystem traversal attacks;
                // further validation/sanitation of the filename may be appropriate
                $name = basename($_FILES["myFiles"]["name"][$i]);
                move_uploaded_file($tmp_name, "Resource/upload/{$name}");
            }
        }
    }else{
        echo "no submit here";
        $all_test_passed = false;
    }

    // at this point, the files should have been uploaded into Resource/upload
    // converting data to json
    if($all_test_passed){
        $device_info_array = array();
        $avg_power_array = array();
        for($i = 0; $i < $num_files; $i++){
            $pFFA = new adriangibbons\phpFITFileAnalysis("Resource/upload/{$fit_upload_name[$i]}");
            $power_array = $pFFA -> data_mesgs['record']['power'];
            // print_r($pFFA->data_mesgs);
            echo "power_json";
            echo json_encode($power_array);
            
            
            $manu = $pFFA->enumData('manufacturer',$pFFA->data_mesgs["file_id"]["manufacturer"]);
            // $prod = $pFFA->product();
            $avg_power = $pFFA->powerMetrics(1);
            array_push($device_info_array, $manu);
            array_push($avg_power_array, $avg_power);
            
            
        }

        echo "device_info";
        echo json_encode($device_info_array);
        // echo "avg_power";
        // echo json_encode($avg_power_array);

        //remove file from system
        $d_files = glob('Resource/upload/*'); // get all file names
        foreach($d_files as $d_file){ // iterate files
            if(is_file($d_file)) {
                unlink($d_file); // delete file
            }
        }
    }

?>