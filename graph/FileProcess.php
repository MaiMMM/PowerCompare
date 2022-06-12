<?php
    include('phpFITFileAnalysis.php');
    /* ----------- File upload  ---------- */
    $allowed_ext = array('txt','fit');

    if(isset($_POST['submit'])) {
        echo "isset";
        // Check if file was uploaded
        if(!empty($_FILES['file']['name'])) {
            $file_name = $_FILES['file']['name'];
            $file_size = $_FILES['file']['size'];
            $file_tmp = $_FILES['file']['tmp_name'];
            $target_dir = "uploads/${file_name}";
            // Get file extension
            $file_ext = explode('.', $file_name);
            $file_ext = strtolower(end($file_ext));
            
    
            // Validate file type/extension
            if(in_array($file_ext, $allowed_ext)) {
            // Validate file size
            if($file_size <= 1000000) { // 1000000 bytes = 1MB
                // Upload file
                move_uploaded_file($file_tmp, $target_dir);
                rename("uploads/".$file_name,'uploads/temp.fit');
                // Success message
                echo '<p style="color: green;">File uploaded!</p>';
                // print_r($_FILES);
            } else {
                echo '<p style="color: red;">File too large!</p>';
            }
            } else {
            $message = '<p style="color: red;">Invalid file type!</p>';
            }
        } else {
            $message = '<p style="color: red;">Please choose a file</p>';
        }
    }else{
        echo "no submit here";
    }

    // -------------------------------------------------------------------------------
    // echo $file_name;
    $pFFA = new adriangibbons\phpFITFileAnalysis('uploads/temp.fit');
    // echo gettype($pFFA->data_mesgs['record']['heart_rate']);
    $power_array = $pFFA -> data_mesgs['record']['power'];
    
    $power_key = array_keys($power_array);
    $power_value = array_values($power_array);

    // echo json_encode($power_array);
    // for($i = 0 ; $i < count($power_key); $i++){
    //     echo $power_key[$i] . " ". $power_value[$i] . "<br>";
    //     echo "\n";
    // }

    // var_dump($power_array);

?>
