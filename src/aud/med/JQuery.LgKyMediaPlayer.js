
/*
*Function:音视频播放展现插件
*Autor：YuZhiHui
*CreateTime:2015-09-29
*/

//引用了mCustomScrollbar滚动条插
//引用了jplayer播放器插件

; (function ($) {
    //'use strict';
    var default_options = {
        nPlayerIndex: 0,                //播放器索引
        sPlayerID: "LgKyMediaPlayer_",  //播放器的ID
        sPlayerWidth: "100%",           //播放器宽度
        sPlayerMinWidth: "360px",       //播放器最小宽度
        sPlayerHeight: "100%",          //播放器高度
        sPlayerMinHeight: "100px",      //最小高度
        bisHalfDis: true,               //文本和视频是否对半显示；true-对半显示，false-不对半显示
        //sDuration:0,                    //音视频总时长
        sTxtContent: '',                //待显示文本内容        
        nFormat: 0,                     //资料类型:0-音频类；1-视频类；2-文本类
        sContentFtpPath: '',            //资料主题内容（音频/视频/文本等）FTP路径  //音视频播放路径（远程或本地路径）
        sYuanWenFtpPath: '',            //资料原文FTP路径（音/视频原文文本，Txt类型）
        sZiMuFtpPath: '',               //资料同步xml字幕文件FTP路径
        sWenBenHtmlFtpPath: '',
        sRecodPath: '',                  //录音播放路径（远程或本地路径）
        sZiMuJsonContent: '',             //视文同步或声文同步字幕json字符串
        sMediaPlayerImagesFolderUrl: '',     //插件images文件夹的相对URL
        sJPlayerSwfUrl: ''     //JPlayer插件swf文件的相对URL
  
    };

    //播放器参数json对象，nCurPlayPos：当前播放位置；nCurVolumePos：当前音量位置
    var g_jPlayerParam = { nCurPlayPos: 0, nCurVolumePos: 50 };
    //播放器类型：0-windows media player;1-jplayer;2-vlc activeX
    var g_nPlayerType = 0;
    var g_bIsPrgsWrapperMouseDown = false;
    var opts = {};

    //插件公用方法json对象
    var methods = {
        //插件初始化方法
        init: function (options) {
            g_bIsPrgsWrapperMouseDown = false;
            opts = $.extend({}, default_options, options);
            // 在每个元素上执行方法
            return $(this).each(function () {
                $this = $(this);
                var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
                var l_nPlayerIndex = o.nPlayerIndex;    //播放器索引
                var l_sPlayerWidth = o.sPlayerWidth;    //播放器宽度
                var l_sPlayerHeight = o.sPlayerHeight;    //播放器高度
                var l_sTxtContent = o.sTxtContent;    //待显示文本内容
                var l_nFormat = o.nFormat;    //资料类型:0-音频类；1-文本类；2-录音；3-视频类
                var l_sContentFtpPath = o.sContentFtpPath;    //资料主题内容（音频/视频/文本等）FTP路径  //音视频播放路径（远程或本地路径）
                var l_sYuanWenFtpPath = o.sYuanWenFtpPath;    //资料原文FTP路径（音/视频原文文本，Txt类型）
                var l_sZiMuFtpPath = o.sZiMuFtpPath;          //资料同步字幕文件FTP路径
                var l_sWenBenHtmlFtpPath = o.sWenBenHtmlFtpPath;    //转换后的html的文件FTP路径
                var l_sRecodPath = o.sRecodPath;              //录音播放路径（远程或本地路径）
                var l_sPlayerID = o.sPlayerID + o.nPlayerIndex; //播放器id
                var l_bisHalfDis = o.bisHalfDis,
                    l_sZiMuJsonContent = o.sZiMuJsonContent,
                    l_sMediaPlayerImagesFolderUrl = o.sMediaPlayerImagesFolderUrl;
                //var l_sDuration = o.sDuration; //音视频的播放总时长（暂未实现，先不加）
                var l_sCurPalyUrl = "";     //音视频播放路径
                var l_nPlayState = 0; //音视频的播放标示：0-未播放/停止播放；1-开始播放；2-暂停播放

                var l_aStartTime = new Array();  //从xml文件中解析出的时间起点数组
                var l_aEndTime = new Array(); //从xml文件中解析出的时间长度数组
                var l_nPlayerType = 0;	//播放器类型：0-windows media player;1-jplayer;2-vlc activeX

                //vlc activeX
                //var l_sVMPhtml = '<object id="' + l_sPlayerID + '" width="0%" height="0%" classid="CLSID:8419D9AD-6580-4BDD-B3A9-6EC8E9927827" style="display:block;width:0px;height:0px;" ObjFlag="VLC_OcxPlayer" ></object>';

                //window media player
                var l_sVMPhtml = '<object id="' + l_sPlayerID
                    + '" width="0" height="0" classid="CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6" '
                    + 'style="display:block;width:0px;height:0px;" ObjFlag="WMP_OcxPlayer">'
                    + '<param NAME="AutoStart" VALUE=false></object>';

                $this.empty().append(
                    '<div class="LgKyMediaPlayerArea" id="id_LgKyMediaPlayerArea_' + l_nPlayerIndex + '">' +
                        '<div class="LgKyJplayer" id="LgKyJplayer_' + l_nPlayerIndex + '" ObjFlag="objJPlayer"></div>' +
                        '<div class="LgKyMediaPlayerDis" id="id_LgKyMediaPlayerDis_' + l_nPlayerIndex + '"></div>' +
                        '<div class="LgKyMediaPlayerCtl" id="id_LgKyMediaPlayerCtl_' + l_nPlayerIndex + '"></div>' +
                    '</div>');

                //设置播放器宽高
                $("#id_LgKyMediaPlayerArea_" + l_nPlayerIndex + "")
                    .css({ "width": l_sPlayerWidth, "height": l_sPlayerHeight });

                //添加显示的文本内容
                if (0 == l_nFormat) {   //音频类                                   

                    var l_sStrAppended = l_sTxtContent;
                    //获取字幕文件后缀名
                    var l_sZiMuFileExtend = l_sZiMuFtpPath.substr(l_sZiMuFtpPath.lastIndexOf(".") + 1).toLowerCase();
                    //声文同步（xml）
                    if (l_sZiMuFtpPath.length > 0 && l_sZiMuFileExtend == "xml") {
                        var l_XmlObj = XMLHelper(l_sZiMuFtpPath, l_nPlayerIndex);
                        l_sStrAppended = l_XmlObj.StrTemp;
                        l_aStartTime = l_XmlObj.StartTime;
                        l_aEndTime = l_XmlObj.TimeLength;

                        $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                            .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "'>" + l_sStrAppended + "</div>");    //style='overflow-y:scroll;'
                        $("#id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "")
                            .css({ "width": "100%", "height": "100%" });
                    }
                    else {
                        //声文同步（json）
                        if (l_sZiMuJsonContent.length > 0) {
                            var l_objZiMuJsonObj = eval('(' + l_sZiMuJsonContent + ')'), l_StrTemp = '';

                            $(l_objZiMuJsonObj).each(function () {
                                l_StrTemp +=
                                    '<p id="id_LgKyMediaPlayer_' + l_nPlayerIndex + '_' + this.nIndex + '">'
                                    + this.Content + '</p>';

                                l_aStartTime.push(this.StartTime);
                                l_aEndTime.push(this.EndTime);
                            });

                            $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").empty()
                                    .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" +
                                    l_nPlayerIndex + "' style='overflow-y:auto;'>" + l_StrTemp + "</div>");
                        }
                        else if (l_sTxtContent.length > 0) {
                            $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                                    .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" +
                                    l_nPlayerIndex + "' style='overflow-y:auto;'>"
                                    + "<p>" + l_sTxtContent + "</p>"
                                    + "</div>");
                        }
                        else {
                            //获取文件后缀名
                            var l_sWenBenHtmlFileExt =
                                l_sWenBenHtmlFtpPath.substr(l_sWenBenHtmlFtpPath.lastIndexOf(".") + 1).toLowerCase();

                            if (l_sWenBenHtmlFtpPath != null && l_sWenBenHtmlFtpPath.length > 0
                                && l_sWenBenHtmlFileExt == 'html') {
                                $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                                    .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "'><iframe width='100%' height='100%' frameborder='0' border='0' scrolling='yes' src='" + l_sWenBenHtmlFtpPath + "'></iframe></div>");
                                $("#id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "").css({ "width": "100%", "height": "100%" });
                            }
                            else {
                                $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                                    .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "'>" + l_sStrAppended + "</div>");    //style='overflow-y:scroll;'                            
                                $("#id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "")
                                    .css({ "width": "100%", "height": "100%" });
                            }
                        }
                    }

                    /*
                    $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "'>" + l_sStrAppended + "</div>");    //style='overflow-y:scroll;'
                    $("#id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "").css({ "width": "100%", "height": "100%" });
                    */

                    var l_sContentFileExt = l_sContentFtpPath.substr(l_sContentFtpPath.lastIndexOf('.') + 1).toLowerCase();

                    if (l_sContentFileExt == 'wav') {
                        if (window.ActiveXObject) {     //浏览器支持ActiveX控件
                            l_nPlayerType = 0;
                            g_nPlayerType = l_nPlayerType;
                            $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").append('<div style="width:0px;height:0px;">'
                                + l_sVMPhtml + '</div>');
                        }
                        else {  //浏览器不支持ActiveX控件
                            $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").append("<div id='" + l_sPlayerID
                                + "' style='width:0px;height:0px;'></div>");

                            l_nPlayerType = 1;
                            g_nPlayerType = l_nPlayerType;
                            var l_objMedia = { title: "", wav: l_sContentFtpPath };
                            $('#' + l_sPlayerID).jPlayer({
                                ready: function (event) {
                                    $(this).jPlayer("setMedia", l_objMedia);
                                },

                                /*
                                //swfPath:  '<%=WebResource("LgSoft.Control.MakeItem.Resources.Plugin.jplayer.dist.jplayer.jquery.jplayer.swf',							    
                                swfPath: encodeURI(window.location.protocol + '//' + window.location.hostname + ':'
                                    + window.location.port + '/KylxPro/Plug-in/jPlayer-2.9.2/dist/jplayer'),
                                */

                                //swfPath: "../Plug-in/jPlayer-2.9.2/dist/jplayer",
                                swfPath: opts.sJPlayerSwfUrl,
                                solution: "html,flash",
                                supplied: "wav,mp3,m4a",
                                size: {
                                    width: "0px",
                                    height: "0px"
                                },
                                wmode: "window",
                                useStateClassSkin: true,
                                autoBlur: false,
                                smoothPlayBar: true,
                                keyEnabled: false,
                                remainingDuration: true,
                                toggleDuration: true,
                                error: function (event) {
                                    switch (event.jPlayer.error.type) {
                                        case $.jPlayer.error.URL: break;
                                        case $.jPlayer.error.NO_SOLUTION: break;
                                    }
                                }
                            });
                        }
                    }
                    else if (l_sContentFileExt == 'mp3') {
                        $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").append("<div id='" + l_sPlayerID + "'></div>");

                        l_nPlayerType = 1;
                        g_nPlayerType = l_nPlayerType;
                        var l_objMedia = { title: "", mp3: l_sContentFtpPath };

                        $('#' + l_sPlayerID).jPlayer({
                            ready: function (event) {
                                $(this).jPlayer("setMedia", l_objMedia);
                            },
                            //swfPath: "../Plug-in/jPlayer-2.9.2/dist/jplayer",
                            swfPath: opts.sJPlayerSwfUrl,
                            //solution: "flash,html",
                            solution: "html,flash",
                            supplied: "wav,mp3,m4a",
                            wmode: "window",
                            useStateClassSkin: true,
                            autoBlur: false,
                            size: { width: '0px', height: '0px' },
                            smoothPlayBar: true,
                            keyEnabled: false,
                            error: function (event) {
                                //alert(event.jPlayer.error.type);
                                switch (event.jPlayer.error.type) {
                                    case $.jPlayer.error.URL: break;
                                    case $.jPlayer.error.NO_SOLUTION: break;
                                }
                            }
                        });
                    }
                }
                else if (1 == l_nFormat) {  //视频类

                    var l_sContentFileExt =
                        l_sContentFtpPath.substr(l_sContentFtpPath.lastIndexOf('.') + 1).toLowerCase();

                    l_nPlayerType = 1;
                    g_nPlayerType = l_nPlayerType;
                    var l_objMedia = {};
                    var l_sSolution = '';

                    switch (l_sContentFileExt) {
                        case 'mp4':
                            l_objMedia = { title: "", m4v: l_sContentFtpPath };
                            l_sSolution = "html, flash";

                            //如果是IE或者是Edge，则选择使用flash播放MP4视频
                            var userAgent = navigator.userAgent;
                            if (userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Windows NT 6.1; Trident/7.0;') > -1) {
                                l_objMedia = { title: "", flv: l_sContentFtpPath };
                                l_sSolution = "flash, html";
                            }
                            break;
                        case 'flv':
                            l_objMedia = { title: "", flv: l_sContentFtpPath };
                            l_sSolution = "flash, html";
                            break;
                        default: break;
                    }

                    if (((typeof (l_sTxtContent) != "undefined" && l_sTxtContent.length > 0) ||
                        l_sZiMuFtpPath.length > 0) && l_bisHalfDis) {  //有文本需要显示

                        $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                            .append("<div class='LgKycls_LgKyMediaPlayer' id='" + l_sPlayerID + "'>" + l_sVMPhtml + "</div>");

                        $("#" + l_sPlayerID).css({ "width": "100%", "height": "100%", "float": "left" });

                        var l_sStrAppended = l_sTxtContent;
                        var l_sZiMuFileExtend = l_sZiMuFtpPath.substr(l_sZiMuFtpPath.lastIndexOf(".") + 1).toLowerCase();   //获取字幕文件后缀名
                        //视文同步（xml）
                        if (l_sZiMuFtpPath.length > 0 && l_sZiMuFileExtend == "xml") {
                            var l_XmlObj = XMLHelper(l_sZiMuFtpPath, l_nPlayerIndex);
                            l_sStrAppended = l_XmlObj.StrTemp;
                            l_aStartTime = l_XmlObj.StartTime;
                            l_aEndTime = l_XmlObj.TimeLength;
                        }

                        $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "")
                            .append("<div class='LgKycls_LgKyMediaPlayerTxt' id='id_LgKyMediaPlayerTxt_" +
                            l_nPlayerIndex + "' style='overflow-y:auto;'><p>" + l_sStrAppended + "</p></div>");

                        $("#id_LgKyMediaPlayerTxt_" + l_nPlayerIndex + "")
                            .css({ "width": "98%", "height": "auto", "margin": "5px auto" });
                    }
                    else {  //没有文本需要显示                   
                        $("#id_LgKyMediaPlayerDis_" + l_nPlayerIndex + "").css({ "width": "100%", "height": "80%" })
                            .append("<div class='LgKycls_LgKyMediaPlayer' id='" + l_sPlayerID + "'></div>");
                        $("#" + l_sPlayerID).css({ "width": "100%", "height": "100%", "float": "left","overflow":'hidden' });
                    }

                    $('#' + l_sPlayerID).addClass('jp-jplayer').jPlayer({
                        ready: function (event) {
                            $(this).jPlayer("setMedia", l_objMedia);
                        },

                        swfPath: opts.sJPlayerSwfUrl,
                        //solution: "html,flash",
                        solution:l_sSolution,
                        supplied: "m4v, flv",
                        useStateClassSkin: true,
                        autoBlur: false,
                        size: { width: '100%', height: '100%' },
                        smoothPlayBar: true,
                        keyEnabled: false,
                        error: function (event) {
                            switch (event.jPlayer.error.type) {
                                case $.jPlayer.error.URL: break;
                                case $.jPlayer.error.NO_SOLUTION: break;
                            }
                        }
                    });

                }

                var l_sItemAnsCtlPanelHtml = '';

                l_sItemAnsCtlPanelHtml += '<div class="LgKycls_controlbar"><div class="LgKytop-panel">';
                //播放进度
                l_sItemAnsCtlPanelHtml += '<div class="LgKypane">' +
                                    '<div class="LgKyprogress-wrapper" id="PrgsWrapper_' + l_nPlayerIndex + '">' +
                                        '<div class="LgKyui-slider-range"></div>' +
                                        '<div class="LgKyui-slider-progressbar"></div>' +
                                        '<div class="LgKyslider-wrapper-x"></div>' +
                                    '</div>' +
                                '</div>';
                l_sItemAnsCtlPanelHtml += '</div>' +
                        '<div class="LgKybot-panelX">' +
                            '<div class="LgKyctl-btn">';
                l_sItemAnsCtlPanelHtml += '<img id="id_PlayOrPauseAudio_' + l_nPlayerIndex + '" class="LgKycls_PlayOrPauseAudio" src="" title="播放" />';
                if (l_sRecodPath.length > 0) {  //需播放录音
                    l_sItemAnsCtlPanelHtml += '<img id="id_PlayOrPauseRecord_' + l_nPlayerIndex + '" class="LgKycls_PlayOrPauseRecord" src="" title="播放录音" />';
                }
                l_sItemAnsCtlPanelHtml += '<img id="id_Stop_' + l_nPlayerIndex + '" class="LgKycls_Stop" src="" title="停止" />';

                //显示播放时间
                l_sItemAnsCtlPanelHtml += '</div><span class="LgKycls_showProText" id="id_showProText' + l_nPlayerIndex + '">00:00:00 / 00:00:00</span>';

                l_sItemAnsCtlPanelHtml += '<div class="LgKyctl-volumeX">';
                //音量
                l_sItemAnsCtlPanelHtml += '<div class="LgKyvolumeX" id="Volume_' + l_nPlayerIndex + '">' +
                '<a id="muteVolume_'+ l_nPlayerIndex + '" title="静音" class="LgKymute"></a>' +
                '<div class="LgKyvol-slider-wrapper">' +
                '<div class="LgKyvol-sliderX" id="VolSlider_' + l_nPlayerIndex + '">' +
                '<div class="LgKyui-slider-range"></div>' +
                '<a class="LgKyui-slider-handle"></a>' +
                '</div>' +
                '</div>' +
                '</div>';
                

                l_sItemAnsCtlPanelHtml += '<div class="LgKycls_ItemAnsCtlPanel_right">' +
                //'<div class="cls_DisYuanWen"><input id="id_isDisYuanWen_' + l_nPlayerIndex + '" type="checkbox" checked="checked"/>显示原文</div>' +
                        '</div>' +
                        '</div></div></div>';

                $("#id_LgKyMediaPlayerCtl_" + l_nPlayerIndex + "").append(l_sItemAnsCtlPanelHtml);

                //自定义滚动条的初始化
                //$('#id_LgKyMediaPlayerTxt_' + l_nPlayerIndex).mCustomScrollbar({ scrollInertia: 400 });

                PlayerInitialize(l_nPlayerIndex, l_sPlayerID, l_aStartTime, l_aEndTime, l_nPlayerType); //播放器初始化

                var l_jPlayOrPauseRes = new Object();       //播放/暂停音视频返回的json对象
                var l_jPlayOrPauseRecordRes = new Object(); //播放/暂停录音返回的json对象

                //音视频的播放/暂停
                $("#id_PlayOrPauseAudio_" + l_nPlayerIndex).click(function () {
                    l_jPlayOrPauseRes = PlayOrPause(l_sContentFtpPath, l_nFormat, l_nPlayerIndex, l_sPlayerID,
						l_nPlayState, l_sCurPalyUrl, l_nPlayerType);

                    l_sCurPalyUrl = l_jPlayOrPauseRes.sCurPalyUrl;
                    l_nPlayState = l_jPlayOrPauseRes.nPlayState;
                });
                //录音的播放/暂停
                $("#id_PlayOrPauseRecord_" + l_nPlayerIndex).click(function () {
                    l_jPlayOrPauseRecordRes = PlayOrPauseRecord(l_sRecodPath, l_nPlayerIndex, l_sPlayerID,
						l_nPlayState, l_sCurPalyUrl, l_nPlayerType);
                    l_sCurPalyUrl = l_jPlayOrPauseRecordRes.sCurPalyUrl;
                    l_nPlayState = l_jPlayOrPauseRecordRes.nPlayState;
                });
                //停止播放
                $("#id_Stop_" + l_nPlayerIndex).click(function () {
                    l_nPlayState = StopPlay(l_nPlayerIndex, l_sPlayerID);
                });
              
                //计算播放时间
                $("#LgKyMediaPlayer_" + l_nPlayerIndex).bind($.jPlayer.event.timeupdate, function (event) {
                    var totaltime = event.jPlayer.status.duration;
                    var time = event.jPlayer.status.currentTime;
                    var timeTemp = parseTime(time);
                    var totalTemp = parseTime(totaltime);
                    $("#id_showProText" + l_nPlayerIndex).text(timeTemp + ' / ' + totalTemp);

                });
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 删除元素对应的数据
                $this.removeData('LgKyMediaPlayer');
                $this.html("");
            });
        },
        //停止播放器
        stop: function (options) {
            //var opts = $.extend({}, default_options, options);
            return $(this).each(function () {
                $this = $(this);
                var l_jOpts = $.meta ? $.extend({}, opts, $this.data()) : opts;
                var l_nPlayerIndex = l_jOpts.nPlayerIndex;    //播放器索引
                var l_sPlayerID = l_jOpts.sPlayerID + l_jOpts.nPlayerIndex; //播放器id

                $("#id_Stop_" + l_nPlayerIndex).trigger('click');

                //StopPlay(l_nPlayerIndex, l_sPlayerID);
            });
        }
        
    };
    //作答控制区域初始化：控件初始化和界面显示初始化
    function PlayerInitialize(p_nPlayerIndex, p_sPlayerID, p_aStartTime, p_aEndTime, p_nPlayerType) {
        //控件初始化
        OnStop(p_sPlayerID, p_nPlayerType);           //停止播放

        //界面初始化,控制按钮初始化
        $("#id_PlayOrPauseAudio_" + p_nPlayerIndex)
            .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png'); //音视频播放暂停
        $("#id_PlayOrPauseRecord_" + p_nPlayerIndex)
            .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png');    //录音播放暂停
        $("#id_Stop_" + p_nPlayerIndex)
            .attr("src", opts.sMediaPlayerImagesFolderUrl + 'stopinit.png');    //停止

        //播放进度条初始化
        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', "0px");
        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css("width", "0px");
        //音量进度条
        $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').css('left', "" + g_jPlayerParam.nCurVolumePos + "%");
        $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', "" + g_jPlayerParam.nCurVolumePos + "%");

        //移动滑块控制播放进度
        var l_PlayPos = 0;
        var move = false;   //移动标记
        var _x;             //鼠标离滑块左上角的相对位置
        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').mousedown(function (e) {
            move = true;
            _x = e.pageX - parseInt($(this).css('left'));
            g_bIsPrgsWrapperMouseDown = true;
        });
        $(document).mousemove(function (e) {
            if (move) {
                var x = e.pageX - _x;   //移动时根据鼠标位置计算控件左上角的绝对位置
                l_PlayPos = x;

                var l_PrgsWrapperW = parseInt($('#PrgsWrapper_' + p_nPlayerIndex + '').css('width'));

                if (l_PlayPos >= 0 && l_PlayPos <= l_PrgsWrapperW) {
                    if (l_PlayPos + 12 <= l_PrgsWrapperW) {
                        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', l_PlayPos + 'px');
                        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', l_PlayPos + 'px');
                    }
                    else {
                        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', (l_PrgsWrapperW - 12) + 'px');
                        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', (l_PrgsWrapperW - 12) + 'px');
                    }
                }
            }
        }).mouseup(function () {
            if (move) {
                var l_PrgsWrapperW = parseInt($('#PrgsWrapper_' + p_nPlayerIndex + '').css('width'));

                if (l_PlayPos >= 0 && l_PlayPos <= l_PrgsWrapperW) {
                    g_jPlayerParam.nCurPlayPos = parseInt(l_PlayPos / l_PrgsWrapperW * 100);
                    SetPlayPosition(g_jPlayerParam.nCurPlayPos, p_sPlayerID); //设置播放进度                    
                }
                move = false;
                g_bIsPrgsWrapperMouseDown = false;
            }
        });

        //单击进度条区域控制播放进度
        $('#PrgsWrapper_' + p_nPlayerIndex + '').click(function (e) {
            var m_x = e.pageX - $(this).offset().left;
            l_PlayPos = m_x;

            var l_PrgsWrapperW = parseInt($('#PrgsWrapper_' + p_nPlayerIndex + '').css('width'));

            if (l_PlayPos >= 0 && l_PlayPos <= l_PrgsWrapperW) {
                //计算单击进度条后当前播放的音频位置
                g_jPlayerParam.nCurPlayPos = l_PlayPos / l_PrgsWrapperW * 100;
                //设置播放进度
                SetPlayPosition(g_jPlayerParam.nCurPlayPos, p_sPlayerID);

                if (l_PlayPos + 12 <= l_PrgsWrapperW) {
                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', l_PlayPos + 'px');
                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', l_PlayPos + 'px');
                }
                else {
                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', (l_PrgsWrapperW - 12) + 'px');
                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', (l_PrgsWrapperW - 12) + 'px');
                }
            }
        });
        //拖动滑块设置音量大小
        var v_x;
        var mvf = false;
        $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').mousedown(function (e) {
            mvf = true;
            v_x = e.pageX - parseInt($(this).css('left'));
        });
        $(document).mousemove(function (e) {
            if (mvf) {
                var vx = e.pageX - v_x;
                if (vx >= 0 && vx <= parseInt($('#VolSlider_' + p_nPlayerIndex + '').css('width'))) {
                    $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').css('left', vx + "px");
                    $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', vx + "px");
                    g_jPlayerParam.nCurVolumePos = vx / parseInt($('#VolSlider_' + p_nPlayerIndex + '').css('width')) * 100;
                    SetPlayVolume(g_jPlayerParam.nCurVolumePos, p_sPlayerID);              //设置音量大小                    
                }
            }
        }).mouseup(function () {
            if (mvf) {
                mvf = false;
            }
        });
        //单击音量进度条区域设置音量大小
        $('#VolSlider_' + p_nPlayerIndex + '').click(function (e) {
            var offset = e.pageX - $('#VolSlider_' + p_nPlayerIndex + '').offset().left;

            if (offset <= 0) {
                //$('#Volume_' + p_nPlayerIndex + ' .mute')
                //    .css("background", "url(../Plugin/LgKyMediaPlayer/mute.png) no-repeat -324px -432px");
                $('#Volume_' + p_nPlayerIndex + ' .mute')
                    .css("background", "url(../Plug-in/LgKyMediaPlayer/Images/mute.png) no-repeat 0px 0px");
                isMute = true;
            }
            else {
                //$('#Volume_' + p_nPlayerIndex + ' .mute')
                //    .css('background', 'url(../Plugin/LgKyMediaPlayer/volume.png) no-repeat -96px -384px');
                $('#Volume_' + p_nPlayerIndex + ' .mute')
                    .css("background", "url(../Plug-in/LgKyMediaPlayer/Images/volume.png) no-repeat 0px 0px");
                isMute = false;
            }

            if (offset >= 0 && offset <= parseInt($('#VolSlider_' + p_nPlayerIndex + '').css('width'))) {
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').css('left', offset);
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', offset);
                //由长度比例计算设置的音量的大小
                g_jPlayerParam.nCurVolumePos = offset / parseInt($('#VolSlider_' + p_nPlayerIndex + '').css('width')) * 100;
                SetPlayVolume(g_jPlayerParam.nCurVolumePos, p_sPlayerID);
            }
        });
        //单击音量图标设置是否静音
        var isMute = false; //静音标记
        $("#muteVolume_" + p_nPlayerIndex ).click(function () {
            if (!isMute) {
                isMute = true;
                //$(this).css("background", "url(../Plugin/LgKyMediaPlayer/mute.png) no-repeat -324px -432px");
                $(this).css("background", "url(../Plug-in/LgKyMediaPlayer/Images/mute.png) no-repeat ");
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').css('left', "0%");
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', "0%");
                SetPlayVolume(0, p_sPlayerID);
            }
            else {
                isMute = false;
                //$(this).css("background", "url(../Plugin/LgKyMediaPlayer/volume.png) no-repeat -96px -384px");
                $(this).css("background", "url(../Plug-in/LgKyMediaPlayer/Images/volume.png) no-repeat");
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-handle').css('left', "50%");
                $('#VolSlider_' + p_nPlayerIndex + ' .LgKyui-slider-range').css('width', "50%");
                SetPlayVolume(50, p_sPlayerID);
            }
        });

        PlayerEventHandler(p_nPlayerIndex, p_sPlayerID, p_aStartTime, p_aEndTime, p_nPlayerType);
    };

    /*音视频和文本的播放
    *@param p_PlayPath:音视频的路径或文本字符串
    *@param p_nFormat:资料类型*/
    function PlayOrPause(p_PlayPath, p_nFormat, p_nPlayerIndex, p_sPlayerID, p_nPlayState, p_sCurPalyUrl,p_nPlayerType) {

        var l_sPalyUrl = encodeURI(p_PlayPath);

        if (l_sPalyUrl != p_sCurPalyUrl || 0 == p_nPlayState) {    //开始播放；停止状态
            OnPlay(l_sPalyUrl, p_sPlayerID, p_nPlayerType);
            $("#id_PlayOrPauseAudio_" + p_nPlayerIndex)
                .attr("src", opts.sMediaPlayerImagesFolderUrl + 'pauseinit.png');
        }
        if (1 == p_nPlayState) {    //播放状态
            OnPause(true, p_sPlayerID, p_nPlayerType); //暂停
            $("#id_PlayOrPauseAudio_" + p_nPlayerIndex)
                .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png');
        }
        else if (2 == p_nPlayState) {   //暂停状态
            OnPause(false, p_sPlayerID, p_nPlayerType); //播放
            $("#id_PlayOrPauseAudio_" + p_nPlayerIndex)
                .attr("src", opts.sMediaPlayerImagesFolderUrl + 'pauseinit.png');
        }

        switch (p_nPlayState) {
            case 0: //停止状态
                p_nPlayState = 1;   //置为播放状态
                break;
            case 1: //播放状态
                p_nPlayState = 2;   //置为暂停状态
                break;
            case 2: //暂停状态
                p_nPlayState = 1;   //置为播放状态
                break;
            default:
        }

        p_sCurPalyUrl = l_sPalyUrl; //当前播放的的音视频Url

        return { nPlayState: p_nPlayState, sCurPalyUrl: p_sCurPalyUrl };
    };
    //录音的播放暂停
    function PlayOrPauseRecord(p_RecordPath, p_nPlayerIndex, p_sPlayerID, p_nPlayState, p_sCurPalyUrl, p_nPlayerType) {
        var l_sPalyUrl = encodeURI(p_RecordPath);

        if (l_sPalyUrl != p_sCurPalyUrl || 0 == p_nPlayState) {    //开始播放
            OnPlay(l_sPalyUrl, p_sPlayerID, p_nPlayerType);
            $("#id_PlayOrPauseRecord_" + p_nPlayerIndex).attr("src", opts.sMediaPlayerImagesFolderUrl + 'pauseinit.png');
        }
        if (1 == p_nPlayState) {
            OnPause(true, p_sPlayerID, p_nPlayerType); //暂停
            $("#id_PlayOrPauseRecord_" + p_nPlayerIndex)
                .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png');
        }
        else if (2 == p_nPlayState) {
            OnPause(false, p_sPlayerID, p_nPlayerType); //播放
            $("#id_PlayOrPauseRecord_" + p_nPlayerIndex)
                .attr("src", opts.sMediaPlayerImagesFolderUrl + 'pauseinit.png');
        }
        switch (p_nPlayState) {
            case 0: //停止状态
                p_nPlayState = 1;   //置为播放状态
                break;
            case 1: //播放状态
                p_nPlayState = 2;   //置为暂停状态
                break;
            case 2: //暂停状态
                p_nPlayState = 1;   //置为播放状态
                break;
            default:
        }
        p_sCurPalyUrl = l_sPalyUrl; //当前播放的的音视频Url

        return { nPlayState: p_nPlayState, sCurPalyUrl: p_sCurPalyUrl };
    };
    //停止音视频、录音的播放
    function StopPlay(p_nPlayerIndex, p_sPlayerID) {
        //停止播放
        OnStop(p_sPlayerID, g_nPlayerType);

        //控制按钮初始化
        $("#id_PlayOrPauseAudio_" + p_nPlayerIndex)
            .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png'); //音视频播放
        $("#id_PlayOrPauseRecord_" + p_nPlayerIndex)
            .attr("src", opts.sMediaPlayerImagesFolderUrl + 'playinit.png');   //录音播放
        //播放进度条初始化
        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', "0px");
        $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css("width", "0px");

        $("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");

        return 0;   //返回停止状态
    };
    //播放器事件处理
    function PlayerEventHandler(p_nPlayerIndex, p_sPlayerID, p_aStartTime, p_aEndTime, p_nPlayerType) {

        switch (p_nPlayerType) {
            case 0: //windows media player

                var l_objWMP = $('#' + p_sPlayerID).get(0);
                var l_nSeninterval = 0;

                l_objWMP.SendPlayStateChangeEvents = true;    //设置控件发送播放状态改变事件
                //播放状态改变事件
                RegisterEvent(l_objWMP, 'PlayStateChange', function () {
                    if (l_objWMP.PlayState == 1 || l_objWMP.PlayState == 2) {    //停止或暂停
                        clearInterval(l_nSeninterval);
                        if (l_objWMP.PlayState == 1) {    //停止                            
                            $("#id_Stop_" + p_nPlayerIndex).trigger("click");   //触发播放停止按钮

                            $("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");
                        }
                    }
                    else if (l_objWMP.PlayState == 3) {   //播放                        
                        clearInterval(l_nSeninterval);
                        l_nSeninterval = setInterval(function () {
                            //播放进度条处理
                            var progresswidth =
                                parseInt($('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-progressbar').css("width")) - 12;

                            var totaltime = l_objWMP.currentMedia.duration;
                            var newtime = l_objWMP.controls.currentPosition;

                            if (newtime <= totaltime && totaltime != 0) {
                                var m_x = parseInt(progresswidth * newtime / totaltime);
                                if (!g_bIsPrgsWrapperMouseDown) {
                                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', m_x + "px");
                                    $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css("width", m_x + "px");
                                }

                                //声文同步标记在读句子
                                for (var i = 0; i < p_aStartTime.length; i++) {
                                    var l_BT = parseFloat(p_aStartTime[i]);
                                    if (time >= (l_BT > 0.25 ? l_BT - 0.25 : l_BT) && time <= l_BT + 0.25) {
                                        //$("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");
                                        $("#id_LgKyMediaPlayer_" + p_nPlayerIndex + "_" + (i + 1) + "")
                                            .css("color", "red").siblings().css("color", "inherit");
                                    }
                                }
                            }

                        }, 100);
                    }
                });
                break;
            case 1: //Jplayer

                //当多媒体播放结束时触发
                $('#' + p_sPlayerID).bind($.jPlayer.event.ended, function (event) {
                    $("#id_Stop_" + p_nPlayerIndex).trigger("click");   //触发播放停止按钮

                    $("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");
                });

                //当当前事件被改变时触发
                $('#' + p_sPlayerID).bind($.jPlayer.event.timeupdate, function (event) {
                    var totaltime = event.jPlayer.status.duration;
                    var time = event.jPlayer.status.currentTime;

                    //console.log('totaltime:' + totaltime);

                    if (time <= totaltime && totaltime != 0) {
                        //播放进度条处理
                        var progresswidth =
                            parseInt($('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-progressbar').css("width")) - 12;
                        var m_x = parseInt(progresswidth * time / totaltime);
                        if (!g_bIsPrgsWrapperMouseDown) {
                            $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', m_x + "px");
                            $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css("width", m_x + "px");
                        }

                        //声文同步标记在读句子
                        for (var i = 0; i < p_aStartTime.length; i++) {
                            var l_BT = parseFloat(p_aStartTime[i]);
                            if (time >= (l_BT > 0.25 ? l_BT - 0.25 : l_BT) && time <= l_BT + 0.25) {
                                //$("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");
                                $("#id_LgKyMediaPlayer_" + p_nPlayerIndex + "_" + (i + 1) + "")
                                    .css("color", "red").siblings().css("color", "inherit");
                            }
                        }

                    }
                });

                //当多媒体被播放时触发
                $('#' + p_sPlayerID).bind($.jPlayer.event.play, function (event) {
                    //$('#' + p_sPlayerID).jPlayer('stop');
                    //alert("");
                });

                break;
            case 2: //VLC_AX player
                var vod = $('#' + p_sPlayerID)[0];

                if (vod != null) {

                    RegisterEvent(vod, 'EndPlayOperation', function () {
                        $("#id_Stop_" + p_nPlayerIndex).trigger("click");   //触发播放停止按钮
                    });

                    RegisterEvent(vod, 'DoingPlayOperation', function (newtime, totaltime) {
                        //g_totaltime = totaltime;
                        //播放进度条处理
                        var progresswidth = parseInt($('#PrgsWrapper_' + p_nPlayerIndex + '').css("width")) - 18;
                        var m_x = parseInt(progresswidth * newtime / totaltime);
                        if (!g_bIsPrgsWrapperMouseDown) {
                            $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyslider-wrapper-x').css('left', m_x + "px");
                            $('#PrgsWrapper_' + p_nPlayerIndex + ' .LgKyui-slider-range').css("width", m_x + "px");
                        }

                        //声文同步句子高亮显示
                        for (var i = 0; i < p_aStartTime.length; i++) {
                            var l_BT = parseFloat(p_aStartTime[i]);
                            var l_ET = parseFloat(p_aStartTime[i]) + parseFloat(p_aEndTime[i]);
                            if (newtime >= l_BT && newtime <= l_ET) {
                                $("#id_LgKyMediaPlayerTxt_" + p_nPlayerIndex + " p").css("color", "inherit");
                                $("#s_" + p_nPlayerIndex + "_" + i + "").css("color", "red");
                            }
                        }
                    });
                }
                break;
            default:
                break;
        }

    };
    /*
    *@事件注册函数
    *@param objplayer：播放对象
    *@param event：事件名称
    *@param handler：事件处理函数
    */
    function RegisterEvent(objplayer, event, handler) {
        if (objplayer) {
            if (objplayer.attachEvent) {
                // Microsoft IE
                objplayer.attachEvent(event, handler);
            } else if (objplayer.addEventListener) {
                // Mozilla: DOM level 2
                objplayer.addEventListener(event, handler, false);
            }
        }
    };

    /*
    *@获取播放器名称函数（MediaPlayer播放）
    *@param name：播放对象名称
    */
    function getVLC(name) {
        if (window.document[name]) {
            return window.document[name];
        }
        if (navigator.appName.indexOf("Microsoft Internet") == -1) {
            if (document.embeds && document.embeds[name])
                return document.embeds[name];
        }
        else {
            return document.getElementById(name);
        }
    };

    //播发器播放
    //@param path:播放路径
    function OnPlay(path, p_sPlayerID, p_nPlayerType) {
        switch (p_nPlayerType) {
            case 0:
                if ($('object[ObjFlag="WMP_OcxPlayer"]')[0] != null) {
                    $('object[ObjFlag="WMP_OcxPlayer"]')[0].controls.stop();
                }
                if ($('#' + p_sPlayerID)[0] != null) {
                    $('#' + p_sPlayerID)[0].URL = path;
                    $('#' + p_sPlayerID)[0].controls.play();
                    $('#' + p_sPlayerID)[0].uiMode = 'None';

                    $('#' + p_sPlayerID).height = 0;
                    $('#' + p_sPlayerID).width = 0;
                    $('#' + p_sPlayerID).css({ 'width': '0px', 'height': '0px' });
                }
                break;
            case 1:
                $.jPlayer.pause(); // Pause all instances of jPlayer on the page
                $('#' + p_sPlayerID).jPlayer('play');
                break;
            case 2:
                //停止所有播放器
                $('object[ObjFlag="VLC_OcxPlayer"]')[0].OnStop();
                var vod = $('#' + p_sPlayerID)[0];
                if (vod != null) vod.OnPlay(path);
                break;
            default:
                break;
        }
    };
    /*播放器播放/暂停
    *param p_bPlayFlag:播放或暂停标识：true-暂停；false-播放*/
    function OnPause(p_bPlayFlag, p_sPlayerID, p_nPlayerType) {
        switch (p_nPlayerType) {
            case 0:
                if ($('#' + p_sPlayerID)[0] != null) {
                    if (p_bPlayFlag == true) {
                        $('#' + p_sPlayerID)[0].controls.pause();
                    }
                    else {
                        $('#' + p_sPlayerID)[0].controls.play();
                    }
                }
                break;
            case 1:
                if (p_bPlayFlag == true) {
                    $('#' + p_sPlayerID).jPlayer('pause');
                }
                else {
                    $('#' + p_sPlayerID).jPlayer('play');
                }
                break;
            case 2:
                var vod = $('#' + p_sPlayerID)[0];

                if (vod != null) {
                    if (p_bPlayFlag == true) {
                        vod.OnPause();
                    }
                    else {
                        vod.OnPause();
                    }
                }
                break;
            default:
                break;
        }
    };
    //播放器停止
    function OnStop(p_sPlayerID, p_nPlayerType) {
        switch (p_nPlayerType) {
            case 0:
                if ($('#' + p_sPlayerID)[0] != null) {
                    $('#' + p_sPlayerID)[0].controls.stop();
                }
                break;
            case 1:
                $('#' + p_sPlayerID).jPlayer("pauseOthers", 0); // stop all players except this one.			   			    			    
                $.jPlayer.pause(); // Pause all instances of jPlayer on the page
                $('#' + p_sPlayerID).jPlayer('stop');
                break;
            case 2:
                var vod = document.getElementById(p_sPlayerID);
                if (vod != null) vod.OnStop();
                break;
            default:
                break;
        }
    };

    function parseTime(numLength) {
        //numLength = numLength / 1000;
        var h_time = 0;
        var m_time = 0;
        var s_time = 0;
        if (numLength >= 60) {
            m_time = parseInt(numLength / 60);
            s_time = parseInt(numLength % 60);
        }
        else {
            s_time = parseInt(numLength);
        }
        if (m_time >= 60) {
            h_time = parseInt(m_time / 60);
            m_time = parseInt(m_time % 60);
        }

        if (h_time < 10) {
            h_time = "0" + h_time;
        }
        if (m_time < 10) {
            m_time = "0" + m_time;
        }
        if (s_time < 10) {
            s_time = "0" + s_time;
        }
        if (isNaN(s_time))
            s_time = "00";
        if (isNaN(m_time))
            s_time = "00";
        if (isNaN(h_time))
            s_time = "00";
        return h_time + ":" + m_time + ":" + s_time;
    };

    //设置播放位置
    //@param p_nPos:播放位置
    function SetPlayPosition(p_nPos, p_sPlayerID) {
        try {
            if (p_nPos >= 0 && p_nPos <= 100) {
                // Move play-head to p_nPos.
                $('#' + p_sPlayerID).jPlayer("playHead", p_nPos);

                var l_objWMP = $('#' + p_sPlayerID).get(0);
                if (typeof l_objWMP.controls != 'undefined' && l_objWMP.controls != null) {
                    if (typeof l_objWMP.currentMedia != 'undefined' && l_objWMP.currentMedia != null) {
                        l_objWMP.controls.currentPosition = p_nPos / 100 * l_objWMP.currentMedia.duration;
                    }
                }
            }
        }
        catch (e) {
            alert(e);
        }
    };
    //设置播放器音量大小
    //@param p_nPos:音量大小
    function SetPlayVolume(p_nPos, p_sPlayerID) {
        //return;

        //var vod = document.getElementById(p_sPlayerID);
        //if (vod != null && p_nPos >= 0) vod.SetVolume(p_nPos);
        p_nPos = p_nPos / 100;
        $('#' + p_sPlayerID).jPlayer("volume", p_nPos);
    };
    /* 判断浏览器是否支持ActiveX控件及控件是否安装 */
    function _IsActiveXInstall(p_sActiveName, p_sPromptMessage) {
        //判断浏览器是否支持ActiveX控件
        if (window.ActiveXObject) {
            var l_objActive = null;

            //判断控件是否安装
            try {
                l_objActive = new ActiveXObject(p_sActiveName);
                if (typeof (l_objActive) != 'undefined') {
                    l_objActive = null;
                    return true;
                }
            }
            catch (e) {
                _Alert(p_sPromptMessage);
                return false;
            }
        }
        else {  //浏览器不支持ActiveX控件
            _Alert('浏览器不支持ActiveX控件！');
            return false;
        }
    };
    /* 消息提示框 */
    function _Alert(p_sMessage) {
        /*if (typeof layer != 'undefined') {
        layer.alert(p_sMessage);
        }
        else {
        alert(p_sMessage);
        }*/

        try {
            //$(document.body).css({ "position": "fixed" });
            $.LgKyPopup('alert', { sMsg: p_sMessage });
        }
        catch (e) {
            alert(p_sMessage);
        }
    };
    /*Begin解析xml文件*/
    /*声文同步文件xml数据解析函数
    //@param FilePath xml文件的路径
    //@param p_sItemsIndex:题目的题号
    //return 解析出的json对象*/
    function XMLHelper(FilePath, p_sItemsIndex) {
        var xmldoc = loadXML(FilePath);
        l_nodes_Etext = selectNodes(xmldoc, "/resource/sentence/subsentence/Etext"),    //句子内容
            l_nodes_starttime = selectNodes(xmldoc, "/resource/sentence/subsentence/starttime"),    //句子对应音频的起始时间
            l_nodes_timelength = selectNodes(xmldoc, "/resource/sentence/subsentence/timelength"),  //句子对应音频的时长
            l_nodes_subsentencetype = selectNodes(xmldoc, "/resource/sentence/subsentence/subsentencetype"),    //句子的类型（0-非同步，1-同步）    
            l_StartTime = new Array(),  //从xml文件中解析出的时间起点数组
            l_TimeLength = new Array(), //从xml文件中解析出的时间长度数组
            l_StrTemp = '', //解析出的文本临时存储变量
            l_SentenceArr = new Array(),
            l_sStr = "",
            l_nSenIndex = 0;

        //var l_SubSenType = new Array();
        //var res = { StrTemp: l_StrTemp, StartTime: l_StartTime, TimeLength: l_TimeLength }; //, SentenceArr: l_SentenceArr, SubSenType: l_SubSenType

        for (var i = 0; i < l_nodes_Etext.length; i++) {
            //解析每句的文本
            if (l_nodes_subsentencetype[i].childNodes[0] != null) {
                if (0 == parseInt(l_nodes_subsentencetype[i].childNodes[0].nodeValue)) {    //跳过非同步句子的解析
                    continue;
                }
                else {
                    //解析所有句子内容
                    if (l_nodes_Etext[i].childNodes[0] != null) {
                        l_sStr = l_nodes_Etext[i].childNodes[0].nodeValue; //.toString().trim().replace("/n")
                        l_StrTemp += '<p id="s_' + p_sItemsIndex + '_' + l_nSenIndex + '">' + l_sStr + '</p>';
                        //l_SentenceArr[l_nSenIndex] = l_sStr;
                    }
                    //解析每句时间起点
                    if (l_nodes_starttime[i].childNodes[0] != null) {
                        l_StartTime[l_nSenIndex] = l_nodes_starttime[i].childNodes[0].nodeValue;
                    }
                    //解析每句的时间长度
                    if (l_nodes_timelength[i].childNodes[0] != null) {
                        l_TimeLength[l_nSenIndex] = l_nodes_timelength[i].childNodes[0].nodeValue;
                    }
                    l_nSenIndex++;
                }
            }
        }

        return { StrTemp: l_StrTemp, StartTime: l_StartTime, TimeLength: l_TimeLength };
    };
    //加载xml文件
    //@param xmlFileName xml文件名
    function loadXML(xmlFileName) {
        var xmlDoc = null;
        if (window.ActiveXObject) { // IE
            var activeXNameList = new Array("MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0",
	        "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument",
	        "Microsoft.XMLDOM", "MSXML.DOMDocument");
            for (var h = 0; h < activeXNameList.length; h++) {
                try {
                    xmlDoc = new ActiveXObject(activeXNameList[h]);
                }
                catch (e) {
                    continue;
                }
                if (xmlDoc) break;
            }
        }
        else if (document.implementation && document.implementation.createDocument) { //非 IE
            xmlDoc = document.implementation.createDocument("", "", null);
        }
        else {
            console.log('can not create XML DOM object, update your browser please...');
        }
        if (xmlDoc != null) {
            //同步,防止后面程序处理时遇到文件还没加载完成出现的错误,故同步等XML文件加载完再做后面处理
            xmlDoc.async = false;
            xmlDoc.load(xmlFileName); //加载XML
        }
        return xmlDoc;
    };
    //根据指定的XPATH表达式查找满足条件的所有节点
    //@param xmldoc 执行查找的节点
    //@param sXpath xpath的表达式
    function selectNodes(xmldoc, sXpath) {
        if (window.ActiveXObject) {
            //IE浏览器
            return xmldoc.selectNodes(sXpath);
        } else if (window.XPathEvaluator) {
            //FireFox类浏览器       
            var xpathObj = new XPathEvaluator();
            if (xpathObj) {
                var result = xpathObj.evaluate(sXpath, xmldoc, null, XPathResult.ORDERED_NODE_ITEARTOR_TYPE, null);
                var nodes = new Array();
                var node;
                while ((node = result.iterateNext()) != null) {
                    nodes.push(node);
                }
                return nodes;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
    /*End解析xml文件*/

    //插件的定义，主函数
    $.fn.LgKyMediaPlayer = function (options) {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            //将arguments（函数内置对象，类数组对象）转换为数组对象
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof (method) == 'object' || !method) {
            //没有传入公用方法名时，默认进行初始化处理
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.LgKyMediaPlayer');
            return this;
        }
        return method.apply(this, arguments);
    };

    //插件的默认设置
    $.fn.LgKyMediaPlayer.defaults = default_options;

})(jQuery);