var l_nSenintervalNormal;
var lastPlayIndex = '';

(function ($) {

    $.fn.extend({

        "MPlayer": function (options) {
            options.IsDisPlayPlay = true;
            options.bVLCPlay = false;
            options.bIsVideo = false;
            options.IsShengWenTongBu = false;


            var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
            var flagState = 0;
            var itemId = 0;//播放序列号
            var g_PlayContinue = false;
            var g_totaltimeNew;
            var sShowTxt = "显示";
            var sHideTxt = "隐藏";
            var bVLCPlay = opts.bVLCPlay;
            var nCurZiMuIndex = 0;
            var l_bISDisplayZiMu = opts.bISPYFlag;
            var PYYuanYinPlayFlag = false;
            var PYAnsPlayFlag = false;
            var MediaType = opts.PlayPath.substring(opts.PlayPath.lastIndexOf('.') + 1, opts.PlayPath.length).toLowerCase();
            var UrlError = false;
            var g_bIsPrgsWrapperMouseDown = false;
            var currentPlayTime = 0;                           //默认情况下，播放时间为0
            var totalPlayTime = 0;                             //默认情况下，播放总时间为0
            var slidePostion = 0;                              //默认情况下，滑块的位置为0

            l_bISDisplayZiMu = false;

            //动态加载音频播放器样式
            InitMediaPlayHTML();

            //初始化音频播放器
            InitAudioPlayer();

            if (opts.Txt == "显示原文") {
                sShowTxt = sShowTxt + "原文";
                sHideTxt = sHideTxt + "原文";
            }
            else {
                sShowTxt = sShowTxt + "语音识别";
                sHideTxt = sHideTxt + "语音识别";
            }
            var showPYPlayButtonString = "";
            var showNormalPlayButtonString = "";
            var showPYYYConverButtonString = "";
            if (opts.bISPYFlag == false) {
                showPYPlayButtonString = " display:none;";
                showNormalPlayButtonString = " display:block;";
                showPYYYConverButtonString = " display:none;";
            }
            else {
                showPYPlayButtonString = " display:block;";
                showNormalPlayButtonString = " display:none;";
                showPYYYConverButtonString = " display:block;";
            }

            var OFFONString = '<div class="cls_ShowButtonNew" id="id_ShowButtonNew_' + opts.FootDiv + '"><div title="' + sHideTxt + '" class="cls_OFF" id="id_ButtonOFF' + opts.FootDiv + '"></div><div title="' + sShowTxt + '" class="cls_ON" id="id_ButtonON' + opts.FootDiv + '"></div></div>';
            if (opts.bISPOPPYDisPlay == true) {
                sShowTxt = "显示视频";
                sHideTxt = "隐藏视频";
                OFFONString = '<div class="cls_ShowButtonNewNO" id="id_ShowButtonNew_' + opts.FootDiv + '"><div style="display:none;" title="' + sHideTxt + '" class="cls_OFF" id="id_ButtonOFF' + opts.FootDiv + '"></div><div style="display:block;" title="' + sShowTxt + '" class="cls_ON" id="id_ButtonON' + opts.FootDiv + '"></div></div>';
                showPYYYConverButtonString = " display:none;";
            }


            var AddDiv = "<div class=\"bot-panel\" id=\"botpanel\">" +
                            '<div class=\"ctl-btn\" id="id_ctl-btn' + opts.FootDiv + '">' +
                                //"<img src=\"Plug-in/MPlayer/OraPlay.png\" class=\"wg-buttonOraPlay\" id=\"wgbuttonOraPlay" + opts.FootDiv + "\"/>" +
                                //"<img src=\"Plug-in/MPlayer/RecPlay.png\" class=\"wg-buttonRecPlay\" id=\"wgbuttonRecPlay" + opts.FootDiv + "\"/>" +
                                //"<img src=\"Plug-in/MPlayer/TryLis1.png\" class=\"wg-buttonTryLisPlay\" id=\"wgbuttonTryLisPlay" + opts.FootDiv + "\"/>" +
                                "<img style=\"" + showPYPlayButtonString + "\" src=\"" + opts.sImagePath + "aud/zh/myplayer/play-1.png\" class=\"wg-buttonBeginPlay\" id=\"wgbuttonPlay_PYANS" + opts.FootDiv + "\"/>" +
                                "<img style=\"" + showNormalPlayButtonString + "\" src=\"" + opts.sImagePath + "aud/zh/myplayer/play-1.png\" class=\"wg-buttonBeginPlay\" id=\"wgbuttonPlay" + opts.FootDiv + "\"/>" +
                                //"<img src=\"Plug-in/MPlayer/play2.png\" class=\"wg-buttonBeginAnswer\" id=\"wgbuttonAnswer" + opts.FootDiv + "\"/>" +
                                //"<img src=\"Plug-in/MPlayer/play3.png\" class=\"wg-buttonBeginRec\" id=\"wgbuttonRec" + opts.FootDiv + "\"/>" +
                                "<img title=\"停止\" src=\"" + opts.sImagePath + "aud/zh/myplayer/stop-1.png\" class=\"wg-buttonEnd\" id=\"wgbuttonEnd" + opts.FootDiv + "\"/>" +
                                "<div class=\"top-panel\" id=\"toppanel\">" +
                                "<div class=\"paneM\">" +
                                        "<div class=\"progress-wrapper\" id=\"id_progress-wrapper" + opts.FootDiv + "\">" +
                                            "<div class=\"ui-slider-range\" id=\"id_ui-slider-range" + opts.FootDiv + "\"></div>" +
                                            "<div class=\"ui-slider-progressbarWeb\" id=\"id_ui-slider-progressbar" + opts.FootDiv + "\"></div>" +
                                            "<div class=\"slider-wrapper\" id=\"id_slider-wrapper" + opts.FootDiv + "\"></div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                                '<span class="cls_showProText" id="id_showProText' + opts.FootDiv + '">00:00:00 / 00:00:00</span>' +
                                //"<div class=\"pane-recoder\" id=\"id_pane-recoder" + opts.FootDiv + "\">" +
                                    "<div class=\"volume\" id=\"id_volume" + opts.FootDiv + "\">" +
                                        "<div title=\"静音\" class=\"mute\" id=\"id_mute" + opts.FootDiv + "\"></div>" +
                                        "<div class=\"vol-slider-wrapper\" id=\"id_vol-slider-wrapper" + opts.FootDiv + "\">" +
                                            "<div class=\"vol-slider\" id=\"id_vol-slider" + opts.FootDiv + "\">" +
                                                "<div class=\"ui-slider-range\" id=\"id_ui-slider-range-vol" + opts.FootDiv + "\"></div>" +
                                                "<div class=\"ui-slider-handle\" id=\"id_ui-slider-handle-vol" + opts.FootDiv + "\"></div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                //"</div>"+
                                '<input type="hidden" id="id_MplayerStateHiddenFlagNew' + opts.FootDiv + '" value="0" />' +//hidden标签  (11, 12, 13 :TTS 未播放、正在播放、暂停中) (21, 22, 23 :银屏播放 未播放、正在播放、暂停中); (31, 32, 33:视频播放 未播放、正在播放、暂停中)
                                '<input type="hidden" id="id_SentenceIndex_' + opts.FootDiv + '" value="0" />' + //TTS朗读时的当前朗读句子的序号
                            "</div>" +
                            '<div class="ctl-YuanWenbtn" id="id_ShowYuanWenbtn' + opts.FootDiv + '">' +
                                //'<div class="cls_ShowButtonNew" id="id_ShowButtonNew_' + opts.FootDiv + '"><div title="' + sHideTxt + '" class="cls_OFF" id="id_ButtonOFF' + opts.FootDiv + '"></div><div title="' + sShowTxt + '" class="cls_ON" id="id_ButtonON' + opts.FootDiv + '"></div></div>' +
                                OFFONString +
                            '</div>' +
                            '<div class="ctl-YuanWenbtn" style="margin-top:10px;width:42%;' + showPYYYConverButtonString + '" id="id_ShoPyPlaybtn' + opts.FootDiv + '">' +
                                '<div style="float:right;margin-right:20px;"><span class="cls_PyPlayTypeFont">播放方式：</span><div class="cls_PYButtonBackground"><a class="cls_YYPYButtonSelected" id="id_YYPYMode' + opts.FootDiv + '"><span>视频+配音</span></a><a id="id_YYMode' + opts.FootDiv + '" class="cls_YYButtonUnSelected"><span>源视频</span></a><div></div>' +
            '</div>' +
            /*'<div class="ctl-PingCeFangShi" id="id_PingCeFangShi' + opts.FootDiv + '">' +
                '<span class="cls_PingCeFangShiSellectFont" id="id_PingCeFangShiSellectFont' + opts.FootDiv + '">' + '' + '</span>' +
                '<input type="checkbox" name="name_PingCeFangShiSellect' + opts.FootDiv + '" id="id_PingCeFangShiSellect' + opts.FootDiv + '" class="cls_PingCeFangShiSellect" />' +
            '</div>' +*/
        "</div>";
            $(AddDiv).appendTo("#"+opts.sJplayerDocument);

            //var volume = ";
            //$(volume).appendTo('#botpanel');

            if (opts.IsDisPlayYuanWen == false) {
                $("#id_ShowYuanWenbtn" + opts.FootDiv).hide();
            }
            else {
                //$(opts.ShowOrHideTarget).hide();
            }
            $("#id_SentenceIndex_" + opts.FootDiv).val(0);
            /*------------播放器状态初始化BEGIAN-------------*/
            if (opts.IsTTS == true) //TTS发音
                $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(11);
            else if (opts.bIsVideo == true)//视频
                $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
            else//音频
                $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(21);
            /*------------播放器状态初始化END-------------*/
            //动态加载音频播放器样式
            function InitMediaPlayHTML() {
                var mediaPlayStr = "<div id=" + "\"" + opts.sJplayerID.replace("#","") + "\"" + "style=\"width:0px;height:0px;\"></div>" +
                                    "<div id=" + "\"" + opts.sJplayerDocument + "\"" + "class=\"active_PlayControl\" style=\"margin-top:20px;margin-bottom:10px;margin-left:20px;\"></div>";

                $(mediaPlayStr).appendTo(opts.AppendId);
            };

            //初始化音频播放器
            function InitAudioPlayer() {
                var PlayPath = opts.PlayPath;
                var sContentFileType = PlayPath.substring(PlayPath.lastIndexOf('.') + 1, PlayPath.length).toLowerCase();
                var media;

                var solutionType = "html,flash";

                if (sContentFileType == 'wav' || (sContentFileType == 'aac')) {//wav格式
                    PlayPath = PlayPath.substring(0, PlayPath.length - 3) + 'wav';
                    media = {
                        wav: PlayPath
                    }
                }
                else if (sContentFileType == 'mp3') {//mp3格式
                    if (isIEOrEdge()) {
                        solutionType = "flash,html";
                    }

                    media = {
                        mp3: PlayPath
                    }
                }
                else if (sContentFileType == 'm4a') {//m4a格式
                    media = {
                        m4a: PlayPath
                    }
                }
                else {//其它格式
                }

                $(opts.sJplayerID).jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", media);
                    },
                    swfPath: opts.sImagePath + "ComCtrl/Plug-in/jPlayer-2.9.2/dist/jplayer",
                    solution: solutionType,
                    supplied: "wav,mp3,m4a",
                    size: {
                        width: "0px",
                        height: "0px"
                    },
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true,
                    remainingDuration: true,
                    toggleDuration: true,
                    loop: false
                });
                $(opts.sJplayerID).jPlayer("setMedia", media);
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

            function initPlayUrl(mrl, volume) {
                //                 var vlc = getVLC(opts.PlayerName);
                //设置音量
                //		         itemId=vlc.playlist.add(mrl);
                //		         vlc.audio.volume = volume;
            }
            //获取音视频文件总时长 相关函数
            //            function GetVedioTotalLenth()
            //		    {
            //			    var vlc = getVLC(opts.PlayerName); 
            //			    if(vlc == null || vlc.input == null)
            //			        return;
            //			    if(vlc.input.state>2 && vlc.input.state<5) //state说明：3-playing 4-paused，即播放或暂停时均可获取总时长
            //			    {
            //				    // vlc.input.time 当前播放时长，单位毫秒
            //				    // vlc.input.length 音视频总时长，单位毫秒
            //				    var videoLenth = parseInt(vlc.input.length);
            //				    // 将时间转换为（HH：mm：ss）格式
            //				    return videoLenth;
            //			    }
            //		    }
            //获取vlc
            function parseTime(numLength) {
                numLength = numLength / 1000;
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
            }

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
            }

            //播放
            function doPlay() {
                if (isIEOrEdge() && MediaType == 'wav') {//IE
                    var vlc = getVLC(opts.PlayerName);
                    vlc.playlist.clear();
                    var vlcItem = vlc.playlist.add(opts.PlayPath)
                    vlc.playlist.playItem(vlcItem);
                    $(opts.sJplayerID).jPlayer("play");
                    jdtPlay();//进度条相关
                }
                else {//非VLC
                    PauseLastPalyer(opts.nIndex);
                    if (UrlError) {
                        self_extern_layer.loadingClose("音频处理中，请稍后！", 0, 1500, null, function () {
                            $("#wgbuttonEnd" + opts.FootDiv).trigger("click");
                        });
                        return;
                    }
                    if (MediaType == 'wav') {
                        $(opts.sJplayerID).jPlayer("setMedia", { wav: opts.PlayPath });
                    }
                    else if (MediaType == 'flv') {
                        $(opts.sJplayerID).jPlayer("setMedia", { flv: opts.PlayPath });
                    }
                    else if (MediaType == 'mp3') {
                        $(opts.sJplayerID).jPlayer("setMedia", { mp3: opts.PlayPath });
                    }
                    //                    else if(MediaType == 'mp4'){
                    //                        //$(opts.sJplayerID).jPlayer("setMedia",);
                    //                        //$(opts.sJplayerID).jPlayer( "clearMedia" );
                    //                        $(opts.sJplayerID).jPlayer("setMedia",{m4v:opts.PlayPath});
                    //                    }
                    //$(opts.sJplayerID).jPlayer("play", 0);
                    $(opts.sJplayerID).jPlayer("play");
                }
            }

            //播放(配音题：原音作答录音同时播放)
            function doPlayPY() {
                if (MediaType == 'wav') {
                    $(opts.sJplayerID).jPlayer("setMedia", { wav: opts.sBgVoicePath });
                }
                else if (MediaType == 'flv') {
                    $(opts.sJplayerID).jPlayer("setMedia", { flv: opts.sBgVoicePath });
                }
                else if (MediaType == 'mp3') {
                    $(opts.sJplayerID).jPlayer("setMedia", { mp3: opts.sBgVoicePath });
                }
                //                else if(MediaType == 'mp4'){
                //                    //$(opts.sJplayerID).jPlayer("setMedia",{m4v:opts.sBgVoicePath});
                //                    $(opts.sJplayerID).jPlayer("setMedia",{m4v:opts.sBgVoicePath});
                //                }
                $(opts.sJPlayerID_BGVoice).jPlayer("play");
                if (isIEOrEdge()) {//VLC
                    var vlc = getVLC(opts.PlayerName);
                    // //vlc.OnPlay(encodeURI(opts.PlayPath));
                    // vlc.URL = encodeURI(opts.sStuAnswerPath);
                    // vlc.playlist.play();
                    // vlc.settings.volume = opts.Volume;

                    //var vlc = document.getElementById("vlc");
                    //vlc.playlist.clear();
                    vlc.playlist.clear();
                    var vlcItem = vlc.playlist.add(opts.PlayPath)
                    vlc.playlist.playItem(vlcItem);
                    jdtPlay();//进度条相关
                }
                else {//非VLC
                    $(opts.sJplayerID_AnsRec).jPlayer("play", 0);
                    if (UrlError) {
                        self_extern_layer.loadingClose("音频处理中，请稍后！", 0, 1500, null, function () {
                            $("#wgbuttonEnd" + opts.FootDiv).trigger("click");
                        });
                        return;
                    }
                    //$(opts.sJplayerID).jPlayer("play");
                }
            }

            //暂停
            function doPause(volume) {
                if (isIEOrEdge() == true && MediaType == 'wav') {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.pause();
                    //var vlc = document.getElementById("vlc");
                    vlc.playlist.togglePause();
                    $(opts.sJplayerID).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJplayerID).jPlayer("play");
                    }
                    jdtPause();//进度条相关
                }
                else {//非IE
                    $(opts.sJplayerID).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJplayerID).jPlayer("play");
                    }
                }
            }
            //暂停(配音题：原音作答录音同时暂停)
            function doPausePY(volume) {
                if (isIEOrEdge()) {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.pause();
                    //var vlc = document.getElementById("vlc");
                    vlc.playlist.togglePause();

                    $(opts.sJPlayerID_BGVoice).jPlayer("pause");
                    $(opts.sJplayerID_AnsRec).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJPlayerID_BGVoice).jPlayer("play");
                    }
                    jdtPause();//进度条相关
                }
                else {//非IE
                    $(opts.sJPlayerID_BGVoice).jPlayer("pause");
                    $(opts.sJplayerID_AnsRec).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJPlayerID_BGVoice).jPlayer("play");
                        $(opts.sJplayerID_AnsRec).jPlayer("play");
                    }
                }
            }
            //暂停->播放
            function doPause_Play(volume) {
                if (isIEOrEdge() == true && MediaType == 'wav') {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.play();
                    //var vlc = document.getElementById("vlc");
                    vlc.playlist.play();
                    PauseLastPalyer(opts.nIndex);
                    $(opts.sJplayerID).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJplayerID).jPlayer("play");
                    }
                    jdtPlay();//进度条相关
                }
                else {//非IE
                    PauseLastPalyer(opts.nIndex);
                    $(opts.sJplayerID).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJplayerID).jPlayer("play");
                    }
                }
            }

            //暂停->播放(配音题：原音作答录音同时暂停->播放)
            function doPause_PlayPY(volume) {
                if (isIEOrEdge()) {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.play();
                    //var vlc = document.getElementById("vlc");
                    vlc.playlist.play();

                    $(opts.sJPlayerID_BGVoice).jPlayer("pause");
                    $(opts.sJplayerID_AnsRec).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJPlayerID_BGVoice).jPlayer("play");
                    }
                    jdtPlay();//进度条相关
                }
                else {//非IE
                    $(opts.sJPlayerID_BGVoice).jPlayer("pause");
                    $(opts.sJplayerID_AnsRec).jPlayer("pause");
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(opts.sJPlayerID_BGVoice).jPlayer("play");
                        $(opts.sJplayerID_AnsRec).jPlayer("play");
                    }
                }
            }

            //结束
            function doStop() {
                if (isIEOrEdge() == true && MediaType == 'wav') {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.stop();
                    //var vlc = document.getElementById("vlc");
                    vlc.playlist.stop();//手动重置播放
                    $(opts.sJplayerID).jPlayer("stop");
                    jdtStop();//进度条相关
                }
                else {//非IE
                    $(opts.sJplayerID).jPlayer("stop");
                }
                if (opts.TarZimuDiv != '') {
                    $("#" + opts.TarZimuDiv + " span").html("");
                }
            }

            //结束(配音题：原音作答录音同时结束)
            function doStopPY() {
                if (isIEOrEdge() == true) {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // vlc.playlist.stop();
                    vlc.playlist.stop();//手动重置播放
                    $(opts.sJplayerID).jPlayer("stop");
                    jdtStop();//进度条相关
                }
                else {//非IE
                    $(opts.sJPlayerID_BGVoice).jPlayer("stop");
                    $(opts.sJplayerID_AnsRec).jPlayer("stop");
                }
                if (opts.TarZimuDiv != '') {
                    $("#" + opts.TarZimuDiv + " span").html("");
                }
            }

            //进度跳转
            function doSetPos(l_nPos) {
                if (isIEOrEdge() && MediaType == 'wav') {//IE
                    var vlc = getVLC(opts.PlayerName);
                    var timeNow = parseFloat(g_totaltimeNew) * l_nPos / 100;
                    if (opts.IsShengWenTongBu == true) {
                        var indextemp = 0;
                        while (timeNow > opts.startTime[indextemp]) {
                            indextemp = indextemp + 1;
                        }
                        $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({ "color": "#636363" });
                        startIndex = indextemp - 1;
                        startIndex = startIndex < 0 ? 0 : startIndex;
                    }
                    for (var i = 0; i < opts.StartTimeArr.length; i++) {
                        if (timeNow < opts.EndTimeArr[i]) {
                            break;
                        }
                        nCurZiMuIndex = i;
                    }
                    vlc.input.time = vlc.input.length * l_nPos/100 //l_nPos为百分比最大是100；
                    $(opts.sJplayerID).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                    //vlc.input.time = l_nPos// 从 l_nPos% 处播放
                }
                else {//非IE
                    var timeNow = parseFloat(g_totaltimeNew) * l_nPos / 100;
                    if (opts.IsShengWenTongBu == true) {
                        var indextemp = 0;
                        while (timeNow > opts.startTime[indextemp]) {
                            indextemp = indextemp + 1;
                        }
                        $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({ "color": "#636363" });
                        startIndex = indextemp - 1;
                        startIndex = startIndex < 0 ? 0 : startIndex;
                    }
                    for (var i = 0; i < opts.StartTimeArr.length; i++) {
                        if (timeNow < opts.EndTimeArr[i]) {
                            break;
                        }
                        nCurZiMuIndex = i;
                    }
                    //alert(g_totaltimeNew)
                    $(opts.sJplayerID).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                }
            }

            //进度跳转(配音题：原音作答录音同时进度跳转)
            function doSetPosPY(l_nPos) {
                return;
                if (isIEOrEdge()) {//IE
                    var vlc = getVLC(opts.PlayerName);
                    // var totaltime = obj.currentMedia.duration;
                    //var vlc = document.getElementById("vlc");
                    var timeNow = parseFloat(g_totaltimeNew) * l_nPos / 100;
                    if (opts.IsShengWenTongBu == true) {
                        var indextemp = 0;
                        while (timeNow > opts.startTime[indextemp]) {
                            indextemp = indextemp + 1;
                        }
                        $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({ "color": "#636363" });
                        startIndex = indextemp - 1;
                        startIndex = startIndex < 0 ? 0 : startIndex;
                    }
                    for (var i = 0; i < opts.StartTimeArr.length; i++) {
                        if (timeNow < opts.EndTimeArr[i]) {
                            break;
                        }
                        nCurZiMuIndex = i;
                    }
                    vlc.input.time = vlc.input.length * l_nPos/100 //l_nPos为百分比最大是100；
                    $(opts.sJPlayerID_BGVoice).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                    $(opts.sJplayerID_AnsRec).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                }
                else {//非IE
                    var timeNow = parseFloat(g_totaltimeNew) * l_nPos / 100;
                    for (var i = 0; i < opts.StartTimeArr.length; i++) {
                        if (timeNow < opts.EndTimeArr[i]) {
                            break;
                        }
                        nCurZiMuIndex = i;
                    }
                    $(opts.sJPlayerID_BGVoice).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                    $(opts.sJplayerID_AnsRec).jPlayer("playHead", l_nPos);// 从 l_nPos% 处播放
                }

            }

            //功能：设置播放进度
            function setPlayProgress(playProgress) {
                if (isIEOrEdge() == true && MediaType == 'wav') {
                    var obj = getVLC(opts.PlayerName);
                    obj.input.time = obj.input.length * playProgress / 100 //当前播放进度设置
                    var currentTime = parseFloat(totalPlayTime) * playProgress / 100;
                    $(opts.PlayId).jPlayer("playHead", currentTime);// 从 playProgress% 处播放
                } else {
                    //获取当前的播放时间
                    var currentTime = parseFloat(totalPlayTime) * playProgress / 100;
                    $(opts.PlayId).jPlayer("playHead", currentTime);// 从 playProgress% 处播放
                }
            }

            // if (bVLCPlay == true) {
            //     if (opts.bISPYFlag == false) {
                    
                    //var obj = document.getElementById("vlc");
                    //RegisterEvent(obj, 'PlayStateChange', function () {
                    function jdtStop(){
                        var obj = getVLC(opts.PlayerName);
                        if (obj.input.state == 5) {    //停止 
                            //doStop();
                            clearInterval(l_nSenintervalNormal);
                            $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                            $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
                            $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                            $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                            $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
                            for (var i = 0; i < opts.startTime.length; i++) {
                                $('#s' + opts.nIndex + '_' + i.toString()).css({ "color": "#636363" });
                            }

                            currentPlayTime = 0;
                        }
                    }
                    function jdtPause(){
                        var obj = getVLC(opts.PlayerName);
                        if (obj.input.state == 4) {   //暂停
                            clearInterval(l_nSenintervalNormal);
                        }
                    }
                    function jdtPlay(){
                        var obj = getVLC(opts.PlayerName);
                        
                        if (obj.input.state == 0 || obj.input.state == 1 || obj.input.state == 3) {   //播放
                            clearInterval(l_nSenintervalNormal);
                            l_nSenintervalNormal = setInterval(function () {
                                var newtime = obj.input.time;
                                var totaltime = obj.input.length;
                                //var vlc = getVLC(opts.PlayerName);
                                //var vlc = document.getElementById("vlc");
                                currentPlayTime = newtime;

                                if (totaltime != null && totaltime != undefined) {
                                    totaltime = parseInt(totaltime);
                                    g_totaltimeNew = totaltime;
                                    g_totaltime = totaltime;
                                    time = parseInt(newtime);
                                }

                                if (opts.IsShengWenTongBu == true) {
                                    if (time >= opts.startTime[startIndex]) {
                                        if (startIndex == 0) { $("#id_ShowItemInfoPanel" + opts.nIndex).scrollTop(0) }
                                        $('#s' + opts.nIndex + '_' + startIndex).css({ "color": "red" });
                                        if (startIndex > 0) {
                                            $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({ "color": "#636363" });
                                        }
                                        var top1 = $('#s' + opts.nIndex + '_' + startIndex).position().top;
                                        startIndex = parseInt(startIndex) + 1;
                                        if (top1 > 100) {
                                            var realtop = top1 + $("#id_ShowItemInfoPanel" + opts.nIndex).scrollTop() - 75;

                                            $("#id_ShowItemInfoPanel" + opts.nIndex).animate({ scrollTop: +realtop + "px" }, 500);
                                        }
                                        else {
                                        }
                                    }
                                }
                                opts.g_stop = 1;
                                $("#id_showProText" + opts.FootDiv).text(parseTime(time) + ' / ' + parseTime(g_totaltimeNew));
                                var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
                                var m_x = parseInt(progresswidth * time / totaltime);
                                
                                if (!g_bIsPrgsWrapperMouseDown) {
                                    $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                                    $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                                }
                            }, 100);
                        }
                    }
                    //});
                //}
            //     else {//配音题原音录音同时播放
            //         var obj = getVLC(opts.PlayerName);
            //         //var obj = document.getElementById("vlc");
            //         RegisterEvent(obj, 'PlayStateChange', function () {
            //             if (obj.PlayState == 1) {    //停止 
            //             }
            //             else if (obj.PlayState == 2) {   //暂停
            //             }
            //             else if (obj.PlayState == 3) {   //播放
            //                 PYAnsPlayFlag = true;
            //                 if (PYYuanYinPlayFlag == false) {//配音题原音未缓存完毕
            //                     var vlc = getVLC(opts.PlayerName);
            //                     //var obj = document.getElementById("vlc");
            //                     vlc.playlist.togglePause();
            //                     //vlc.playlist.pause();
            //                 }
            //                 else {                         //配音题原音已缓存完毕
            //                     $(opts.sJPlayerID_BGVoice).jPlayer("play");
            //                 }
            //             }
            //         });
            //     }
            // }
            //            function handle_MediaPlayerStopped(){//VLC停止
            //                $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
            //                $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
            //            }

            //            $(opts.sJplayerID).jPlayer("onSoundComplete", function() {//JPlayer播放完毕
            //                
            //            });

            $(opts.sJPlayerID_BGVoice).bind($.jPlayer.event.play, function (event) {
                if (opts.bISPYFlag == true) {
                    PYYuanYinPlayFlag = true;
                    if (PYAnsPlayFlag == false) {//作答录音未缓存完毕
                        $(opts.sJPlayerID_BGVoice).jPlayer("pause");
                    }
                    else {                      //作答录音已缓存完毕
                        if (!isIEOrEdge()) {
                            $(opts.sJplayerID_AnsRec).jPlayer("play");
                        }
                        else {
                            var vlc = getVLC(opts.PlayerName);
                            //var vlc = document.getElementById("vlc");
                            //vlc.playlist.play();
                            vlc.playlist.play();
                        }
                    }
                }
            });

            $(opts.sJplayerID).bind($.jPlayer.event.error, function (event) { // Using ".myProject" namespace
                switch (event.jPlayer.error.type) {
                    case $.jPlayer.error.URL:
                        UrlError = true;
                        break;
                    case $.jPlayer.error.NO_SOLUTION:
                        // Do something
                        break;
                }
            });

            if (opts.sJplayerID_AnsRec != '') {
                $(opts.sJplayerID_AnsRec).bind($.jPlayer.event.play, function (event) {
                    PYAnsPlayFlag = true;
                    if (PYYuanYinPlayFlag == false) {
                        $(opts.sJplayerID_AnsRec).jPlayer("pause");
                    }
                    else {
                        $(opts.sJPlayerID_BGVoice).jPlayer("play");
                    }
                });
                $(opts.sJplayerID_AnsRec).bind($.jPlayer.event.ended, function (event) {
                });
                $(opts.sJplayerID_AnsRec).bind($.jPlayer.event.timeupdate, function (event) {
                });

                $(opts.sJplayerID_AnsRec).bind($.jPlayer.event.error, function (event) { // Using ".myProject" namespace
                    switch (event.jPlayer.error.type) {
                        case $.jPlayer.error.URL:
                            UrlError = true;
                            break;
                        case $.jPlayer.error.NO_SOLUTION:
                            // Do something
                            break;
                    }
                });
            }

            $(opts.sJplayerID).bind($.jPlayer.event.ended, function (event) {
                $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
                $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonPlay_PYANS" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
                $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + parseTime(g_totaltimeNew));

                if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 22) {//音频播放中
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(21);
                }
                else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {//视频播放中
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                }
                else {
                }

                for (var i = 0; i < opts.startTime.length; i++) {
                    $('#s' + opts.nIndex + '_' + i.toString()).css({ "color": "#636363" });
                }
                startIndex = 0;
                $("#" + opts.TarZimuDiv + " span").html("");
            });

            $(opts.sJPlayerID_BGVoice).bind($.jPlayer.event.ended, function (event) {
                $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
                $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonPlay_PYANS" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
                $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + parseTime(g_totaltimeNew));

                if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 22) {//音频播放中
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(21);
                }
                else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {//视频播放中
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                }
                else {
                }

                for (var i = 0; i < opts.startTime.length; i++) {
                    $(opts.tSentenceTarget + i.toString()).css({ "color": "#636363" });
                }
                startIndex = 0;
                $("#" + opts.TarZimuDiv + " span").html("");

                if (isIEOrEdge()) {//IE
                    var vlc = getVLC(opts.PlayerName);
                    //var vlc = document.getElementById("vlc");
                    //vlc.playlist.stop();
                    vlc.playlist.stop();
                    $(opts.sJplayerID_AnsRec).jPlayer("stop");
                }
                else {//非IE
                    $(opts.sJplayerID_AnsRec).jPlayer("stop");
                }
            });

            //            function handle_MediaPlayerEndReached(){//VLC播放完毕
            //                $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
            //                $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
            //                $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
            //                $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + parseTime(g_totaltimeNew));
            //                
            //                if($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 22){//音频播放中
            //                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(21);
            //                }
            //                else if($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32){//视频播放中
            //                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
            //                }
            //                else{
            //                }
            //                
            //                for(var i = 0; i< opts.startTime.length; i++){
            //                    $(opts.tSentenceTarget + i.toString()).css({"color":"#636363"});
            //                }
            //                startIndex = 0;
            //            }
            //            function handle_MediaPlayerEncounteredError(){
            //                alert("文件加载失败，请重新加载！");
            //            }
            //            function handle_MediaPlayerPositionChanged(){
            //                //alert("Position changed");
            //            }
            //事件注册
            //            function registerVLCEvent(event, handler) {
            //                //var vlc = getVLC(opts.PlayerName);
            //                  var vlc = document.getElementById("vlc");
            //                if (vlc) {
            //                    if (vlc.attachEvent) {
            //                        // Microsoft
            //                        vlc.attachEvent (event, handler);
            //                    } else if (vlc.addEventListener) {
            //                        // Mozilla: DOM level 2
            //                        vlc.addEventListener (event, handler, false);
            //                    }
            //                }
            //            }    

            //播放10毫秒
            //            registerVLCEvent("MediaPlayerTimeChanged", handle_MediaPlayerTimeChanged);//播放时间改变时
            //            registerVLCEvent("MediaPlayerStopped", handle_MediaPlayerStopped);//停止播放
            //            registerVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);//播放完成
            //            registerVLCEvent("MediaPlayerEncounteredError", handle_MediaPlayerEncounteredError);//遇到错误不能继续播放时
            //            registerVLCEvent("MediaPlayerPositionChanged", handle_MediaPlayerPositionChanged);//播放进度、位置改变时


            //            if($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31){
            //                //initPlayUrl(encodeURI(opts.PlayPath), 0);               
            //                var vlc = getVLC(opts.PlayerName);
            //                vlc.audio.mute = true; //静音
            //                vlc.audio.volume = 0;
            //                //doPlay();
            //            }

            //Jplayer进度读取
            $(opts.sJplayerID).bind($.jPlayer.event.timeupdate, function (event) {
                var totaltime = event.jPlayer.status.duration;
                var time = event.jPlayer.status.currentTime;
                totalPlayTime = totaltime;
                currentPlayTime = time;

                if (totaltime != null)
                    g_totaltimeNew = totaltime;
                if (opts.bIsVideo == true) {//视频
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31) {
                        $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + '00:00:00');
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        opts.g_stop = 1;
                        //buttonPlay = false;

                        g_totaltime = totaltime;
                        $("#id_showProText" + opts.FootDiv).text(parseTime(parseInt(time) * 1000) + ' / ' + parseTime(parseInt(g_totaltimeNew) * 1000));
                        var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
                        var m_x = parseInt((progresswidth) * event.jPlayer.status.currentPercentAbsolute / 100);
                        if (!g_bIsPrgsWrapperMouseDown) {
                            $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                            $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                        }

                        if (l_bISDisplayZiMu == false) {
                            if (time >= opts.EndTimeArr[nCurZiMuIndex]) {
                                $("#" + opts.TarZimuDiv + " span").html("");
                            }
                            if (time >= opts.StartTimeArr[nCurZiMuIndex]) {
                                $("#" + opts.TarZimuDiv + " span").html(opts.sContentArr[nCurZiMuIndex]);
                                nCurZiMuIndex = parseInt(nCurZiMuIndex) + 1;
                            }
                        }
                    }
                }
                else {
                    if (opts.IsShengWenTongBu == true) {
                        if (time >= opts.startTime[startIndex]) {
                            if (startIndex == 0) { $("#id_ShowItemInfoPanel" + opts.nIndex).scrollTop(0) }
                            $('#s' + opts.nIndex + '_' + startIndex).css({ "color": "red" });
                            if (startIndex > 0) {
                                $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({ "color": "#636363" });
                            }
                            var top1 = $('#s' + opts.nIndex + '_' + startIndex).position().top;
                            startIndex = parseInt(startIndex) + 1;
                            if (top1 > 100) {
                                var realtop = top1 + $("#id_ShowItemInfoPanel" + opts.nIndex).scrollTop() - 75;

                                $("#id_ShowItemInfoPanel" + opts.nIndex).animate({ scrollTop: +realtop + "px" }, 500);
                            }
                            else {
                            }
                        }
                    }
                    opts.g_stop = 1;
                    g_totaltime = totaltime;
                    $("#id_showProText" + opts.FootDiv).text(parseTime(parseInt(time) * 1000) + ' / ' + parseTime(parseInt(g_totaltimeNew) * 1000));
                    var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
                    var m_x = parseInt(progresswidth * event.jPlayer.status.currentPercentAbsolute / 100);
                    if (!g_bIsPrgsWrapperMouseDown) {
                        $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                        $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                    }
                }
            });

            $(opts.sJPlayerID_BGVoice).bind($.jPlayer.event.timeupdate, function (event) {
                var totaltime = event.jPlayer.status.duration;
                var time = event.jPlayer.status.currentTime;

                if (totaltime != null)
                    g_totaltimeNew = totaltime;
                if (opts.bIsVideo == true) {//视频
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31) {
                        $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + '00:00:00');
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {

                        opts.g_stop = 1;
                        //buttonPlay = false;

                        g_totaltime = totaltime;
                        $("#id_showProText" + opts.FootDiv).text(parseTime(parseInt(time) * 1000) + ' / ' + parseTime(parseInt(g_totaltimeNew) * 1000));
                        var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
                        var m_x = parseInt((progresswidth) * event.jPlayer.status.currentPercentAbsolute / 100);
                        if (!g_bIsPrgsWrapperMouseDown) {
                            $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                            $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                        }

                        if (l_bISDisplayZiMu == false) {
                            if (time >= opts.EndTimeArr[nCurZiMuIndex]) {
                                $("#" + opts.TarZimuDiv + " span").html("");
                            }
                            if (time >= opts.StartTimeArr[nCurZiMuIndex]) {
                                $("#" + opts.TarZimuDiv + " span").html(opts.sContentArr[nCurZiMuIndex]);
                                nCurZiMuIndex = parseInt(nCurZiMuIndex) + 1;
                            }
                        }
                    }
                }
                else {
                    opts.g_stop = 1;
                    g_totaltime = totaltime;
                    $("#id_showProText" + opts.FootDiv).text(parseTime(parseInt(time) * 1000) + ' / ' + parseTime(parseInt(g_totaltimeNew) * 1000));
                    var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
                    var m_x = parseInt(progresswidth * event.jPlayer.status.currentPercentAbsolute / 100);
                    if (!g_bIsPrgsWrapperMouseDown) {
                        $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                        $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                    }
                }
            });
            //            $(opts.sJplayerID).jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, time, tt) {
            //                
            //            });

            $(opts.tImgLoadingTarget).hide();
            //            function handle_MediaPlayerTimeChanged(time){
            //                var vlc = getVLC(opts.PlayerName);
            //                var totaltime = GetVedioTotalLenth();
            //                if(totaltime != null)
            //                    g_totaltimeNew = totaltime;
            //                if(opts.bIsVideo == true){//视频
            //                    if($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31){
            //                        $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + '00:00:00');
            //                        vlc.audio.mute = false; //取消静音
            //                        vlc.style.width = '100%';
            //                        vlc.style.height = opts.nVideoPlayHeight;
            //                    }
            //                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33){
            //                        vlc.audio.volume = 50;
            //                        vlc.audio.mute = false; //取消静音
            //                        vlc.style.width = '100%';
            //                        vlc.style.height = opts.nVideoPlayHeight;
            //                        
            //                        if(opts.IsShengWenTongBu == true){
            //                            if(time >= parseInt(opts.startTime[startIndex])){
            //                                $('#s' + opts.nIndex + '_' + startIndex).css({"color":"red"});
            //                                if(startIndex > 0)
            //                                    $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({"color":"#636363"});
            //                                startIndex  = parseInt(startIndex) + 1;
            //                            }
            //                        }
            //                        opts.g_stop = 1;
            //                        //buttonPlay = false;
            //                        
            //                        g_totaltime = totaltime;
            //                        $("#id_showProText" + opts.FootDiv).text(parseTime(time) + ' / ' + parseTime(g_totaltimeNew));
            //                        var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
            //                        var m_x = parseInt(progresswidth * time / totaltime);
            //                        $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
            //                        $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
            //                    }
            //                }
            //                else{
            //                    vlc.audio.volume = 50;
            //                    vlc.audio.mute = false; //取消静音
            //                    
            //                    if(opts.IsShengWenTongBu == true){
            //                        if(time >= parseInt(opts.startTime[startIndex])){
            //                            $('#s' + opts.nIndex + '_' + startIndex).css({"color":"red"});
            //                            if(startIndex > 0)
            //                                $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({"color":"#636363"});
            //                            startIndex  = parseInt(startIndex) + 1;
            //                        }
            //                    }
            //                    opts.g_stop = 1;
            //                    g_totaltime = totaltime;
            //                    
            //                    $("#id_showProText" + opts.FootDiv).text(parseTime(time) + ' / ' + parseTime(g_totaltimeNew));
            //                    var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width")) - 8;
            //                    var m_x = parseInt(progresswidth * time / totaltime);
            //                    $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
            //                    $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
            //                }
            //            }
            if (opts.NoPlay == true) {//口头表达或者纯文本的复述不需要播放功能
                $("#id_ctl-btn" + opts.FootDiv).hide();
                $("#id_progress-wrapper" + opts.FootDiv).hide();
            }
            var g_TotalTimeString = '00:00';
            if (opts.IsDisPlayPingCeFangShi == false)
                $("#id_PingCeFangShi" + opts.FootDiv).hide();
            if (opts.IsDisPlayYuanWen == false) {
                $("#id_ShowYuanWenbtn" + opts.FootDiv).hide();
            }
            else {
                //$(opts.ShowOrHideTarget).hide();
            }
            $('#id_ButtonOFF' + opts.FootDiv).click(function () {
                if (opts.bISPOPPYDisPlay == true) {
                    if (opts.bISPYFlag == false) {
                        $(opts.tListAnimateTar).animate({ "height": "300px" }, 500);
                        $(opts.tVideoAnimateTar).animate({ "height": "0px", "margin": "0px" }, 500);
                    }
                    else {
                        $(opts.tListAnimateTar).animate({ "height": "300px" }, 500);
                        $(opts.tVideoPYAnimateTar).animate({ "height": "0px", "margin": "0px" }, 500);
                    }
                }
                else {
                    $(opts.ShowOrHideTarget).slideToggle("slow");
                }
                $("#id_ShowButtonNew_" + opts.FootDiv).css({ "background": "url(" + opts.sImagePath + "aud/zh/myplayer/displayNo.png)" });
                $('#id_ButtonON' + opts.FootDiv).show();
                $('#id_ButtonOFF' + opts.FootDiv).hide();
            });
            $('#id_ButtonON' + opts.FootDiv).click(function () {
                if (opts.bISPOPPYDisPlay == true) {
                    if (opts.bISPYFlag == false) {
                        $(opts.tListAnimateTar).animate({ "height": "120px" }, 500);
                        $(opts.tVideoAnimateTar).animate({ "height": "165px", "margin": "5px" }, 500);
                    }
                    else {
                        $(opts.tListAnimateTar).animate({ "height": "120px" }, 500);
                        $(opts.tVideoPYAnimateTar).animate({ "height": "165px", "margin": "5px" }, 500);
                    }
                }
                else {
                    $(opts.ShowOrHideTarget).slideToggle("slow");
                }
                $("#id_ShowButtonNew_" + opts.FootDiv).css({ "background": "url(" + opts.sImagePath + "aud/zh/myplayer/displayYes.png)" });
                $('#id_ButtonON' + opts.FootDiv).hide();
                $('#id_ButtonOFF' + opts.FootDiv).show();
            });
            if (!opts.IsDisPlayPlay) {
                $("#wgbuttonPlay" + opts.FootDiv).css('display', 'none');
            }
            if (!opts.IsDisPlayAnswer) {
                $("#wgbuttonAnswer" + opts.FootDiv).css('display', 'none');
            }
            if (!opts.IsDisPlayRec) {
                $("#wgbuttonRec" + opts.FootDiv).css('display', 'none');
            }
            if (!opts.IsDisPlayOraPlay) {
                $("#wgbuttonOraPlay" + opts.FootDiv).css('display', 'none');
            }
            if (!opts.IsDisPlayRecPlay) {
                $("#wgbuttonRecPlay" + opts.FootDiv).css('display', 'none');
            }
            if (!opts.IsDisPlayTryLisPlay) {
                $("#wgbuttonTryLisPlay" + opts.FootDiv).css('display', 'none');
            }
            //alert(opts.bIsInitMultualWay + "," + opts.bIsMutualWayChecked + "," + opts.bIsPubEd)
            if (opts.bIsInitMultualWay == true) {
                $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, false));
            }
            if (opts.bIsMutualWayChecked == true) {
                $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, true));
                var evObj = window.document.getElementsByName('name_PingCeFangShiSellect' + opts.FootDiv);
                evObj[0].checked = true;
            }
            else {
                $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, false));
            }
            if (opts.bIsPubEd == true) {
                var evObj = window.document.getElementsByName('name_PingCeFangShiSellect' + opts.FootDiv);
                evObj[0].setAttribute('disabled', 'disabled');
                $("#id_PingCeFangShiSellectFont" + opts.FootDiv).unbind("click");
                var res = SetMutualWay(opts.sItemType, true);//显示评测方式
                $('#id_PingCeFangShiSellectFont' + opts.FootDiv).css({ "cursor": "default" });
            }
            $("#id_PingCeFangShiSellect" + opts.FootDiv).click(function () {//点击复选框
                var evObj = window.document.getElementsByName('name_PingCeFangShiSellect' + opts.FootDiv);
                if (evObj[0].checked == true) {
                    $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, true));
                }
                else {
                    $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, false));
                }
            });
            $("#id_PingCeFangShiSellectFont" + opts.FootDiv).click(function () {//点击评测方式文本
                if (opts.bIsPubEd == true || $("#id_PingCeFangShiSellectFont" + opts.FootDiv).text() == "自动评测+教师辅评") return;//屏蔽点击事件
                var evObj = window.document.getElementsByName('name_PingCeFangShiSellect' + opts.FootDiv);
                if (evObj[0].checked == true) {
                    evObj[0].checked = false;
                    $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, false));
                }
                else {
                    evObj[0].checked = true;
                    $(opts.ReceievePingCeFangShi).val(SetMutualWay(opts.sItemType, true));
                }
            });
            $('#id_ui-slider-handle-vol' + opts.FootDiv).css('left', parseInt($('#id_vol-slider' + opts.FootDiv).css('width')) * parseFloat(opts.Volume / 100));
            $('#id_ui-slider-range-vol' + opts.FootDiv).css('width', parseInt($('#id_vol-slider' + opts.FootDiv).css('width')) * parseFloat(opts.Volume / 100));

            //            $('#id_slider-wrapper' + opts.FootDiv).mouseover(function(e) {
            //                $(this).removeClass().addClass("slider-wrapperClick");
            //            });
            //            $('#id_slider-wrapper' + opts.FootDiv).mouseleave(function(e) {
            //                $(this).removeClass().addClass("slider-wrapperUnClick");
            //            });

            //拖动滑块设置进度
            $('#id_slider-wrapper' + opts.FootDiv).mousedown(function (e) {
                if (opts.IsTTS == true || opts.bISPYFlag == true) {
                    return;
                }
                opts.move = true;
                g_bIsPrgsWrapperMouseDown = true;
                opts._x = e.pageX - parseInt($(this).css('left'));
                $(this).removeClass().addClass("slider-wrapperClick");
            });

            $(document).mousemove(function (e) {
                if (opts.move) {
                    var x = e.pageX - opts._x;   //移动时根据鼠标位置计算控件左上角的绝对位置
                    slidePostion = x;
                    opts.lpos = x;
                    if (x >= 0 && x <= parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width'))) {
                        $('#id_slider-wrapper' + opts.FootDiv).css('left', x);
                        $('#id_ui-slider-range' + opts.FootDiv).css("width", x);
                    }
                }
            }).mouseup(function () {
                if (opts.move) {
                    if (opts.bISPYFlag == false) {
                        doSetPos(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100); //设置播放进度
                    }
                    else {
                        doSetPosPY(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100); //设置播放进度
                    }

                    setPlayProgress(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100);//设置播放进度

                    $("#id_slider-wrapper" + opts.FootDiv).removeClass().addClass("slider-wrapperUnClick");
                    g_bIsPrgsWrapperMouseDown = false;

                    opts.move = false;
                }
            });
            //单击进度条区域控制播放进度
            $('#id_progress-wrapper' + opts.FootDiv).click(function (e) {
                if (opts.IsTTS == true || opts.bISPYFlag == true) {
                    return;
                }
                var m_x = e.pageX - $(this).offset().left;
                slidePostion = m_x;
                opts.lpos = m_x;

                if (m_x >= 0 && m_x <= parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width'))) {
                    //计算单击进度条后当前播放的音频位置 

                    if (opts.bISPYFlag == false) {
                        doSetPos(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100); //设置播放进度
                    }
                    else {
                        doSetPosPY(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100); //设置播放进度
                    }

                    setPlayProgress(opts.lpos / parseInt($('#id_progress-wrapper' + opts.FootDiv).css('width')) * 100);//设置播放进度

                    $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
                    $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
                }

            });
            $('#id_progress-wrapper' + opts.FootDiv).mouseover(function (e) {
                if (opts.IsTTS == true || opts.bISPYFlag == true) {
                    $('#id_progress-wrapper' + opts.FootDiv).css({ "cursor": "default" });
                }
                else {
                    $('#id_progress-wrapper' + opts.FootDiv).css({ "cursor": "pointer" });
                }
            });
            $('#id_slider-wrapper' + opts.FootDiv).mouseover(function (e) {
                if (opts.IsTTS == true || opts.bISPYFlag == true) {
                    $('#id_slider-wrapper' + opts.FootDiv).css({ "cursor": "default" });
                }
                else {
                    $('#id_slider-wrapper' + opts.FootDiv).css({ "cursor": "pointer" });
                }
            });
            var v_x;
            var mvf = false;
            $('#id_ui-slider-handle-vol' + opts.FootDiv).mousedown(function (e) {
                mvf = true;
                v_x = e.pageX - parseInt($(this).css('left'));
            });
            $(document).mousemove(function (e) {
                if (mvf) {
                    var vx = e.pageX - v_x;
                    if (vx >= 0 && vx <= parseInt($('#id_vol-slider' + opts.FootDiv).css('width'))) {
                        $('#id_ui-slider-handle-vol' + opts.FootDiv).css('left', vx);
                        $('#id_ui-slider-range-vol' + opts.FootDiv).css('width', vx);
                        //设置vlc的音量
                        var vlc = getVLC(opts.PlayerName);
                        vlc.audio.volume = 100 * parseFloat(vx / parseInt($('#id_vol-slider' + opts.FootDiv).css('width')));
                        $(opts.sJplayerID).jPlayer("volume", parseFloat(opts.Volume)/100);              //设置音量大小
                        //由长度比例计算设置的音量的大小
                    }
                }
            }).mouseup(function () {
                if (mvf) {
                    mvf = false;
                }
            });

            //单击音量进度条区域设置
            $('#id_vol-slider' + opts.FootDiv).click(function (e) {
                var vlc = getVLC(opts.PlayerName);
                var offset = e.pageX - $('#id_vol-slider' + opts.FootDiv).offset().left;
                if (offset <= 0) {
                    $('#id_mute' + opts.FootDiv).css("background", "url(" + opts.sImagePath + "aud/zh/myplayer/1hQVsZPs.png) no-repeat");
                    isMute = true;
                    if(isIEOrEdge() && MediaType == 'wav'){
                         vlc.audio.volume = 0;//设置VLC为静音
                    }
                }
                else {
                    $('#id_mute' + opts.FootDiv).css('background', 'url(" + opts.sImagePath + "aud/zh/myplayer/cM2yFa1f.png) no-repeat');
                    isMute = false;
                }

                if (offset >= 0 && offset <= parseInt($('#id_vol-slider' + opts.FootDiv).css('width'))) {
                    $('#id_ui-slider-handle-vol' + opts.FootDiv).css('left', offset);
                    $('#id_ui-slider-range-vol' + opts.FootDiv).css('width', offset);
                    //设置vlc的音量
                    vlc.audio.volume = 100 * parseFloat(offset / parseInt($('#id_vol-slider' + opts.FootDiv).css('width')));
                    $(opts.sJplayerID).jPlayer("volume", parseFloat(opts.Volume) / 100);
                    //由长度比例计算设置的音量的大小
                }
            });


            //单击音量图标设置是否静音
            var isMute = false; //静音标记
            $("#id_mute" + opts.FootDiv).click(function () {
                if (!isMute) {
                    //WMP.settings.volume = 0;.volume .mute
                    isMute = true;
                    if(isIEOrEdge() && MediaType == 'wav'){
                         var vlc = getVLC(opts.PlayerName);
                         vlc.audio.volume = 0;
                        }else{
                            $(opts.sJplayerID).jPlayer("volume", 0);
                        }
                    $(this).css("background", "url(" + opts.sImagePath + "aud/zh/myplayer/1hQVsZPs.png) no-repeat");
                    $('#id_ui-slider-handle-vol' + opts.FootDiv).css('left', 0);
                    $('#id_ui-slider-range-vol' + opts.FootDiv).css('width', 0);
                }
                else {
                    //WMP.settings.volume = voltemp;
                    isMute = false;
                    if(isIEOrEdge() && MediaType == 'wav'){
                        var vlc = getVLC(opts.PlayerName);
                        vlc.audio.volume = parseFloat(opts.Volume);
                       }else{
                        $(opts.sJplayerID).jPlayer("volume", parseFloat(opts.Volume) / 100);
                       }
                    
                    $(this).css("background", "url(" + opts.sImagePath + "aud/zh/myplayer/cM2yFa1f.png) no-repeat");
                    $('#id_ui-slider-handle-vol' + opts.FootDiv).css('left', parseFloat((parseFloat(opts.Volume) / 100) * parseInt($('#id_vol-slider' + opts.FootDiv).css('width'))));
                    $('#id_ui-slider-range-vol' + opts.FootDiv).css('width', parseFloat((parseFloat(opts.Volume) / 100 )* parseInt($('#id_vol-slider' + opts.FootDiv).css('width'))));
                    //vod.SetVolume(opts.Volume);
                }
            });
            /********样式转换**************/
            $("#wgbuttonPlay" + opts.FootDiv).mouseover(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13) {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-2.png");
                        $(this).attr("title", "播放");
                    }
                    else {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-2.png");
                        $(this).attr("title", "暂停");
                    }
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-2.png");
                        $(this).attr("title", "播放");
                    }
                    else {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-2.png");
                        $(this).attr("title", "暂停");
                    }
                }
            })
            $("#wgbuttonPlay" + opts.FootDiv).mouseleave(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                }
            })
            $("#wgbuttonPlay" + opts.FootDiv).mousedown(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-3.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-3.png");
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-3.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-3.png");
                }
            })

            /***************************配音题原音录音同时播放按钮 样式转换*****************************/
            $("#wgbuttonPlay_PYANS" + opts.FootDiv).mouseover(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13) {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-2.png");
                        $(this).attr("title", "播放");
                    }
                    else {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-2.png");
                        $(this).attr("title", "暂停");
                    }
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-2.png");
                        $(this).attr("title", "播放");
                    }
                    else {
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-2.png");
                        $(this).attr("title", "暂停");
                    }
                }
            })
            $("#wgbuttonPlay_PYANS" + opts.FootDiv).mouseleave(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                }
            })
            $("#wgbuttonPlay_PYANS" + opts.FootDiv).mousedown(function () {
                if (opts.IsTTS == true) {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-3.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-3.png");
                }
                else {
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23
                                    || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33)
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-3.png");
                    else
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-3.png");
                }
            })
            /***************************配音题原音录音同时播放按钮 样式转换*****************************/

            $("#wgbuttonEnd" + opts.FootDiv).mouseover(function () {
                $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/stop-2.png");
            })
            $("#wgbuttonEnd" + opts.FootDiv).mouseleave(function () {
                $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/stop-1.png");
            })
            $("#wgbuttonEnd" + opts.FootDiv).mousedown(function () {
                $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/stop-3.png");
            })
            var TTSEndFlag = false;
            var TTSPause = false;
            var l_TTSTextArr = opts.TTSTextArr;
            var TTSTool = document.getElementById("SpeechRecAndSyn"); //语音识别合成控件
            //TTSTool._InitTextToSpeech(-1, 1);
            //l_TTSTextArr = ['Study the following dialogue, and then answer the questions below.','Study the following dialogue, and then answer the questions below.','Study the following dialogue, and then answer the questions below.','Study the following dialogue, and then answer the questions below.','Study the following dialogue, and then answer the questions below.'];
            //l_TTSTextArr = ['Study the following dialogue, and then answer the questions below.'];
            /********样式转换**************/
            //opts.tSentenceTarget = '#id_ScentenceNumber_';
            $("#wgbuttonPlay" + opts.FootDiv).click(function () {
                if (opts.FootDiv == "playPanelNew0") {
                    for (var kk = 1; kk < 201; kk++) {
                        $("#wgbuttonEndplayPanelNew" + kk.toString()).trigger("click");
                    }
                }
                else {
                    $("#wgbuttonEndplayPanelNew0").trigger("click");
                }

                var vlcTemp = getVLC('aboutplayer202');//检测播放器ID
                if (vlcTemp != null && isIEOrEdge()) {
                    vlcTemp.playlist.stop();
                }

                for (var i = 0; i < 200; i++) {
                    $("#id_stopImg_" + i).hide();
                    $("#id_plyImg_" + i).show();
                }
                $("#id_stopImg_999").hide();
                $("#id_plyImg_999").show();

                for (var k = 0 ; k < 200; k++) {//先停止其他播放器
                    var vlcTemp = getVLC('vlc0' + k);//检测播放器ID
                    var vlcCurTask = getVLC(opts.PlayerName);//当前播放器ID
                    //var vlcCurTask = document.getElementById("vlc");
                    $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    if (($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 12 || $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 13) && opts.FootDiv != ("playPanelNew" + k)) {//tts发音中
                        //TTSTool._StopSpeak();//结束tts发音
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(11);
                        break;
                    }
                    else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 22 && opts.FootDiv != ('playPanelNew' + k)) {//音频播放中
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(23);
                        if (vlcTemp != null && vlcTemp != undefined && vlcTemp != vlcCurTask && isIEOrEdge() == true) {
                            //vlcTemp.playlist.pause();//暂停
                            vlcTemp.playlist.togglePause()
                        }
                        break;
                    }
                    else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 32 && opts.FootDiv != ('playPanelNew' + k)) {//视频播放中
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(33);
                        if (vlcTemp != null && vlcTemp != undefined && vlcTemp != vlcCurTask && isIEOrEdge() == true) {
                            //vlcTemp.playlist.pause();//暂停
                            vlcTemp.playlist.togglePause()
                        }
                        break;
                    }
                    else {
                    }
                }
                //停止JPlayer播放

                $.jPlayer.pause();
                //$(opts.sJplayerID).jPlayer("pauseOthers");

                if (opts.IsTTS == true) {//tts发音
                    var index = $("#id_SentenceIndex_" + opts.FootDiv).val();

                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11) {   //第一次播放： 未播放->播放中
                        index = 0;
                        $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(12);
                        var objSetIntervalReVal = setInterval(function () {
                            if ((index == l_TTSTextArr.length && TTSTool._GetSpeakCompletedFlag() == 1) || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 11 || $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == undefined) {
                                $(opts.tSentenceTarget + (index - 1)).css({ "color": "#636363" });
                                TTSTool._StopSpeak();//结束tts发音
                                $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(11);
                                clearInterval(objSetIntervalReVal);//取消定时器
                            }

                            else if ((TTSTool._GetSpeakCompletedFlag() == 1 || index == 0) && index < l_TTSTextArr.length) {
                                if (index > 0)
                                    $(opts.tSentenceTarget + (index - 1)).css({ "color": "#636363" });
                                $(opts.tSentenceTarget + index).css({ "color": "red" });
                                TTSTool._SpeakEnglish(l_TTSTextArr[index], "", 0); //TTS
                                index = index + 1;
                                $("#id_SentenceIndex_" + opts.FootDiv).val(index)
                            }
                        }, 500);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 12) {   //播放中：播放中->暂停
                        TTSTool._PauseSpeak();
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(13);
                        $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 13) {   //暂停中：暂停->播放中
                        TTSTool._ContinueSpeak();
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(12);
                        $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                    }
                }
                else {//音视频
                    /*----------------------------音频-------------------------------*/
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 21) {   //第一次播放： 未播放->播放中
                        startIndex = 0;
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                        var path = opts.PlayPath;
                        //initPlayUrl(encodeURI(path), 0);
                        if (slidePostion != 0) {
                            if (isIEOrEdge() && MediaType == 'wav') {
                                vlc.playlist.play();
                            } else {
                                $(opts.sJplayerID).jPlayer("play");
                            }
                        } else {
                            doPlay();
                        }
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(22);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 22) {   //播放中：播放中->暂停
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                        doPause(opts.Volume);
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(23);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 23) {   //暂停中：暂停->播放中
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                        doPause_Play(opts.Volume);
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(22);
                    }
                    /*----------------------------视频-------------------------------*/
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31) {   //第一次播放： 未播放->播放中
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                        doPlay();
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(32);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {   //播放中：播放中->暂停
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                        doPause(opts.Volume);
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(33);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {   //暂停中：暂停->播放中
                        $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                        doPause_Play(opts.Volume);
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(32);
                    }
                }
            });

            $("#wgbuttonPlay_PYANS" + opts.FootDiv).click(function () {
                if (opts.FootDiv == "playPanelNew0") {
                    for (var kk = 1; kk < 201; kk++) {
                        $("#wgbuttonEndplayPanelNew" + kk.toString()).trigger("click");
                    }
                }
                else {
                    $("#wgbuttonEndplayPanelNew0").trigger("click");
                }
                var vlcTemp = getVLC('aboutplayer202');//检测播放器ID
                if (vlcTemp != null && isIEOrEdge()) {
                    vlcTemp.playlist.stop();
                }
                for (var i = 0; i < 200; i++) {
                    $("#id_stopImg_" + i).hide();
                    $("#id_plyImg_" + i).show();
                } $("#id_stopImg_999").hide();
                $("#id_plyImg_999").show();
                for (var k = 0 ; k < 200; k++) {//先停止其他播放器
                    var vlcTemp = getVLC('aboutplayer' + k);//检测播放器ID
                   var vlcCurTask = getVLC(opts.PlayerName);//当前播放器ID
                    //var vlcCurTask = document.getElementById("vlc");
                    $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    if (($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 12 || $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 13) && opts.FootDiv != ("playPanelNew" + k)) {//tts发音中
                        //TTSTool._StopSpeak();//结束tts发音
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(11);
                        break;
                    }
                    else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 22 && opts.FootDiv != ('playPanelNew' + k)) {//音频播放中
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(23);
                        if (vlcTemp != null && vlcTemp != undefined && vlcTemp != vlcCurTask) {
                            //vlcTemp.playlist.pause();//暂停
                            vlcTemp.playlist.togglePause()
                        }
                        break;
                    }
                    else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 32 && opts.FootDiv != ('playPanelNew' + k)) {//视频播放中
                        $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(33);
                        if (vlcTemp != null && vlcTemp != undefined && vlcTemp != vlcCurTask) {
                            //vlcTemp.playlist.pause();//暂停
                            vlcTemp.playlist.togglePause()
                        }
                        break;
                    }
                    else {
                    }
                }

                //停止JPlayer播放

                $.jPlayer.pause();
                /*----------------------------视频-------------------------------*/
                if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 31) {   //第一次播放： 未播放->播放中
                    $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                    doPlayPY()
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(32);
                }
                else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {   //播放中：播放中->暂停
                    $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    doPausePY(opts.Volume);
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(33);
                }
                else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {   //暂停中：暂停->播放中
                    $(this).attr("src", opts.sImagePath + "aud/zh/myplayer/pause-1.png");
                    doPause_PlayPY(opts.Volume);
                    $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(32);
                }
            });

            function SetMutualWay(l_nSmallAnswerType, bIsSellected) {

                if (opts.sPingCeStandrad == null || opts.sPingCeStandrad == "" || opts.sPingCeStandrad == NaN)
                    return;
                var obj = eval("(" + opts.sPingCeStandrad + ")");
                for (var i = 0; i < obj["AnsTypeMapToEvalType"].length; i++) {
                    if (l_nSmallAnswerType == obj["AnsTypeMapToEvalType"][i].AnsSmallTypeCode) {
                        $("#id_PingCeFangShiSellectFont" + opts.FootDiv).text(obj["AnsTypeMapToEvalType"][i].EvalTypeName);
                        if (obj["AnsTypeMapToEvalType"][i].EvalTypeName == "自动评测+教师辅评") {
                            var evObj = window.document.getElementsByName('name_PingCeFangShiSellect' + opts.FootDiv);
                            evObj[0].setAttribute('disabled', 'disabled');
                            $("#id_PingCeFangShiSellectFont" + opts.FootDiv).css({ "cursor": "default" });
                        }
                        if (bIsSellected == true) {//选中评测方式复选框
                            //alert(obj["AnsTypeMapToEvalType"][i].EvalTypeSelectedCode);
                            return obj["AnsTypeMapToEvalType"][i].EvalTypeSelectedCode;
                        }
                        else {//不选中评测方式复选框
                            //alert(obj["AnsTypeMapToEvalType"][i].EvalTypeUnSelectedCode);
                            return obj["AnsTypeMapToEvalType"][i].EvalTypeUnSelectedCode;
                        }
                    }
                }
            }

            $("#id_YYPYMode" + opts.FootDiv).click(function () {
                $("#wgbuttonEnd" + opts.FootDiv).trigger("click");
                $("#id_YYPYMode" + opts.FootDiv).removeClass().addClass('cls_YYPYButtonSelected');
                $("#id_YYMode" + opts.FootDiv).removeClass().addClass('cls_YYButtonUnSelected');
                $("#wgbuttonPlay_PYANS" + opts.FootDiv).show();
                $("#wgbuttonPlay" + opts.FootDiv).hide();
                opts.bISPYFlag = true;
                $(opts.sJPlayerID_BGVoice).css({ "display": "block" });
                $(opts.sJplayerID).css({ "display": "none" });
            });
            $("#id_YYMode" + opts.FootDiv).click(function () {
                $("#wgbuttonEnd" + opts.FootDiv).trigger("click");
                $("#id_YYPYMode" + opts.FootDiv).removeClass().addClass('cls_YYPYButtonUnSelected');
                $("#id_YYMode" + opts.FootDiv).removeClass().addClass('cls_YYButtonSelected');
                $("#wgbuttonPlay_PYANS" + opts.FootDiv).hide();
                $("#wgbuttonPlay" + opts.FootDiv).show();
                opts.bISPYFlag = false;
                $(opts.sJPlayerID_BGVoice).css({ "display": "none" });
                $(opts.sJplayerID).css({ "display": "block" });
            });

            $("#wgbuttonEnd" + opts.FootDiv).click(function () {
                nCurZiMuIndex = 0;
                if (opts.bISPYFlag == false) {
                    $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    if (opts.IsTTS == true) { //TTS发音结束
                        if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() != 11)
                            TTSTool._StopSpeak();//结束tts发音
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(11);
                        $(opts.tSentenceTarget + $("#id_SentenceIndex_" + opts.FootDiv).val()).css({ "color": "#636363" });
                        return;
                    }
                    if (opts.bIsVideo == true) {//视频结束
                        doStop();
                        if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {   //播放中：播放中->结束
                            $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                        }
                        else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {   //暂停中：暂停->结束
                            $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                        }
                    }
                    else {//音频结束
                        doStop();
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(21);
                    }
                    $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                    $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);

                    $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + parseTime(g_totaltimeNew));
                    for (var i = 0; i < opts.startTime.length; i++) {
                        $('#s' + opts.nIndex + '_' + i).css({ "color": "#636363" });
                    }
                    startIndex = 0;
                }
                else {
                    doStopPY();
                    if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 32) {   //播放中：播放中->结束
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                    }
                    else if ($("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val() == 33) {   //暂停中：暂停->结束
                        $("#id_MplayerStateHiddenFlagNew" + opts.FootDiv).val(31);
                    }
                    $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                    $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
                    $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                    $("#wgbuttonPlay_PYANS" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                }
            });
            var aboutplayer = document.getElementById(opts.PlayerName);
            //var aboutplayer = document.getElementById("vlc");
            var startIndex = 0;

            //            if (aboutplayer != null && opts.IsTTS == false && bVLCPlay == true){

            //                if(aboutplayer.attachEvent){
            //                     
            //                    aboutplayer.attachEvent("DoingPlayOperation", function(newtime, totaltime) {
            //                        if(opts.IsShengWenTongBu == true){
            //                            if(newtime >= parseInt(opts.startTime[startIndex])){
            //                                $('#s' + opts.nIndex + '_' + startIndex).css({"color":"red"});
            //                                if(startIndex > 0)
            //                                    $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({"color":"#636363"});
            //                                startIndex  = parseInt(startIndex) + 1;
            //                            }
            //                        }
            //                        opts.g_stop = 1;
            //                        //buttonPlay = false;
            //                        $("#id_showProText" + opts.FootDiv).text(parseTime(newtime) + ' / ' + parseTime(totaltime));
            //                        g_totaltimeNew = totaltime;
            //                        var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width"));
            //                        var m_x = parseInt(progresswidth * newtime / totaltime);
            //                        $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
            //                        $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
            //                    });
            //                    
            //                    aboutplayer.attachEvent("EndPlayOperation", function() {
            //                        doStop();
            //                        $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
            //                        $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
            //                        $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                        $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                        $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
            //                    });    
            //                }
            //                else{
            //                    aboutplayer.addEventListener("DoingPlayOperation", function(newtime, totaltime) {
            //                        if(opts.IsShengWenTongBu == true){
            //                            if(newtime >= parseInt(opts.startTime[startIndex])){
            //                                $('#s' + opts.nIndex + '_' + startIndex).css({"color":"red"});
            //                                if(startIndex > 0)
            //                                    $('#s' + opts.nIndex + '_' + (startIndex - 1)).css({"color":"#636363"});
            //                                startIndex  = parseInt(startIndex) + 1;
            //                            }
            //                        }
            //                        opts.g_stop = 1;
            //                        $("#id_showProText" + opts.FootDiv).text(parseTime(newtime) + ' / ' + parseTime(totaltime));
            //                        g_totaltimeNew = totaltime;
            //                        var progresswidth = parseInt($("#id_progress-wrapper" + opts.FootDiv).css("width"));
            //                        var m_x = parseInt(progresswidth * newtime / totaltime);
            //                        $('#id_slider-wrapper' + opts.FootDiv).css('left', m_x);
            //                        $('#id_ui-slider-range' + opts.FootDiv).css("width", m_x);
            //                    }, false);   
            //                    
            //                    aboutplayer.addEventListener("EndPlayOperation", function() {
            //                        doStop();
            //                        $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
            //                        $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);
            //                        $("#wgbuttonPlay" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                        $("#wgbuttonRec" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
            //                        $("#wgbuttonAnswer" + opts.FootDiv).attr("src", opts.sImagePath + "aud/zh/myplayer/play2.png");
            //                    }, false); 
            //                }
            //            }

            var LgKylxMPlayer = function () {
            };

            //暂停其余音频的播放
            var PauseOtherPlayer = function (index) {
                var ele = document.getElementsByClassName('active_PlayControl');
                var ind = index.replace('vlc','');
                if (ele.length > 0)
                {
                   
                    ele.forEach(function (item) {
                        var idx = item.id.replace('id_PlayControl', '');
                        if (idx != ind) {
                            var id = 'id_jplayer' + idx;
                            var vlc = getVLC('vlc' + idx)
                            //vlc.playlist.stop();
                            //$(id).jPlayer('pause');
                        }
                    });
                }
            }

            //暂停上一次的播放器
            var PauseLastPalyer = function (currentIndex) {
                if (lastPlayIndex != currentIndex && lastPlayIndex.length > 0) {
                    var id = '#id_jplayer' + lastPlayIndex;
                    //$(id).jPlayer('pause');
                    $(id).jPlayer('stop');
                    id = "#wgbuttonPlayplayPanelNew" + lastPlayIndex;
                    $(id).attr('src', opts.sImagePath + 'aud/zh/myplayer/play-1.png');

                    id = "#id_MplayerStateHiddenFlagNewplayPanelNew" + lastPlayIndex;
                    $(id).attr('value', 23);
                    //lastPlayIndex = currentIndex;
                    //console.log(id);
                    //$(id).click();
                    lastPlayIndex = currentIndex;
                }
                else if (lastPlayIndex.length == 0) {
                    lastPlayIndex = currentIndex;
                }
            }

            LgKylxMPlayer.prototype = {
                shutdown: function () {
                    $('#id_slider-wrapper' + opts.FootDiv).css('left', 0);
                    $('#id_ui-slider-range' + opts.FootDiv).css("width", 0);

                    $("#id_showProText" + opts.FootDiv).text('00:00:00 / ' + parseTime(g_totaltimeNew));
                    for (var i = 0; i < opts.startTime.length; i++) {
                        $('#s' + opts.nIndex + '_' + i).css({ "color": "#636363" });
                    }
                    startIndex = 0;
                    if ("ActiveXObject" in window) {
                        for (var k = 0 ; k < 250; k++) {//先停止其他播放器
                            var vlcTemp = getVLC('vlc0' + k);//检测播放器ID
                            var vlcCurTask = getVLC(opts.PlayerName);//当前播放器ID\
                            //var vlcCurTask = document.getElementById("vlc");
                            if (vlcTemp !== null && vlcTemp.playlist != null && typeof (vlcTemp.playlist) != "undefined") {
                                vlcTemp.playlist.stop();//停止
                            }
                            if (($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 12 || $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 13)) {//tts发音中
                                var TTSToolTemp = document.getElementById("SpeechRecAndSyn"); //语音识别合成控件
                                if (TTSToolTemp != null)
                                    TTSToolTemp._StopSpeak();//结束tts发音
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(11);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                break;
                            }
                            else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 22 && vlcTemp !== null) {//音频播放中
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(21);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                if (vlcTemp != null && vlcTemp.playlist != null && typeof (vlcTemp.playlist) != "undefined") {
                                    vlcTemp.playlist.stop();//停止
                                }
                                break;
                            }
                            else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 32 && vlcTemp !== null) {//视频播放中
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(31);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                if (vlcTemp != null && vlcTemp.playlist != null && typeof (vlcTemp.playlist) != "undefined") {
                                    vlcTemp.playlist.stop();//停止
                                }
                                break;
                            }
                            else {
                            }
                        }
                        for (var k = 0 ; k < 250; k++) {//先停止其他播放器
                            var vlcTemp = getVLC('vlc' + k);//检测播放器ID
                            var vlcCurTask = getVLC(opts.PlayerName);//当前播放器ID
                            //var vlcCurTask = document.getElementById("vlc");
                            if (vlcTemp !== null) {
                                vlcTemp.playlist.stop();//停止
                            }
                            if (($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 12 || $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 13)) {//tts发音中
                                var TTSToolTemp = document.getElementById("SpeechRecAndSyn"); //语音识别合成控件
                                if (TTSToolTemp != null)
                                    TTSToolTemp._StopSpeak();//结束tts发音
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(11);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                break;
                            }
                            else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 22 && vlcTemp !== null) {//音频播放中
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(21);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                if (vlcTemp != null && vlcTemp.playlist != null && typeof (vlcTemp.playlist) != "undefined") {
                                    vlcTemp.playlist.stop();//停止
                                }
                                break;
                            }
                            else if ($("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val() == 32 && vlcTemp !== null) {//视频播放中
                                $("#id_MplayerStateHiddenFlagNewplayPanelNew" + k).val(31);
                                $("#wgbuttonPlayplayPanelNew" + k).attr("src", opts.sImagePath + "aud/zh/myplayer/play-1.png");
                                if (vlcTemp != null && vlcTemp.playlist != null && typeof (vlcTemp.playlist) != "undefined") {
                                    vlcTemp.playlist.stop();//停止
                                }
                                break;
                            }
                            else {
                            }
                        }
                    }
                    var TTSTool = document.getElementById("SpeechRecAndSyn"); //语音识别合成控件
                    //if(TTSTool != null)
                    //TTSTool._StopSpeak();//结束tts发音

                    $.jPlayer.pause();
                }
            };
            if (window.LgSoft == null) {
                window.LgSoft = new Object();
            }
            if (window.LgSoft.LgKylx == null) {
                window.LgSoft.LgKylx = new Object();
            }
            if (window.LgSoft.LgKylx.LgKylxMPlayer == null) {
                window.LgSoft.LgKylx.LgKylxMPlayer = new LgKylxMPlayer(function () { });    //对象实例化
            }
        }

    });

    //默认参数

    var defaluts = {
        PlayerName: "",//播放器名称
        g_totleVolProLen_R: 0, //录音播放的音量进度条总长度
        g_stop: 0,
        g_totalTime: 0,
        move: false,   //移动标记
        moveForSlide: false,//显示隐藏按钮是否可滑动初始值
        _x: 0,             //鼠标离滑块左上角的相对位置
        _xForSlide: false,
        Volume: 50,     //初始化音量大小
        VolumeMax: 100, //最大音量
        lpos: 0,//滑块位置
        PlayPath: "",//播放原文录音路径
        AnswerPath: "",//播放作答录音路径
        RecPath: "",//播放录音文件路径
        AnswerRecPath: "",//播放作答录音路径
        OraPath: "",//原文录音路径
        IsDisPlayPlay: true,//是否显示播放音频按钮
        IsDisPlayAnswer: true,//是否显示作答录音按钮
        IsDisPlayRec: true,//是否显示录音播放按钮
        FootDiv: "",//初始化的目标DIV
        IsDisPlayOraPlay: false,//是否显示播放原文按钮（案例库）
        IsDisPlayRecPlay: false,//是否显示播放录音按钮（案例库）
        IsDisPlayTryLisPlay: false,//是否显示试听按钮
        IsDisPlayYuanWen: false,//是否显示播放原文按钮
        ShowOrHideTarget: '',//点击活动按钮选择要隐藏或者显示的div
        Txt: '显示语音识别结果',//滑动按钮前的文字
        nIndex: 0, //题目序号（在声文同步时需要用到）
        IsShengWenTongBu: false,//是否是声文同步
        startTime: '',//（声文同步）：每句的开始时间点（数组）
        IsDisPlayPingCeFangShi: false,//是否显示评测方式的选择
        ReceievePingCeFangShi: '',//获取评测方式的Hidden标签
        IsTTS: false,//是否需要TTS发音
        TTSTextArr: '',//TTS句子发音数组
        NoPlay: false,//true-没有播放功能 , false-有播放功能
        sPingCeStandrad: '',//评测标准
        sItemType: 0,
        bIsInitMultualWay: false,
        bIsMutualWayChecked: false,
        bIsPubEd: false,
        tSentenceTarget: '',//如果需要tts发音，需要将每一句的id前缀当作参数传给Mpleyer便于句子的标红
        bIsVideo: false,
        nVideoPlayHeight: 0,
        tImgLoadingTarget: '',
        sJplayerID: '',
        sJplayerID_AnsRec: '',
        sJPlayerID_BGVoice: '',
        bVLCPlay: false,
        StartTimeArr: [],
        EndTimeArr: [],
        sContentArr: [],
        TarZimuDiv: "",
        bISPYFlag: false,
        sStuAnswerPath: '',
        bISPOPPYDisPlay: false,
        tListAnimateTar: '',
        tVideoAnimateTar: '',
        tVideoPYAnimateTar: '',
        sBgVoicePath: '',
        sImagePath: '../../'
    };
})(window.jQuery);