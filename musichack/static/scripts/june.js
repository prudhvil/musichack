function unhideTo() {
    $("div#to").removeClass("hidden");
}


function scrollDown() {
    $("div#second").removeClass("hidden");
    $("a#logo").removeClass("hidden");
    window.location = "#second";

    $("div#first").addClass("hidden");
    $("div#fakeNav").removeClass("hidden");

    $("div#from").detach().appendTo('#second');
    $("div#to").detach().appendTo('#second');

}

$( '#from' ).keyup(function(e) {
    if (e.which == 13) {
        $("div#to").focus().fadeIn(300);
        unhideTo();
        $("#end").focus();
    return false;
  }
  
});

$( '#to' ).keyup(function(e) {
    if (e.which == 13) {
        scrollDown();
    return false;
  }
  
});



