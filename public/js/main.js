var main = (function(){

    var $buttonChange = $(".change-button");
    var $titleOne = $(".title-one");
    var $titleTwo = $(".title-two");
    var $titleThree = $(".title-three");
    var $titleFour = $(".title-four");

    $buttonChange.click(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $titleOne.removeClass('toggle');
            $titleTwo.removeClass('toggle');
            $titleThree.removeClass('toggle');
            $titleFour.removeClass('toggle');
        }else{
            $(this).addClass('active');
            $titleOne.addClass('toggle');
            $titleTwo.addClass('toggle');
            $titleThree.addClass('toggle');
            $titleFour.addClass('toggle');
        }
    });

}());




