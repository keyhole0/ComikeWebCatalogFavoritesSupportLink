function saveCash(localkey, data){
    if(data){
        sessionStorage[localkey] = JSON.stringify(data);
    }
}

function loadCash(localkey){
    let jsondata = sessionStorage[localkey];
    if(jsondata){
        return JSON.parse(jsondata);
    }
    return jsondata;
}

function genelateCircleData(htmltext){
    let circleData = {
        twitterLink: /https?:\/\/twitter\.com\/[\w:%#\$&\?\(\)~\.=\+\-]+(?=")/.exec(htmltext),
        pixivLink: /https?:\/\/www\.pixiv\.net\/[\w:%#\$&\?\(\)~\.=\+\-\/]+(?=")/.exec(htmltext),
        nicovideoLink: /https?:\/\/www\.nicovideo\.jp\/[\w:%#\$&\?\(\)~\.=\+\-\/]+(?=")/.exec(htmltext),
    };
    return circleData;
}

function setAnc(dom, link){
    if($(dom).parent().get(0).tagName != 'A'){
        $(dom).wrap('<a></a>');
    }
    $(dom).parent().attr('href', link);
    $(dom).parent().attr('target', '_blank');
    $(dom).css('cursor', 'pointer');
    $(dom).css('border', 'solid 1px red');
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
    if(circleData.pixivLink){
        setAnc($(circleDetailDom).next().next().find('.support-list-pixiv'), circleData.pixivLink);
    }
    if(circleData.nicovideoLink){
        setAnc($(circleDetailDom).next().next().find('.support-list-niconico'), circleData.nicovideoLink);
    }
}

function clearEvent(){
    let swampDom = function(i, e){
        $(e).clone(true).insertAfter(e);
        $(e).remove();
    };
    //DOMに紐付けられたイベントを外す方法が見つからないため、クローンを生成してオリジナルを削除することでイベントを強引にはずしている。
    $('.support-list-twitter').each(swampDom);
    $('.support-list-pixiv').each(swampDom);
    $('.support-list-niconico').each(swampDom);
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
        setTimeout(clearEvent);
        circleListDetailEach();
    });
}
main();
