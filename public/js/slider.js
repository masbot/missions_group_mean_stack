var Slider = (function(){

    //settings
    var width = 60;
    var margin = 6;
    var border = 2;
    var totalWidth = width + (margin * 2) + (border * 2);
    var animationSpeed = 800;
    var totalSlides = 8;
    var numOfSlides = 3;
    var current = 1;
    var display = [1, 2, 3];

    //cache DOM elements
    var $slider = $(".slides");
    var $slideContainer = $(".options", $slider);
    var $leftArrow = $(".left-arrow");
    var $rightArrow = $(".right-arrow");
    var $sliderDisplay = $(".slider-display");
    var $currentSlide = $(".option-1");
    var $leftArrowImg = $("img", $leftArrow);

    $slideContainer.on('click', '.option', function(){
        var prev = current;
        updateCurrentClick($(this));
        updateDisplay(prev);

        if(current > 1){
            $leftArrowImg.show();
        }

        if (current < 8) {
            $rightArrow.show();
        }

        if(current == 8){
            $rightArrow.hide();
        }

        if(current == 1){
            $leftArrowImg.hide();
        }

    });

    function updateDisplay( prev ){
        $sliderDisplay.removeClass('color'+prev).addClass('color'+current);
    }

    $rightArrow.click(function(){
        if(!$slider.hasClass('moving') && current !== totalSlides){
            $leftArrowImg.show();
            $sliderDisplay.removeClass('color'+current);

            if(current + 1 == totalSlides){
                $rightArrow.hide();
            }

            if(current == display[numOfSlides - 1]){
                shiftToRight();
            }else{
                updateCurrentRight();
            }
            $sliderDisplay.addClass('color'+current);
        }
    });

    $leftArrow.click(function(){
        if(!$slider.hasClass('moving') && current !== 1){
            $rightArrow.show();
            $sliderDisplay.removeClass('color'+current);

            if(current - 1 == 1){
                $leftArrowImg.hide();
            }

            if(current == display[0]){
                shiftToLeft();
            }else{
                updateCurrentLeft();
            }
            $sliderDisplay.addClass('color'+current);
        }
    });

    function updateCurrentClick( clicked ){
        $currentSlide.removeClass('current');
        clicked.addClass('current');
        current = parseInt(clicked.attr('data-index'));
        $currentSlide = $(".option-"+current);
    }

    /*
     * Moving the slider and changing display to the right
     * */
    function shiftToRight(){
        updateCurrentRight();
        updateDisplayRight();
        $slider.addClass('moving');
        $slideContainer.animate({'margin-left': '-='+totalWidth}, animationSpeed, function(){
            $slider.removeClass('moving');
        });
    }

    function updateCurrentRight(){
        $currentSlide.removeClass('current').next().addClass('current');
        current++;
        $currentSlide = $(".option-"+current);
    }

    function updateDisplayRight(){
        $currentSlide.addClass('display');
        $(".option-"+display[0]).removeClass('display');
        display.shift();
        display.push(current);
    }

    /*
     * Moving the slider and changing display to the left
     * */
    function shiftToLeft(){
        updateCurrentLeft();
        updateDisplayLeft();
        $slider.addClass('moving');
        $slideContainer.animate({'margin-left': '+='+totalWidth}, animationSpeed, function(){
            $slider.removeClass('moving');
        });
    }

    function updateDisplayLeft(){
        $sliderDisplay.removeClass('color'+(current+1)).addClass('color'+current);
        $currentSlide.addClass('display');
        $(".option-"+display[2]).removeClass('display');
        display.push(current);
        display.reverse();
        display[1] = display[3];
        display.pop();
    }

    function updateCurrentLeft(){
        $currentSlide.removeClass('current').prev().addClass('current');
        current--;
        $currentSlide = $(".option-"+current);
    }

    function init(){
        $currentSlide.addClass('current');
        $sliderDisplay.addClass("color"+current);
        $.each(display, function(index, value){
            $(".option-"+value).addClass('display');
        });
    }

    init();
}());