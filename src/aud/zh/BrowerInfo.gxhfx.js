    /*
     * 描述：判断浏览器信息
	 * 编写：wangchaoxuan
	 * 日期：2016.1.5
	 * 版本：V1.1
	*/

    //判断是否是IE浏览器
    function isIE()
    {
        return (!!window.ActiveXObject || "ActiveXObject" in window);
    }
     
    //判断是否是IE浏览器
    function IEVersion()
    {
        if (isIE()) {   //是IE
            var userAgent = navigator.userAgent.toLowerCase();
            var uaMatch = userAgent.match(/msie ([\d.]+)/);
            if (uaMatch) {
                var version = parseInt(uaMatch[1]);
                if(7 == version){
                    return "7";
                }
                else if (8 == version) {
                    return "8";
                }
                else if (9 == version) {
                    return "9";
                }
                else if (10 == version) {
                    return "10";
                }
                else if (!document.attachEvent) {
                    return "11";
                }
                else {
                    return "0";  //IE版本过低
                }
            }
        }
        return "-1";   //非IE
    }

    //判断是否是IE Edge浏览器
    function isEdge()
    {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        return (userAgent.indexOf('edge') > -1) ? true : false;
    }
    
    //判断是否为IE(或IE Edge)浏览器
    function isIEOrEdge()
    {
        return (isIE() || isEdge()) ? true : false;
        
//        alert(window.ActiveXObject);
//        alert("ActiveXObject" in window);
//        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
//        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
//        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器

//        if((isIE) || (isEdge))
//        {
//            return true;
//        }
//        else
//        {
//            return false;
//        }
    }
    
    //判断IE浏览器的版本是否符合系统规定的版本
    function WhetherTheIEVersion()
    {
        return IEVersion() > 7 ? true : false;
//        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
//        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
//        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
//        
//        if(isEdge)
//            return true;
//        else
//        {
//            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
//            reIE.test(userAgent);
//            var fIEVersion = parseFloat(RegExp["$1"]);
//            if(fIEVersion >= 7)
//                return true;
//            else
//                return false;
//        }//isIE end
    }

    //判断当前浏览类型
    function BrowserType() {
        var vrIE = IEVersion();
        if (vrIE > 6) {
            return 'IE' + vrIE;
        }
        else if (vrIE >= 0 && vrIE <= 6) {
            return '<IE7'
        }
        else {
            var userAgent = navigator.userAgent.toLowerCase();
            var uaMatch
            /*
             * 判断是否为火狐浏览器
            */
            uaMatch = userAgent.match(/firefox\/([\d.]+)/);
            if (uaMatch != null) {
                return 'firefox';
            }
            /*
             * 判断是否为谷歌浏览器
            */
            uaMatch = userAgent.match(/chrome\/([\d.]+)/);
            if (uaMatch != null) {
                return 'chrome';
            }
            /*
             * 判断是否为opera浏览器
            */
            uaMatch = userAgent.match(/opera\/([\d.]+)/);
            if (uaMatch != null) {
                return 'opera';
            }
            /*
             * 判断是否为Safari浏览器
            */
            uaMatch = userAgent.match(/version\/([\d.]+).*safari/);
            if (uaMatch != null) {
                return 'safari';
            }
            if (userAgent.indexOf('edge') > -1) {
                return 'edge'
            }
            return '其他';
        }
    }//myBrowser() end
    
    //判断是否为谷歌或火狐浏览器
    function isChromeOrFirefox()
    {
        var userAgent = navigator.userAgent.toLowerCase();
        return (userAgent.match(/firefox\/([\d.]+)/) || userAgent.match(/chrome\/([\d.]+)/)) ? true : false;

        //var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        //var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        //var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
        //if((isFF) || (isChrome))
        //    return true;
        //else 
        //    return false;
    }
    
	//判断屏幕分辨率
    function RCTInfo()
    {
        var RCT_W=screen.width;
        var RCT_H=screen.height;
        if((RCT_W < 1024))// || (RCT_H < 768))
	        return -1;//此时提醒用户“请将分辨率调整至1024*768及以上！”
        else
	        return 1;//分辨率满足系统要求

        //alert("经系统检测，你的屏幕分辨率为 " + RCT_W+"*"+ RCT_H );
    }
