<script>

//------------------------------------------------------------------------------
//
// Code by Benny Al-Ashari :)
//
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Declaring Variables
//------------------------------------------------------------------------------

    //Declaring Canvas
    var resize_scene = setInterval(function() { 
        $("#scene").css("height", $(window).height());
    }, 10);
    var canvas = document.querySelector("#scene"),
    ctx = canvas.getContext("2d");
    
    //Particle Variables
    particles = [];
    amount = 0;
    mouse = {x:0,y:0};
    radius = 1;
    run = 100;
    
    //my colors = ["Green", "Yellow", "Blue", "Red", "Orange"]
    var colors = ["#4ec787","#eae751", "#4e96c7","#ff6c40", "#ffa82f"];
    
    //Selecting Content/Words
    var copy = document.querySelector("#copy");
    var copy2 = document.querySelector("#copy2");
    var copy3 = document.querySelector("#copy3");
    var copy4 = document.querySelector("#copy4");
    var words = [copy, copy2, copy3, copy4];
    
    //Dimension Variables
    var ww = canvas.width = window.innerWidth;
    var wh = canvas.height = window.innerHeight;

//---------------------------------------END OF DECLARING GLOBAL VARIABLES------



//------------------------------------------------------------------------------
// Particle Class Functions
//------------------------------------------------------------------------------

    //Particle Constructor
    function Particle(x,y){
      this.x =  Math.random()*ww;
      this.y =  Math.random()*wh;
      this.dest = {
        x : x,
        y: y
      };
      this.r =  Math.random()*(ww/250) + (ww/500);
      this.vx = (Math.random()-0.5)*20;
      this.vy = (Math.random()-0.5)*20;
      this.accX = 0;
      this.accY = 0;
      this.friction = Math.random()*0.1 + .875;
    
      this.color = colors[Math.floor(Math.random()*6)];
    }
    
    //Draw Particles
    Particle.prototype.render = function() {
      this.accX = (this.dest.x - this.x)/250;
      this.accY = (this.dest.y - this.y)/250;
      this.vx += this.accX;
      this.vy += this.accY;
      this.vx *= this.friction;
      this.vy *= this.friction/1.01;
    
      this.x += this.vx;
      this.y +=  this.vy;
    
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();
    
      var a = this.x - mouse.x;
      var b = this.y - mouse.y;
    
      var distance = Math.sqrt( a*a + b*b );
      if(distance<(radius*70)){
        this.accX = (this.x - mouse.x)/run;
        this.accY = (this.y - mouse.y)/run;
        this.vx += this.accX;
        this.vy += this.accY;
      }
    }
    
    //Set the size of the particles
    Particle.prototype.size = function(s){
        this.r =  Math.random()*((ww)/500) + (ww)/1000 + s/75;
    }
    
    //Set the "Jumping" of the particles when the word changes
    Particle.prototype.wild = function(){
        this.vx = (Math.random()-0.5)*20;
        this.vy = (Math.random()-0.5)*20;
    }
    
    //Set the new destination of the particles on word change
    Particle.prototype.newDest = function(x,y) {
        this.dest.x = x;
        this.dest.y = y;
    }

//---------------------------------------END OF PARTICLE CLASS------------------


//------------------------------------------------------------------------------
// Event Listener Functions
//------------------------------------------------------------------------------

    function onMouseMove(e){
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    
    function onTouchMove(e){
      if(e.touches.length > 0 ){
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }
    
    var xDown = null;                                                        
    var yDown = null;
    
    function getTouches(evt) {
      return evt.touches ||             // browser API
             evt.originalEvent.touches; // jQuery
    }                                                     
                                                                             
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                             
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;
    
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if(Math.abs( xDiff ) > 250 || Math.abs( yDiff ) > 250){                                                             
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                scroll = ww*1.06;
            } else {
                scroll = -0.01;
            }                       
        } else {
            if ( yDiff > 0 ) {
            } else { 
                initScene();
            }                                                                 
        }
        xDown = null;
        yDown = null;
    }
};

//---------------------------------------END OF EVENT LISTENER FUNCTIONS--------




function initScene(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var page = urlParams.get('page');
  const pagenumbers = [0, 1, 2, 3];

  if(typeof page != 'undefined'){
      page = parseInt(page);
      if(!pagenumbers.includes(page)){
          page = 0;
      }
  }else{
      page = 0;
  }
  
  clicked = page;
  initContent();
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var size = 10/words[page].value.length;
  console.log(size);
  ctx.font = "bold "+(size+8)+"vw Source Sans Pro, sans-serif";
  var twosize = size;
  
  while(getTextWidth(words[page].value, ctx.font) > ww-50){
      twosize-=0.1;
      ctx.font = "bold "+(twosize+8)+"vw Source Sans Pro, sans-serif";
  }
  ctx.textAlign = "center";
  ctx.fillText(words[page].value, ww/2, wh/2);

  var data  = ctx.getImageData(0, 0, ww, wh).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "overlay";

  particles = [];
  for(var i=0;i<ww;i+=Math.round(ww/250)){
    for(var j=0;j<wh;j+=Math.round(ww/250)){
      if(data[ ((i + j*ww)*4) + 3] > 250){
        particles.push(new Particle(i,j-wh/2+222));
      }
    }
  }
  amount = particles.length;
    for (var i = 0; i < amount; i++) {
    particles[i].wild();
    particles[i].size(200);
  }
}

var buttonCircle;
var green = 0;
function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
  radius = (radius - 0.5) * 0.8 + 0.5;
  run = (run - 60) * 0.8 + 60;
  progressTracker();
};

var clicked = 0;
function onMouseClick(){
    radius = 1.5;
    run = 5;
}

function changeWord(word){
   
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var size = 10/word.value.length;
  console.log(size);
  ctx.font = "bold "+(size+8)+"vw Source Sans Pro, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(word.value, ww/2, wh/2);

  var data  = ctx.getImageData(0, 0, ww, wh).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "overlay";

  var num = 0;
  for(var i=0;i<ww;i+=Math.round(ww/250)){
    for(var j=0;j<wh;j+=Math.round(ww/250)){
      if(data[ ((i + j*ww)*4) + 3] > 250){
          if(particles[num] !== undefined) {
              particles[num].newDest(i, j-wh/2+222);
              num++;
          }
          else{
              particles.push(new Particle(i,j-wh/2+222));
              num++;
          }
      }
    }
  }
  while(particles[num] !== undefined){
      particles.splice(num, 1);
  }
  amount = particles.length;

  for (var i = 0; i < amount; i++) {
    particles[i].wild();
    particles[i].size(200);
  }
}

var scroll = 0;
var bar = colors[Math.floor(Math.random()*6)];
function myFunction(event){
    scroll += event.deltaY;
    
}

var scroll_acc;
var y = 0;
function progressTracker(){
  bar = colors[clicked];
  scroll_acc = (scroll - y)/5;
  y += (scroll_acc);
  ctx.fillStyle = bar;
  ctx.beginPath();
  ctx.rect(0, wh - 40, y, 40);
  ctx.fill();
  if(y > ww*1.05)
  {
      y = scroll =0;
      clicked++;
        if(clicked == words.length){
            clicked = 0;
        }
      preWord(clicked);
  }
  else if(y < 0)
  {
      if(clicked > 0)
      {
          y = scroll = ww*1.05;
          clicked--;
            if(clicked == -1){
                clicked = words.length - 1;
            }
          preWord(clicked);
      }
      else{
          scroll=0;
          y=0;
      }
  }
  bar = colors[clicked];
  backgroundColor();
}

function preWord(page){
    initContent();
    changeWord(words[clicked]);
}

function initContent(){
    var id;
    var content_id;
    window.history.pushState('page'+clicked, 'Title', '/~alishari/benny/?page='+clicked);
    
    $(words).each(function(i){
        id = $(words[i]).attr("id");
        content_id = "#" + id + "-content";
        $(content_id).fadeOut("fast");
    });
    id = $(words[clicked]).attr("id");
    content_id = "#" + id + "-content";
    $(content_id).fadeIn("slow");
}

function backgroundColor(){
  $("#scene").css("background-image", "linear-gradient(0deg, #222222aa, #222222aa)");
  $("#scene").css("background-blend-mode", "multiply");
  $("#scene").css("background-color", bar);
  $("body").css("background-image", "linear-gradient(0deg, #222222aa, #222222aa)");
  $("body").css("background-blend-mode", "multiply");
  $("body").css("background-color", bar);
}

copy.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("wheel", event => myFunction(event));
window.addEventListener('touchstart', handleTouchStart, false);        
window.addEventListener('touchmove', handleTouchMove, false);

initScene();
requestAnimationFrame(render);

function getTextWidth(text, font) {
    ctx.font = font;
    var metrics = ctx.measureText(text);
    return metrics.width;
}

console.log(getTextWidth("hevhuvviyllo there!", "bold 12pt arial"));

/*BUTTON*/
var buttonVisible = 1;

</script>
