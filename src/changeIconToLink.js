
function setAnc(twtjdom, link){
    if($(twtjdom).parent().get(0).tagName != 'A'){
        $(twtjdom).wrap('<a></a>');
    }
    $(twtjdom).parent().attr('href', link);
    $(twtjdom).parent().attr('target', '_blank');
    var imgsrc = '/common/images/common/img_icon_twitter_on.png';
    if($(twtjdom).attr('src') != imgsrc){
        $(twtjdom).attr('src', imgsrc);
        $(twtjdom).css('cursor', 'pointer');
    }
}
function reqCpage(curl, collback){
    $.ajax({
        type:'GET',
        url:curl,
        success:function(data){
            var twiturl = /https?:\/\/twitter\.com\/[\w:%#\$&\?\(\)~\.=\+\-]+(?=")/.exec(data);
            if(twiturl){
                collback(twiturl[0]);
            }
        }
    });
}
function clearEvent(){
    $('.support-list-twitter').off('click');
}
function changeIconToLink(){
    $('.webcatalog-circle-list-detail:not(.gotlink)').each((i, e)=>{
        $(e).addClass('gotlink');
        setTimeout(()=>{
            var cid = $(e).attr('id');
            var curl = '/Circle/' + cid;
            reqCpage(curl, function(twit){
                setAnc($(e).next().next().find('.support-list-twitter'), twit);
            });
        },i*1000);
    });
}
function main(){
    clearEvent();
    changeIconToLink();
}
main();
