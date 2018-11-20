
var ZnbkPlayer = function(url,id) {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE_flag = 0; //flag为1的时候，是IE浏览器，否则不是
  var isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    // var fIEVersion = parseFloat(RegExp["$1"]);
    // if(fIEVersion == 7) {
    //     alert("7");
    // } else if(fIEVersion == 8) {
    //     alert("8");
    // } else if(fIEVersion == 9) {
    //     alert("9");
    // } else if(fIEVersion == 10) {
    //     alert("10");
    // } else {
    //     alert("6");
    // }
    //是否是IE7 8 9 10版本
    isIE_flag = 1;
  } else if (isEdge) {
    //是否是EDG浏览器
    isIE_flag = 0;
  } else if (isIE11) {
    //是否是IE11
    isIE_flag = 1;
  } else {
    //是否是其他浏览器
    isIE_flag = 0;
  }
  // ///////  以上是判断浏览器
  // ///////
  // ///////
  // /////// 以下是不同浏览器启用不同方法
  if (isIE_flag == 1) {
    //获取页面的ID容器
    document.getElementById(id).innerHTML ="<div class='vlcBox'>"+
    "<button id='play"+id+"' class='play' onclick='play()'></button>"+
    "<button class='stop' onclick='stop()'></button>"+
    "<div class='jdtbg'><div class='jdt jdt"+id+"'></div></div>"+
    "<div class='time'>"+
    "<span id='StartTime"+id+"'>00:00</span><span>/</span>"+
    "<span id='EndTime"+id+"'>00:00</span>"+
    "</div>"+
    "<button id='ismute"+id+"' class='Nomute' onclick='mute()'></button>"+
    "<div class='volbg'><div class='vol vol"+id+"'></div></div>"+
    "</div>"
  } else if (isIE_flag == 0) {
    //判断不是iE浏览器加载下面的方法
    $(document).ready(function() {
      document.getElementById(id).innerHTML ="<div class='music_box'>"+
      "<div id='jquery_jplayer_1"+id+"' class='jp-jplayer'></div>"+
      "<div id='jp_container_1' class='jp-audio'>"+
      "<div class='jp-type-single'>"+
      "<div class='jp-gui jp-interface'>"+
      "<ul class='jp-controls'>"+
      "<li><a href='javascript:;' class='jp-play' tabindex='1'>play</a></li>"+
      "<li><a href='javascript:;' class='jp-pause' tabindex='1'>pause</a></li>"+
      "<li><a href='javascript:;' class='jp-stop' tabindex='1'>stop</a></li>"+
      "<li><a href='javascript:;' class='jp-mute' tabindex='1' title='mute' >mute</a></li>"+
      "<li><a href='javascript:;' class='jp-unmute' tabindex='1' title='unmute'>unmute</a></li>"+
      "<div class='jp-progress'><div class='jp-seek-bar'><div class='jp-play-bar'></div></div></div>"+
      "<div class='jp-volume-bar'><div class='jp-volume-bar-value'></div></div>"+
      "<div class='jp-time-holder'><div class='jp-current-time'></div><span class='xgfont'>/</span><div class='jp-duration'></div></div></div></div></div></div>"
      $("#jquery_jplayer_1"+id).jPlayer({
        ready: function() {
          $(this).jPlayer("setMedia", {
            title: "Bubble",
            mp3: url
          });
        },
        swfPath: "../aud/jplayer", //存放jplayer.swf的决定路径
        solution: "html, flash", //支持的页面
        supplied: "mp3,wav,ogg,m4a", //支持的音频的格式
        wmode: "window", //允许设置Flash 的wmode。
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true, //平滑过渡播放条
        keyEnabled: true, //启用这个实例的键盘控制器特性。
        remainingDuration: false, //总时间是否倒计时
        toggleDuration: false //为true时，点击GUI元素duration触发jPlayer({remainingDuration}) 选项。
      });
    });
  }
};
var id = 'audio01'
var vlc = document.getElementById("vlc");
vlc.audio.volume = 50//默认音量为50；
var playFlag = 0; //音频状态
var a = 0;
var velFlag = 0;//是否静音状态
var eT;//定时器
var sT; //定时器
function play() {
  if (playFlag == 0) {//判断状态
    $("#play"+id).removeClass("play"); //改变样式
    $("#play"+id).addClass("Pause"); //改变样式
    vlc.playlist.play(); //音频播放
    playFlag = 1; //状态改变
    jdt(); //进度条动起来
  } else if (playFlag == 1) {//判断状态
    $("#play"+id).removeClass("Pause");
    $("#play"+id).addClass("play");
    vlc.playlist.togglePause(); //音频暂停
    playFlag = 0;
    rmjdt(); //进度条暂停
  }
}
function stop() {
  //重新播放
  vlc.playlist.stop();
  rmjdt();
  playFlag = 0;
  $("#play"+id).removeClass("Pause");
  $("#play"+id).addClass("play");
  $("#StartTime"+id).html('00:00');
  $(".jdt").css({"width":'0px'});
}
function jdt() {//进度条
  //起一个定时器
  eT = window.setTimeout(function(){
    var EndTime = dateFtt(vlc.input.length); //音频总长度
    $("#EndTime"+id).html(EndTime);
  },100);
  sT = window.setInterval(function() {
    var StartTime = dateFtt(vlc.input.time);
    $("#StartTime"+id).html(StartTime);
    var x = (vlc.input.time / vlc.input.length)*200;
    $(".jdt"+id).css({"width":x+'px'});
    if(vlc.input.time >= vlc.input.length-100){
      stop();
    }
  }, 10);
}
function rmjdt() {//暂停进度条
  //关闭一个定时器
  window.setTimeout(eT);
  window.clearInterval(sT);
}
function mute(){
  if(velFlag == 0){
    vlc.audio.volume = 0;
    $("#ismute"+id).removeClass("Nomute");//喇叭的样式
    $("#ismute"+id).addClass("mute");//喇叭的样式
    $(".vol"+id).css({"width":"0px"})//音频的蓝色进度条
    velFlag = 1;
  }else if(velFlag == 1){
    vlc.audio.volume = 50;
    $("#ismute"+id).removeClass("mute");
    $("#ismute"+id).addClass("Nomute");
    velFlag = 0;
    $(".vol"+id).css({"width":"37px"})//音频的蓝色进度条
  }
}
function dateFtt(fmt) { //时间格式化
  var d=new Date(fmt);
  var minute=change(d.getMinutes());
  var second=change(d.getSeconds());
  function change(t){
    if(t<10){
    return "0"+t;
    }else{
    return t;
    }
  }
  var time=minute+':'+second;
  return time
}
// function play(id,playFlag) {
//   if (playFlag == 0) {
//     //判断状态
    
//     $(function(){
//     $("#"+id).removeClass('play'); //改变样式
//     $("#"+id).addClass('Pause'); //改变样式
//     document.getElementById("vlc").playlist.play(); //音频播放
//     playFlag = 1; //状态改变
//     id = id.replace(/play/g, "")
//     jdt(id); //进度条动起来
//     })
//   } else if (playFlag == 1) {
//     //判断状态
//     $("#"+id).removeClass("Pause");
//     $("#"+id).addClass("play");
//     document.getElementById("vlc").playlist.togglePause(); //音频暂停
//     playFlag = 0;
//     rmjdt(); //进度条暂停
//   }
// }
// function stop(id) {
//   var vlc = document.getElementById("vlc")
//   //重新播放
//   vlc.playlist.stop();
//   rmjdt();
//   playFlag = 0;
//   $("#play"+id).removeClass("Pause");
//   $("#play"+id).addClass("play");
//   $("#StartTime"+id).html("00:00");
//   $(".jdt"+id).css({ width: "0px" });
// }
// function jdt(id) {
//   var vlc = document.getElementById("vlc");
//   //进度条
//   //起一个定时器
//   eT = window.setTimeout(function() {
//     var EndTime = dateFtt(vlc.input.length); //音频总长度
//     $("#EndTime"+id).html(EndTime);
//   }, 100);
//   sT = window.setInterval(function() {
//     var StartTime = dateFtt(vlc.input.time);
//     $("#StartTime"+id).html(StartTime);
//     var x = (vlc.input.time / vlc.input.length) * 200;
//     $(".jdt"+id).css({ width: x + "px" });
//     if (vlc.input.time >= vlc.input.length - 100) {
//       stop();
//     }
//   }, 10);
// }
// function rmjdt() {
//   //暂停进度条
//   //关闭一个定时器
//   window.setTimeout(eT);
//   window.clearInterval(sT);
// }
// function mute(id) {
//   var vlc = document.getElementById("vlc");
//   if (velFlag == 0) {
//     vlc.audio.volume = 0;
//     $("#"+id).removeClass("Nomute"); //喇叭的样式
//     $("#"+id).addClass("mute"); //喇叭的样式
//     $(".vol"+id).css({ width: "0px" }); //音频的蓝色进度条
//     velFlag = 1;
//   } else if (velFlag == 1) {
//     vlc.audio.volume = 50;
//     $("#"+id).removeClass("mute");
//     $("#"+id).addClass("Nomute");
//     velFlag = 0;
//     $(".vol"+id).css({ width: "37px" }); //音频的蓝色进度条
//   }
// }
// function dateFtt(fmt) {
//   //时间格式化
//   var d = new Date(fmt);
//   var minute = change(d.getMinutes());
//   var second = change(d.getSeconds());
//   function change(t) {
//     if (t < 10) {
//       return "0" + t;
//     } else {
//       return t;
//     }
//   }
//   var time = minute + ":" + second;
//   return time;
// }


