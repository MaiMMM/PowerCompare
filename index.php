<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel = "stylesheet" href = "Resource/css/style.css">

    <script type="text/javascript" src="Resource/js/jscript.js"></script>
    <script type="text/javascript" src="Resource/js/chart.min.js"></script>
    <script type="text/javascript" src="Resource/power_compare_file/demo.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.8/purify.min.js" integrity="sha512-M72KfQy4kPuLYC6CeTrN0eA17U1lXEMrr5qEJC/40CLdZGC3HpwPS0esQLqBHnxty2FIcuNdP9EqwSOCLEVJXQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>
<body>

    <?php include 'inc/header.php'; ?> 

    <div id="mai_logo_container">
        <img src="../Resource/MaiLogo.PNG" id="mai_logo" >
    </div>

    
    <div id = "upload">
        <form id = "postFit">
                <input type="file" multiple = "multiple" name = "file" id = "upload_file" accept=".fit" hidden/>
                <label for = "upload_file" id = "upload_label"> Choose File</label>
                <span id="file-chosen">File Type: fit / Up to 5 Files</span>

                <!-- <button id = "demo" onclick = "try_demo()">TRY DEMO </button> -->

                <div class="button-area"> 
                    <input type="submit" class = "submit" name = "submit"> 
                    <span id = "ss",name = "ss"> Uploading... </span>
                </div>
        </form>
    </div>


    <div id = "chart_area">
        <canvas id="myChart" width="400" height="130" ></canvas>
    </div>

    <div id = "avg_power">
        
    </div>

    <div id="function_container">
        <button class="function_button" id ="zoom" role="button" onclick = "reset_zoom()">reset zoom</button>
        <div id = "function_button_area">
        </div>
    </div>



    <?php include 'inc/footer.php'; ?> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js" integrity="sha512-UXumZrZNiOwnTcZSHLOfcTs0aos2MzBWHXOHOuB0J/R44QB0dwY5JgfbvljXcklVf65Gc4El6RjZ+lnwd2az2g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/1.2.1/chartjs-plugin-zoom.min.js" integrity="sha512-klQv6lz2YR+MecyFYMFRuU2eAl8IPRo6zHnsc9n142TJuJHS8CG0ix4Oq9na9ceeg1u5EkBfZsFcV3U7J51iew==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="text/javascript" src="Resource/js/debug_var.js"></script>
    <script type="text/javascript" src="Resource/js/script.js"></script>



</body>
</html>