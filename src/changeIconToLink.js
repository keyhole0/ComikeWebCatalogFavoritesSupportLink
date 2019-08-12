const domain = 'webcatalog.circle.ms';

function saveCash(localkey, data){
    if(data){
        sessionStorage[domain + localkey] = JSON.stringify(data);
    }
}

function loadCash(localkey){
    let jsondata = sessionStorage[domain + localkey];
    if(jsondata){
        return JSON.parse(jsondata);
    }
    return jsondata;
}

function genelateCircleData(htmltext){
    let circleData = {
        twitterLink: /https?:\/\/twitter\.com\/[\w:%#\$&\?\(\)~\.=\+\-]+(?=")/.exec(htmltext)
    };
    return circleData;
}

function setAnc(dom, link){
    if($(dom).parent().get(0).tagName != 'A'){
        $(dom).wrap('<a></a>');
    }
    $(dom).parent().attr('href', link);
    $(dom).parent().attr('target', '_blank');
    var imgsrc = '/common/images/common/img_icon_twitter_on.png';
    if($(dom).attr('src') != imgsrc){
        $(dom).attr('src', imgsrc);
        $(dom).css('cursor', 'pointer');
    }
}

function ajaxCirclePage(curl, successCallback){
    $.ajax({
        type:'GET',
        url:curl,
        success:successCallback
    });
}

function changeIconToLink(circleDetailDom, circleData){
    if(circleData.twitterLink){
        setAnc($(circleDetailDom).next().next().find('.support-list-twitter'), circleData.twitterLink);
    }
}

function clearEvent(){
    $('.support-list-twitter').off('click');
}

function circleListDetailEach(){
    let ajaxcnt = 0;
    $('.webcatalog-circle-list-detail:not(.gotlink)').each((i, e)=>{
        $(e).addClass('gotlink');
        let cid = $(e).attr('id');
        let curl = '/Circle/' + cid;
        let circleData = loadCash(curl);
        if(circleData){
            changeIconToLink(e, circleData);
        }else{
            setTimeout(()=>{
                ajaxCirclePage(curl, (data)=>{
                    let circleData = genelateCircleData(data);
                    saveCash(curl, circleData);
                    changeIconToLink(e, circleData);
                });
            },ajaxcnt*1000);
            ++ajaxcnt;
        }
    });
}
function main(){
    $(window).on('load',function(){
        setTimeout(clearEvent, 5000); //目的のイベントが紐付けされたあとに実行されるように。
        circleListDetailEach();
    });
}
main();
