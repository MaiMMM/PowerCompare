// Main script file for Mai's Power Meter Comparison Tool
// Chris He, 2022
// h1119623520@gmail.com

//-------------------------------------------- Global Variables ---------------------------------------------------------
let upload_files; //original files from drop and drag
var PowerChart; // Chart Object
var CadenceChart;
var PowerSourceArray = [];
var myChart; // html Chart
var device_info = [];
var chart_obj_arr = [];
var offset_arr = []; //offset of each array, initialized to be all 0
var time_arr = []; //time_arr -> {{time of file1},{time of file2},{time of file3},.....}
var power_arr = []; //power_arr -> {{power of file1},{power of file2},{power of file3},.....}
var cadence_arr = [];
var original_data;
var exist_graph = false;
var time_arr_longest_index;
//--------------------------------------------non-graph related ---------------------------------------------------------

//make file-chosen visible
const actualBtn = document.getElementById('upload_file');
const fileChosen = document.getElementById('file-chosen');
actualBtn.addEventListener('change', function(){
  var num_of_file = this.files.length;
  var filename;

  if(num_of_file === 1){filename = this.files[0].name;}
  else if(num_of_file === 2){filename = this.files[0].name + " / "+ this.files[1].name;}
  else if(num_of_file === 3){filename = this.files[0].name + " / "+ this.files[1].name + " / "+ this.files[2].name;}
  else if(num_of_file >= 4){filename = this.files[0].name + " / "+ this.files[1].name +" / "+ this.files[2].name + " ... (" + num_of_file + " in total)";} 
  fileChosen.textContent = filename;
  document.getElementById("file-chosen").style.display = "inline";
})


//--------------------------------------------helper function---------------------------------------------------------
//convert 2d unix time array to 2d formated js time array
function unixtime_to_formated(arr){
  var ret = [];

  for (var i = 0; i < arr.length; i++){
    var temp_arr = []
    for( var j = 0; j < arr[i].length; j++){
      temp_arr.push(new Date(j*1000).toISOString().slice(11, 19));
    }
    ret.push(temp_arr);
  }
  return ret;
}

// array of random color
var colorArray = ['#FF6633', '#6666FF', '#FF33FF', '#B3B31A', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// return an array of device information. If duplicated value, add number at the end
// e.g. {Garmin,Zwift,PC8,Garmin,Garmin} -> {Garmin 1,Zwift,PC8,Garmin 2,Garmin 3}
function get_device_info(responseText){
  // console.log(responseText);
  var temp = responseText.split("cadence_json")[0];
  temp = JSON.parse(temp.split("device_info")[1]);
  
  //add number to duplicate devices
  for(var i = 0; i < temp.length - 1; i++){
    var num_of_duplicate = 0
    for(var j = i+1; j < temp.length; j++){
      if(temp[i] === temp[j]){num_of_duplicate += 1;}
    }

    if(num_of_duplicate > 0){
      var duplicated_value = temp[i];
      var extention = 1;
      for(var k = i; k < temp.length; k++){
        if(temp[k] === duplicated_value){
          temp[k] = temp[k] + "(" + extention.toString() + ")";
          extention += 1;
        }
      }
    }
  }

  return temp;
}

function get_power_info(responseText){
  var temp = responseText.split("device_info")[0];
  var power_arr = temp.split("power_json")
  power_arr.shift();
  return power_arr;
}

function get_file_info(responseText){
  var temp = responseText.split("device_info")[0];
  return temp.split("power_json")[0];
}

function get_cadence_info(responseText){
  var temp = responseText.split("cadence_json");
  temp.shift();
  return temp;
}

function remove_previous_graph(){
  //remove entire canvas
  PowerChart.destroy();
  // document.getElementById("myChart").remove();  
  // let canvas = document.createElement('canvas');     
  // canvas.setAttribute('id','myChart');     
  // canvas.setAttribute('width','400');     
  // canvas.setAttribute('height','100');     
  // document.querySelector('#chart_area').appendChild(canvas);

  //remove all data
  chart_obj_arr = [];
  PowerSourceArray = [];
  // device_info = [];
  offset_arr = []; 
  time_arr = [];
  power_arr = [];

  //remove all reset button
  var all_button = document.querySelectorAll('.function_button');
  for(var i = 1; i <all_button.length; i++){
    all_button[i].remove();
  }

  var all_ChangeName = document.querySelectorAll('.ChangeName');
  for(var i = 0; i < all_ChangeName.length; i++){
    all_ChangeName[i].remove();
  }

  var all_span = document.querySelectorAll('.avg_power');
  for(var i = 0; i < all_span.length; i++){
    all_span[i].remove();
  }

}

function remove_previous_graph_changeName(){
  //remove entire canvas
  PowerChart.destroy();
  // document.getElementById("myChart").remove();     
  // let canvas = document.createElement('canvas');     
  // canvas.setAttribute('id','myChart');     
  // canvas.setAttribute('width','400');     
  // canvas.setAttribute('height','100');     
  // document.querySelector('#chart_area').appendChild(canvas);

  //remove all data
  chart_obj_arr = [];

  //remove all reset button
  var all_button = document.querySelectorAll('.function_button');
  for(var i = 1; i <all_button.length; i++){
    all_button[i].remove();
  }

  var all_ChangeName = document.querySelectorAll('.ChangeName');
  for(var i = 0; i < all_ChangeName.length; i++){
    all_ChangeName[i].remove();
  }

  var all_span = document.querySelectorAll('.avg_power');
  for(var i = 0; i < all_span.length; i++){
    all_span[i].remove();
  }
}

function reset_zoom(){
  PowerChart.resetZoom();
}

function offset_func(device,direction){
  //offset function, used to change offset of any data line by updating graph
  //devide = devide name in string
  //direction = offset+1 or offset-1 or offset+0

  if(offset_arr.length === 0){offset_arr.length = device_info.length; offset_arr.fill(0);}

  var index = device_info.findIndex(function(d){ return d === device; }); //index of the device in the device array

  if(direction === "offset+1"){offset_arr[index] += 1;}
  else if(direction === "offset-1"){offset_arr[index] -= 1;}
  else if(direction === "offset+0"){;} // this is for recover offset during rename, or other operation that resets the offset
  else{alert("offset input wrong");}

  var offset = offset_arr[index];
  var p_arr = JSON.parse(JSON.stringify(original_data[index].data));//make a copy

  if(offset >= 1){  //push n element from beginning to their right, replace with empty slot with 0, remove n element from end 
    for(var i = 0; i < offset; i++){
      if(p_arr.length >= time_arr[time_arr_longest_index].length){//remove end element only if the length exceeds time_arr.length 
        p_arr.pop(); //remove end elements
      }
      p_arr.unshift(0);//add 0 to beginning
    }
  }
  else if(offset < 0){ //remove n element from beginning, add 0's to the end of the array
    for(var i = 0; i < Math.abs(offset); i++){ 
      p_arr.shift(); //remove end elements
      // p_arr.push(0);//add 0 to beginning
    }
  }
  
  PowerChart.data.datasets[index].data = p_arr;
  // console.log(PowerChart.data.datasets[index].data);

  // console.log(offset_arr[index]); debugging code
  // console.log(p_arr);
  PowerChart.update();

  startFetch();
}

//callback function from ChangeNameFunc
function change_name(current_name,new_name){
  
  var new_name_exist = false;

  for(var i = 0; i < device_info.length; i++){
    if(device_info[i] === new_name){
      alert("name already exits"); 
      new_name_exist = true; break;}
  }

  if(!new_name_exist){
    remove_previous_graph_changeName();
    for(var i = 0; i < device_info.length; i++){
      // console.log(device_info[i]);
      // console.log(current_name);
      if(device_info[i] === current_name){
        device_info[i] = new_name; break;
        }
    }
    makegraph(time_arr,power_arr);

    for(var i = 0; i < device_info.length;i++){
      offset_func(device_info[i],"offset+0");
    }
  }

  
}

//directly called from html when button is hit
function ChangeNameFunc(e){
  // console.log(offset_arr);
  var className_arr = e.className.split(" ");
  var new_name = document.getElementById(className_arr[1]+"ChangeName").value;

  //if contains space
  if(new_name.indexOf(' ') >= 0){alert("space not allowed");}
  //if empty
  else if(new_name === ""){alert("no input");}
  
  else{
    new_name = DOMPurify.sanitize(new_name);
    change_name(className_arr[1],new_name);
  }
}

//fetch average power from selected area
function startFetch(){
  var avg_power_array = [];

  //helper function: find average of array
  function avg_arr(arr){
    var sum = arr.reduce((a, b) => a + b, 0);
    var avg = (sum / arr.length) || 0;

    return avg;
  }

  var {min, max} = PowerChart.scales.x;
  max = max += 1;
  for( let i = 0; i < PowerChart.data.datasets.length; i++){

    let p = PowerChart.data.datasets[i].data

    //if the line ends in between the zoom in section
    if(p.length < max && p.length >= min){
      avg_power_array.push("missing data");
    }
    //if the line ends before the zoom in section
    else if (p.length < min){
      avg_power_array.push("missing data");
    }
    // the line ends after the zoom in section
    else{
      var sliced_arr = p.slice(min,max);
      // console.log(sliced_arr);
      var avg_power = avg_arr(sliced_arr).toFixed(2).toString();
      avg_power_array.push(avg_power);

    }
  }

  // console.log(avg_power_array);
  //change innerhtml of average power elements
  var all_span = document.querySelectorAll('.avg_power');
  for(let i = 0; i < all_span.length; i++){
    all_span[i].innerHTML = device_info[i] + " Avg Power: " + avg_power_array[i];
  }
}
//--------------------------------------------chart js---------------------------------------------------------

function makegraph(time_arr,power_arr){

    //time_arr -> {{time},{time}, ....}
    //power_arr -> {{power},{power},...}
    time_arr = unixtime_to_formated(time_arr);
    time_arr_longest_index = time_arr.reduce((p, c, i, a) => a[p].length > c.length ? p : i, 0); // this algorithm finds the longest time in time_arr
    //covert power_array to an array of dataset used in chart JS
    for(var i = 0; i < power_arr.length; i++){

      var temp_obj = {
        label:device_info[i],
        data:power_arr[i],
        borderColor: colorArray[i],
        fill:false,
        tension:0,
        borderWidth: 1.2
      };

      chart_obj_arr.push(temp_obj);
    }

    //creating chart using ChartJS
    myChart = document.getElementById('myChart').getContext('2d');
    PowerChart = new Chart(myChart,{
        type:'line', 
        data:{
            labels:time_arr[time_arr_longest_index], 
            datasets:chart_obj_arr,
        },
          options: {
            responsive: true,
            plugins: {
              tooltip: { // hover box
                mode: 'index', // show all data
                intersect: false, // cursor doesn't need to be on top of the line
                // titlecolor: "black",
                // bodyColor:"black",
                // footerColor:"black",
                // borderColor:"black",
                backgroundColor: 'rgba(140, 140, 140, 0.5)',
                // displayColors: false,
                
              },
              title: {display: false,text: 'Power Compare'},
              zoom: {
                zoom: {
                  drag:{
                    enabled: true, 
                    backgroundColor: "rgb(0, 128, 128,0.3)",
                    borderColor: "rgba(0,0,0,0)",
                    borderWidth: "0",
                    threshold: "1"
                  },
                  mode: 'x',
                  onZoomComplete: startFetch //get selected power elements
                }
              }
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                },
                ticks:{ //x axis data (time)
                  maxTicksLimit:15, // how many data points in x axis
                  maxRotation: 0, // make the time data horizontal 
                  minRotation: 0, // same as above
                  labelOffset:10, // idk what this is
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Power'
                },
                suggestedMin: 0,
                suggestedMax: 500
              }
            },
            elements:{
                point:{
                    radius: 0
                }
            },
        }
    });

    original_data = JSON.parse(JSON.stringify(PowerChart.data.datasets)); // to use: original_data[index].data --> array of power data


    //create funtion button (e.g. change offset)
    for(var i = 0; i < device_info.length; i++){
        const para0 = document.createElement("button"); //offset -1s
        const para1 = document.createElement("button"); //offset +1s
        const para2 = document.createElement("form"); // form
        const para3 = document.createElement("label");  
        const para4 = document.createElement("input");  
        const para5 = document.createElement("input"); 
        const para6 = document.createElement("span"); //avg power


        para0.classList.add('function_button',device_info[i],'offset-1', 'offset');
        para1.classList.add('function_button',device_info[i],'offset+1', 'offset');
        para2.classList.add('ChangeName',device_info[i]);
        para2.setAttribute("onSubmit","event.preventDefault(); ChangeNameFunc(this)");
        // para3.appendChild(document.createTextNode(device_info[i] + " change name :"));
        para3.setAttribute("for",device_info[i] + "ChangeName");
        para4.setAttribute("id",device_info[i] + "ChangeName"); para4.setAttribute("type","text");
        para4.setAttribute("placeholder",device_info[i] + " change name")
        para5.setAttribute("type","submit");para5.setAttribute("value","change"); 
        para6.classList.add('avg_power',device_info[i]);
        
        para2.appendChild(para3);
        para2.appendChild(para4);
        para2.appendChild(para5);

        var temp_text_0 = device_info[i] + " offset  - 1s";
        var temp_text_1 = device_info[i] + " offset  + 1s";

        const node0 = document.createTextNode(temp_text_0);
        const node1 = document.createTextNode(temp_text_1);

        para0.appendChild(node0);
        para1.appendChild(node1);


        const element = document.getElementById("function_button_area");
        element.appendChild(para0);
        element.appendChild(para1);
        element.appendChild(para2);
        element.appendChild(para6);
    }


    // make reset button visible after graph is generated
    var buttons = document.getElementsByClassName("function_button");
    for(var i = 0; i < buttons.length; i++){
      buttons[i].style.display = "block";
    }

    document.getElementById("zoom").style.display = "block";
    


    //call average func
    startFetch();

    document.getElementById("footer").style.position = "relative";
    // document.getElementById("footer").style.buttom = "150px";

        //scroll to lower in the page
        var scrollheight = document.getElementById("myChart").getBoundingClientRect().top + window.pageYOffset - 25 ;
        window.scrollTo({ top: scrollheight, behavior: 'smooth' });
    
}

// function makegraph_cadence(time_arr,cadence_arr){

//   //time_arr -> {{time},{time}, ....}
//   //cadence_arr -> {{power},{power},...}
//   time_arr = unixtime_to_formated(time_arr);
//   time_arr_longest_index = time_arr.reduce((p, c, i, a) => a[p].length > c.length ? p : i, 0); // this algorithm finds the longest time in time_arr
//   //covert cadence_array to an array of dataset used in chart JS
//   for(var i = 0; i < cadence_arr.length; i++){

//     var temp_obj = {
//       label:device_info[i],
//       data:cadence_arr[i],
//       borderColor: colorArray[i],
//       fill:false,
//       tension:0,
//       borderWidth: 1.2
//     };

//     chart_obj_arr.push(temp_obj);
//   }

//   //creating chart using ChartJS
//   myChartCadence = document.getElementById('myChartCadence').getContext('2d');
//   CadenceChart = new Chart(myChartCadence,{
//       type:'line', 
//       data:{
//           labels:time_arr[time_arr_longest_index], 
//           datasets:chart_obj_arr,
//       },
//         options: {
//           responsive: true,
//           plugins: {
//             tooltip: { // hover box
//               mode: 'index', // show all data
//               intersect: false, // cursor doesn't need to be on top of the line
//               // titlecolor: "black",
//               // bodyColor:"black",
//               // footerColor:"black",
//               // borderColor:"black",
//               backgroundColor: 'rgba(140, 140, 140, 0.5)',
//               // displayColors: false,
              
//             },
//             title: {display: false,text: 'Cadence Compare'},
//             zoom: {
//               zoom: {
//                 drag:{
//                   enabled: true, 
//                   backgroundColor: "rgb(0, 128, 128,0.3)",
//                   borderColor: "rgba(0,0,0,0)",
//                   borderWidth: "0",
//                   threshold: "1"
//                 },
//                 mode: 'x',
//                 onZoomComplete: startFetch //get selected power elements
//               }
//             }
//           },
//           interaction: {
//             intersect: false,
//           },
//           scales: {
//             x: {
//               display: true,
//               title: {
//                 display: true,
//               },
//               ticks:{ //x axis data (time)
//                 maxTicksLimit:15, // how many data points in x axis
//                 maxRotation: 0, // make the time data horizontal 
//                 minRotation: 0, // same as above
//                 labelOffset:10, // idk what this is
//               }
//             },
//             y: {
//               display: true,
//               title: {
//                 display: true,
//                 text: 'Cadence'
//               },
//               suggestedMin: 0,
//               suggestedMax: 500
//             }
//           },
//           elements:{
//               point:{
//                   radius: 0
//               }
//           },
//       }
//   });

//   original_data = JSON.parse(JSON.stringify(CadenceChart.data.datasets)); // to use: original_data[index].data --> array of power data


//   //create funtion button (e.g. change offset)
//   for(var i = 0; i < device_info.length; i++){
//       const para0 = document.createElement("button"); //offset -1s
//       const para1 = document.createElement("button"); //offset +1s
//       const para2 = document.createElement("form"); // form
//       const para3 = document.createElement("label");  
//       const para4 = document.createElement("input");  
//       const para5 = document.createElement("input"); 
//       const para6 = document.createElement("span"); //avg power


//       para0.classList.add('function_button',device_info[i],'offset-1', 'offset');
//       para1.classList.add('function_button',device_info[i],'offset+1', 'offset');
//       para2.classList.add('ChangeName',device_info[i]);
//       para2.setAttribute("onSubmit","event.preventDefault(); ChangeNameFunc(this)");
//       // para3.appendChild(document.createTextNode(device_info[i] + " change name :"));
//       para3.setAttribute("for",device_info[i] + "ChangeName");
//       para4.setAttribute("id",device_info[i] + "ChangeName"); para4.setAttribute("type","text");
//       para4.setAttribute("placeholder",device_info[i] + " change name")
//       para5.setAttribute("type","submit");para5.setAttribute("value","change"); 
//       para6.classList.add('avg_power',device_info[i]);
      
//       para2.appendChild(para3);
//       para2.appendChild(para4);
//       para2.appendChild(para5);

//       var temp_text_0 = device_info[i] + " offset  - 1s";
//       var temp_text_1 = device_info[i] + " offset  + 1s";

//       const node0 = document.createTextNode(temp_text_0);
//       const node1 = document.createTextNode(temp_text_1);

//       para0.appendChild(node0);
//       para1.appendChild(node1);


//       const element = document.getElementById("function_button_area");
//       element.appendChild(para0);
//       element.appendChild(para1);
//       element.appendChild(para2);
//       element.appendChild(para6);
//   }


//   // make reset button visible after graph is generated
//   var buttons = document.getElementsByClassName("function_button");
//   for(var i = 0; i < buttons.length; i++){
//     buttons[i].style.display = "block";
//   }

//   document.getElementById("zoom").style.display = "block";
  


//   //call average func
//   startFetch();

//   document.getElementById("footer").style.position = "relative";
//   // document.getElementById("footer").style.buttom = "150px";

//       //scroll to lower in the page
//       var scrollheight = document.getElementById("myChartCadence").getBoundingClientRect().top + window.pageYOffset - 25 ;
//       window.scrollTo({ top: scrollheight, behavior: 'smooth' });
  
// }

// add click eventlistener to all offset elements


var all_function_button_ele = document.getElementById("function_button_area");
all_function_button_ele.addEventListener('click', function(event){

    var className_arr = event.target.className.split(" ");
  
    if(className_arr.includes("offset")){
        offset_func(className_arr[1],className_arr[2]);
    } 
})

//--------------------------------------------XHR--------------------------------------------------------- 
document.getElementById('postFit').addEventListener('submit',getResponse);
function getResponse(e){

    let from_drag_drop = (typeof(e) ==='undefined');

    //XHR stuff
    var xhr = new XMLHttpRequest();
    xhr.open('POST','temp.php', true);
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');

    //if file is from drag and drop
    if(from_drag_drop){
      files = upload_files;
    }
    //if file is from manual upload
    else{
      e.preventDefault();
      files = document.getElementById("upload_file").files;
    }

    let formData = new FormData();
    for (const file of files){
        formData.append("myFiles[]",file);
    }
    xhr.send(formData);

    //XHR complete
    xhr.onload = function(){
        // console.log(this.responseText);
        // ERROR CHECK
        if(this.responseText.includes("no submit here")){alert("no submit");}
        else if(this.responseText.includes("file size too large")){alert("total file size need to be < 10M");}
        else if(this.responseText.includes("not supported!")){alert("one or some of the file types are not supported!");}
        else if(this.responseText.includes("more than five files")){alert("more than 5 files");}

        // PASS ALL TESTS
        else{

          if(exist_graph){remove_previous_graph();}
          document.getElementById("zoom").style.display = "none";

          console.log(this.responseText);
          // the reponseText is in format as such
          // file info...power_json{....}power_json{....}power_json{....}device_info{....}cadence_json{....}cadence_json{....}
          device_info = get_device_info(this.responseText); // array of devide that records the files (e.g. garmin, zwift etc)

          var power_json_array = get_power_info(this.responseText); //parsed raw power data
          var cadence_json_array = get_cadence_info(this.responseText); //parsed raw cadence data

          
          //convert raw power data to power_arr
          for( var i = 0; i < power_json_array.length; i++){
              var temp_json_parse = JSON.parse(power_json_array[i]);
              var temp_time_arr = [];
              var temp_power_arr = [];
              for(var j in temp_json_parse){
                  temp_time_arr.push(j);
                  temp_power_arr.push(temp_json_parse[j]);
              }

              time_arr.push(temp_time_arr);
              power_arr.push(temp_power_arr);
          }

          //convert raw cadence data to cadence_arr
          for( var i = 0; i < cadence_json_array.length; i++){
            var temp_json_parse = JSON.parse(cadence_json_array[i]);
            var temp_cadence_arr = [];
            for(var j in temp_json_parse){
                temp_cadence_arr.push(temp_json_parse[j]);
            }

            cadence_arr.push(temp_cadence_arr);
          }

          // makegraph_cadence(time_arr,cadence_arr);
          makegraph(time_arr,power_arr);
          exist_graph = true;
        }
      
    
  }
}

//--------------------------------------------DEMO--------------------------------------------------------- 
function try_demo(){
  if(exist_graph){remove_previous_graph();}
  device_info = demo_device_arr;
  time_arr = demo_time_arr;
  power_arr = demo_power_arr
  makegraph(time_arr,power_arr);
  exist_graph = true;
}

//--------------------------------------------ERROR REPORT--------------------------------------------------------- 
window.onerror = function(msg) {
  alert('Error message: '+ msg);
  // return true;
}

//--------------------------------------------Drag and Drop--------------------------------------------------------- 

let dropArea = document.getElementById('upload');

// add eventlistener to drop-area
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

//prevent default
function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

//when enter
//change color
//change pointerEvent(so that child element can't be triggered by drag events)
  dropArea.addEventListener('dragenter', function(){
    document.getElementById("postFit").style.borderColor = "#ccc";
    document.getElementById("postFit").style.pointerEvents = "none";
  })

//when drag over
//change color
//change pointerEvent(so that child element can't be triggered by drag events)
  dropArea.addEventListener('dragover', function(){
    document.getElementById("postFit").style.borderColor = "#ccc";
    document.getElementById("postFit").style.pointerEvents = "none";
  })


//when leave
//change color to transparent
  dropArea.addEventListener('dragleave', function(e){
      document.getElementById("postFit").style.borderColor = "transparent";
  })


//this is for, in case user drag but not droped, and will change the pointerEvent back to normal
dropArea.addEventListener("mouseenter", function(e){
  console.log("mouse enter fired");
  document.getElementById("postFit").style.pointerEvents = "auto";
})

//change css when drop
  dropArea.addEventListener('drop', function(){
      document.getElementById("postFit").style.borderColor = "transparent";
      document.getElementById("postFit").style.removeProperty('pointer-events');
  })

dropArea.addEventListener('drop', function(e){
  let dt = e.dataTransfer
  upload_files = dt.files

  getResponse();
})

