<link rel = "stylesheet" href = "inc/footer.css">
<link rel = "stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />



<div id = "footer_container">
    <footer id = "footer">
            <div class="footer-content">
                <h3>Mai's Power Comparison Tool</h3>
                <div id ="term" onclick = "func()">Terms and Privacy</div>
                <ul class="socials">
                    <li><a href="https://github.com/MaiMMM"><i class="fa fa-github"></i></a></li>
                </ul>
            </div>
            <div class="footer-bottom">
                <p>copyright &copy;2022 Mai. designed by <span>Mai</span></p>
            </div>
    </footer>
</div>

<div id="bg-model">
    <div id ="model-content" class = "PT">
        <h1 class = "PT">Privacy Policy</h1>
            <h2 class = "PT">Personal Data Collection</h2>
                <h4 class = "PT">The site does not read or collect file content, metadata, or other data from your uploaded files.</h4>
            <h2 class = "PT">Use of Your Personal Data</h2>
                <h4 class = "PT">The site does not collect any personal data.</h4>
            <h2 class = "PT">Handling of Your Files</h2>
                <h4 class = "PT">The files will exist momentarily in the server to retrieve the power information. As soon as that is finished, all files will be <b>DELETED</b>.</h4>
            <h2 class = "PT">Cookies</h2>
                <h4 class = "PT">The site does not collect any cookie</h4>
        
        <h1 class = "PT">Term of Service</h1>
            <h2 class = "PT">Allowed Usage</h2>
                <h4 class = "PT">This service offers functionality to analyze power data from multiple .fit files. This service is provided through web interface. You agree to comply with the policies and limitations concerning the use of the Mai's Power Meter Comparison Tool. </h4>
                <h4 class = "PT">You agree to not reverse-compile or decompile, analyze, reverse-engineer, reverse-assemble or disassemble, unlock or otherwise attempt to discover the source code 
                    or underlying algorithms of Mai's Power Meter Comparison Tool or attempt to do any of the foregoing in relation to the Mai's Power Meter Comparison Tool service.</h4>
            <h2 class = "PT">Copyright Policy</h2>
                <h4 class = "PT">You are responsible only for the data (e.g., files, URLs) that you send to the Mai's Power Meter Comparison Tool service. Mai's Power Meter Comparison Tool does not monitor customer content. Please remember that illicit exchanges of recordings and protected works and hacking harm artistic creation. And please respect the laws in force, especially those concerning intellectual and artistic property.</h4>
    </div>
</div>

<script>
    function func(){
        document.getElementById("bg-model").style.display = "flex";
    }

    var cont = document.getElementById("bg-model");
    cont.addEventListener("click",function(event){
        // console.log([...event.target.classList].indexOf('PT'));
        if([...event.target.classList].indexOf('PT') === -1){
            document.getElementById("bg-model").style.display = "none";
        };
    })
</script>