var Tabs = (function(){

    var $list = $(".tab");
    var $tabcontent = $(".tabcontent");

    $list.on('click', 'li a', function(){
        var current = $(this).attr('data-tab');
        $(this).parent('li').addClass("active").siblings().removeClass('active');
        $tabcontent.hide();
        //console.log(current);
        $(current).show();
    });

    function createTabs(){
        var display = '';
        var min = 1;
        var max = 5;
        var width = 820;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var localArr = ["One", "Two", "Three", "Four", "Five"];
        var dynamicItems = "";

        var widthSize = randonWidth(localArr.length);

        $.each(localArr, function(index, value){
            display = value.toLowerCase();
            dynamicItems += "<li class='" + ((random == index+1) ? 'active':'') + "' style='width:"+widthSize[index]+"px'><a data-tab='#" + display + "' class=tablinks>" + value + "</a></li>";

            if(random == index+1){
                $("#"+display).show();
            }
        });

        $list.append(dynamicItems);
    }

    /*
     * Creates random width size for tabs
     * */
    function randonWidth(length){
        var widthSize = [];
        var min = 70;
        var max = 200;
        var border = 4
        var width = 820 - border;

        for(var i = 0; i < length; i++){
            var random = Math.floor(Math.random() * (max - min + 1)) + min;

            if((length-1) == i && width < max){
                widthSize.push(width);
            }else{
                widthSize.push(random);
            }

            width -= random;
        }
        return widthSize;
    }

    createTabs();

}());