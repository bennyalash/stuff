<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&family=Source+Serif+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap" rel="stylesheet">
<canvas id="scene"></canvas>
<input id="copy" type="text" value="Benny Al-Ashari" hidden/>
<input id="copy2" type="text" value="About Me" hidden/>
<input id="copy3" type="text" value="Projects" hidden/>
<input id="copy4" type="text" value="Resume" hidden/>

<script type="text/javascript" src="https://code.jquery.com/jquery-latest.js"></script>

<div class="page-container 1">
    <div class="page-content">
        <div class="content show" id="copy-content">
            <div class="center-image"><img class="white"  src="images/mouse-scroll.png";/><p>Scroll Down To View More</p></div>
            <h2 class="center">Designer. </h2>
            <h2 class="center">Developer. </h2>
            <h2 class="center">Creator.</h2>
        </div>
    </div>
</div>

<div class="page-container 2">
    <div class="page-content">
        <div class="content" id="copy2-content">
            <h2>Major</h2>
            <p>Computer Science</p>
            <h2>Resume</h2>
            <p><a href="#">Resume.pdf</a></p>
            <h2>Contact: </h2>
            <p>Email: <a href="mailto:bennyalash@gmail.com">bennyalash@gmail.com</a></p>
            <p>Phone: <a href="tel:5179306185">(517) 930 - 6185</a></p>
        </div>
    </div>
</div>

<div class="page-container 3">
    <div class="page-content">
        <div class="content" id="copy3-content">
            <h2>Websites</h2>
            <p><a onclick="jsfunction()" href="javascript:void(0);">View My Websites</a></p>
            <h2>Project 2</h2>
            <p>Example Description</p>
            <h2>Project 3</h2>
            <p>Example Description</p>
        </div>
    </div>
</div>

<div class="page-container 4">
    <div class="page-content">
        <div class="content" id="copy4-content">
            <h2>Last Job</h2>
            <p>Example Description</p>
            <h2>Education</h2>
            <p>Example Description</p>
            <h2>Download</h2>
            <p><a href="#">Resume.pdf</a></p>
        </div>
    </div>
</div>

<?php require('js.php'); ?>
