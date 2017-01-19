

$(document).ready(function () {

var windowWidth = window.innerWidth;
var navHt = $('#navbar1').height();
var bodyHt = $('body').height();


$('#myCarousel').carousel
    ({
        interval: 7000,


    });


$(".img1").css('height',bodyHt-navHt);
$(".img1").css('width',windowWidth);


function homeclicked()
{
	alert("Inside home is clicked");
}

//alert($('.sidebar').width());

});
