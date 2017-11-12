/**
 * 插件初始化
 * @Author   andekai
 */
function _psInit(){
    var is_exist = $('#panel-slider-1').length;
    if(is_exist === 0){
        var body = $('body');
        var ps1  = $('<div class="panel-slider" id="panel-slider-1">');
        var ps2  = $('<div class="panel-slider" id="panel-slider-2">');
        var ps3  = $('<div class="panel-slider" id="panel-slider-3">');

        var confirm = 
            '<div class="modal fade panel-confirm" id="panel-confirm" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
            +   '<div class="modal-dialog" role="document">'
            +       '<div class="modal-content">'
            +           '<div class="modal-header">'
            +               '<h5 class="modal-title ps-title">标题</h5>'
            +               '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
            +                   '<span aria-hidden="true">&times;</span>'
            +               '</button>'
            +           '</div>'
            +           '<div class="modal-body ps-body"></div>'
            +           '<div class="modal-footer">'
            +               '<button type="button" class="ps-cancel btn btn-sm btn-default" data-dismiss="modal">取消'
            +               '</button>'
            +               '<button type="button" class="ps-sure btn btn-sm btn-warning">确认</button>'
            +           '</div>'
            +       '</div>'
            +   '</div>'
            +'</div>';

        var alert = '<div class="panel-alert" id="panel-alert"></div>';

        var container =
            '<div class="container-fluid ps-container">'
            +   '<div class="row ps-heading">'
            +       '<div class="col-sm-5 col-md-4 col-md-5">'
            +           '<span class="ps-close"></span>'
            +           '<span><strong class="ps-title">标题</strong></span>'
            +       '</div>'
            +       '<div class="col-sm-6 col-md-7 col-md-7 ps-control"></div>'
            +   '</div>'
            +   '<div class="row ps-body">'
            +       '<div class="col-sm-12 col-md-12 col-lg-12 ps-content"></div>'
            +   '</div>'
            +'</div>';

        ps1.append(container);
        ps2.append(container);
        ps3.append(container);

        body.append(ps1);
        body.append(ps2);
        body.append(ps3);
        body.append(confirm);
        body.append(alert);
    }    
}

/**
 * 插件主体
 * @Author   andekai
 */
window.panelSlider = function(option)
{   _psInit();
    var config = {
        url:"",
        title:"",
        where:"",
        level:1,
        width:"40%",
        submiturl:"",
        tips:"",
        them:"#eee",
        opacity:1,
        form:'#ps-form',
        method:'POST',
        data:{},
        callback:true
    };

    if(typeof option === "undefined"){
        return;
    }

    if(typeof option.title === "undefined"){
        return;
    }
    config.title = option.title;

    if(typeof option.url === "undefined"){
        return;
    }
    config.url = option.url;

    if(typeof option.level !== "undefined" && option.level > 0){
        config.level = option.level;
    }

    if(typeof option.where !== "undefined"){
        config.where = option.where;
    }

    if(typeof option.width !== "undefined" && option.width > 0){
        config.width = option.width+'%';
    }

    if(typeof option.submiturl !== "undefined"){
        config.submiturl = option.submiturl;
    }else{
        config.submiturl = config.url;
    }

    if(typeof option.success !== "undefined"){
        config.success = option.success;
    }

    if(typeof option.error !== "undefined"){
        config.error = option.error;
    }

    if(typeof option.callback !== "undefined"){
        config.callback = option.callback;
    }

    if(typeof option.form !== "undefined"){
        config.form = option.form;
    }

    if(typeof option.tips !== "undefined"){
        config.tips = option.tips;
    }
    if(typeof option.method !== "undefined"){
        config.method = option.method;
    }
    if(typeof option.data !== "undefined"){
        config.data = option.data;
    }

    //默认按钮配置
    var defaultButtons = {
        submit: {
            type: 'submit',
            text: "提交",
            class: 'btn-primary',
        },
        save: {
            type: 'submit',
            text: "保存",
            class: 'btn-primary',
        },
        reply: {
            type: 'submit',
            text: "回复",
            class: 'btn-primary',
        }
    };

    var ps        = $("#panel-slider-" + config.level);
    var ps_heading= $("#panel-slider-" + config.level + ' .ps-heading');
    var ps_close  = $("#panel-slider-" + config.level + ' .ps-close');
    var ps_title  = $("#panel-slider-" + config.level + ' .ps-title');    
    var ps_content= $("#panel-slider-" + config.level + ' .ps-content');
    var ps_control= $("#panel-slider-" + config.level + ' .ps-control');

    var confirm       = $('#panel-confirm');
    var confirm_title = $('#panel-confirm .ps-title');
    var confirm_body  = $('#panel-confirm .ps-body');
    var confirm_cancel= $('#panel-confirm .ps-cancel');
    var confirm_sure  = $('#panel-confirm .ps-sure');


    var obj = {
        _init:function(){
            //关闭已打开的滑块
            this._hide();
            // 注册关闭事件
            ps_close.unbind('click');
            ps_close.click(function(){
                obj._hide();
            });
            //初始化标题
            ps_title.html(config.title);
        },

        _initUrl:function(){
            var str = config.url.indexOf('?');
            str = str === -1 ? '?' : '&';
            _url = config.url;
            return _url + (config.where ? (str + config.where) : '');
        },

        _initButton:function(type){
            //不需要提交数据的回掉，不初始化按钮
            if(config.callback == false){
                return;
            }

            $.each(Object.keys(defaultButtons),function(){
                if(type == this){
                    var _button = $('<button type="' + defaultButtons[this]['type'] 
                        + '" class="btn btn-sm ' + defaultButtons[this]['class'] 
                        + '">' + defaultButtons[this]['text']+'</button>');
                    ps_control.append(_button);
                    _button.click(function(){
                        data = $(config.form).serializeArray();
                        $.each(config.data,function(k,v){
                            data.push({name:k,value:v});
                        });
                        obj._commitData(data);
                    });
                    return;
                }
            });
        },

        _show:function(){
            ps.animate({
                width:config.width
            },'fast');
            var loader = '<div class="loader loader-ball is-active"></div>';
            ps_content.html(loader);
            $.ajax({
                type:'GET',
                url:this._initUrl(),
                success:function(response){
                    ps_content.html(response);
                },
                error:function(response){
                    ps_content.html('页面请求错误！！！');
                }
            });
        },

        _hide:function(){
            if(config.level == 1){
                var ps3 = $('#panel-slider-3');
                var ps_control3 = $('#panel-slider-3 .ps-control');
                var ps2 = $('#panel-slider-2');
                var ps_control2 = $('#panel-slider-2 .ps-control');

                ps3.animate({width:0},'fast');
                ps_control3.find('button').remove();
                ps2.animate({width:0},'fast');
                ps_control2.find('button').remove();
            }            
            if(config.level == 2){
                var ps3 = $('#panel-slider-3');
                var ps_control3 = $('#panel-slider-3 .ps-control');

                ps_control3.find('button').remove();
                ps3.animate({width:0},'fast');

            }
            confirm.modal('hide');
            ps.animate({width:0},'fast');
            ps_control.find('button').remove();
        },

        _commitData:function(data){
            $.ajax({
                type:config.method,
                data:data,
                url:config.submiturl,
                success:function(response){
                    response = typeof(response) === 'object' ? response : $.parseJSON(response);
                    if(response.code == 1){
                        panelAlert({msg:response.msg,them:'success'});
                    }else{
                        panelAlert({msg:response.msg,them:'warning'});
                    }                    
                },
                error:function(response){
                    panelAlert({msg:'请求错误',them:'danger'})
                }
            });
            this._hide();
        },

        open:function(){
            this._init();
            this._show();
        },

        add:function(){
            this._init();
            this._initButton('submit');
            this._show();
        },

        edit:function(){
            this._init();
            this._initButton('save');
            this._show();
        },

        confirm:function(){
            confirm_title.html(config.title);
            confirm_body.html(config.tips);
            confirm_sure.unbind('click');
            confirm_sure.click(function(){
                var data = new Array();
                $.each(config.data,function(k,v){
                    data.push({name:k,value:v});
                });
                obj._commitData(data);
            });
            confirm.modal('show');
        }
    };

    return obj;
};

window.panelAlert = function(option){
    _psInit();
    var config = {
        them:'',
        msg:'提示信息',
        time:2000,
        refresh:true
    };

    var them = {
        default:'#babdbf',
        success:'#28a745',
        warning:'#ffc107',
        danger:'#c82333'
    };
    if(typeof(option.refresh) !=='undefined'){
        config.refresh = option.refresh;
    }

    if(typeof(option.msg) !== 'undefined'){
        config.msg = option.msg;
    }
    if(typeof(option.time) !== 'undefined'){
        config.time = option.time;
    }
    if(typeof(option.them) === 'undefined'){
        config.them = them['default'];
    }else{
       switch(option.them){
            case 'default':
            // 
            case 'success':
            // 
            case 'warning':
            // 
            case 'danger':
                config.them = them[option.them];
                break;
            default:
                config.them = option.them;
        } 
    }

    var panel = $('#panel-alert');
    var alert = $('<div class="ps-alert" style="background:'+config.them+';color:#fff">'+config.msg+'</div>');
    panel.append(alert);
    alert.animate({opacity:1},'fast');
    setTimeout(function(){
        alert.animate({opacity:0},'fast');
        alert.remove();
        if(config.refresh){
            location.href = location.href;
        }
    },config.time);
};