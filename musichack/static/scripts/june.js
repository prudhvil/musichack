function unhideTo() {
    $("div#to").removeClass("hidden");
}


function scrollDown() {
    $("div#second").removeClass("hidden");
    $("a#logo").removeClass("hidden");
    window.location = "#second";
    // $("div#first").addClass("hidden");
    $("div#fakeNav").removeClass("hidden");


}

$('#from').on('click', unhideTo);
$('#to').on('click', scrollDown);




var d_x = 75;
var d_y = 100;
var interval = 2;                   

//init is used for getting things up and running once the page is loaded
function init(){
    //optimization: only get the element once
    var el = document.getElementById("to")
    x = parseInt(el.style.left);
    if(isNaN(x)){
        //parseInt("") == NaN
        x = 0;
    }
    y = parseInt(el.style.top);
    if(isNaN(y)){
        //ditto
        y = 0;
    }
    //call the nuts of this script
    moveImage();
}

//this is mostly unchanged
function moveImage() {
    if(x < d_x){
        x = x + interval;
    }else{
        //lets keep looping just for fun!
        x = 0;
    }
    if(y < d_y){
        y = y + interval - 1;                   //move y by only 1px
    }else{
        y = 0;
    }

    //optimization: only get the element once
    var el = document.getElementById("cr001")
    el.style.left = x + 'px'; //dont forget to add 'px' back in
    el.style.top = y + 'px';

    //loop, don't use strings in setTimeout since this is basically eval...eval is evil
    setTimeout(moveImage, 100);

}   


