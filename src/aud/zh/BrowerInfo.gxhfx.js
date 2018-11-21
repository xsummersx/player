    /*
     * �������ж��������Ϣ
	 * ��д��wangchaoxuan
	 * ���ڣ�2016.1.5
	 * �汾��V1.1
	*/

    //�ж��Ƿ���IE�����
    function isIE()
    {
        return (!!window.ActiveXObject || "ActiveXObject" in window);
    }
     
    //�ж��Ƿ���IE�����
    function IEVersion()
    {
        if (isIE()) {   //��IE
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
                    return "0";  //IE�汾����
                }
            }
        }
        return "-1";   //��IE
    }

    //�ж��Ƿ���IE Edge�����
    function isEdge()
    {
        var userAgent = navigator.userAgent; //ȡ���������userAgent�ַ���
        return (userAgent.indexOf('edge') > -1) ? true : false;
    }
    
    //�ж��Ƿ�ΪIE(��IE Edge)�����
    function isIEOrEdge()
    {
        return (isIE() || isEdge()) ? true : false;
        
//        alert(window.ActiveXObject);
//        alert("ActiveXObject" in window);
//        var userAgent = navigator.userAgent; //ȡ���������userAgent�ַ���
//        var isOpera = userAgent.indexOf("Opera") > -1; //�ж��Ƿ�Opera�����
//        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //�ж��Ƿ�IE�����
//        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //�ж��Ƿ�IE��Edge�����

//        if((isIE) || (isEdge))
//        {
//            return true;
//        }
//        else
//        {
//            return false;
//        }
    }
    
    //�ж�IE������İ汾�Ƿ����ϵͳ�涨�İ汾
    function WhetherTheIEVersion()
    {
        return IEVersion() > 7 ? true : false;
//        var userAgent = navigator.userAgent; //ȡ���������userAgent�ַ���
//        var isOpera = userAgent.indexOf("Opera") > -1; //�ж��Ƿ�Opera�����
//        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //�ж��Ƿ�IE�����
//        var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //�ж��Ƿ�IE��Edge�����
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

    //�жϵ�ǰ�������
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
             * �ж��Ƿ�Ϊ��������
            */
            uaMatch = userAgent.match(/firefox\/([\d.]+)/);
            if (uaMatch != null) {
                return 'firefox';
            }
            /*
             * �ж��Ƿ�Ϊ�ȸ������
            */
            uaMatch = userAgent.match(/chrome\/([\d.]+)/);
            if (uaMatch != null) {
                return 'chrome';
            }
            /*
             * �ж��Ƿ�Ϊopera�����
            */
            uaMatch = userAgent.match(/opera\/([\d.]+)/);
            if (uaMatch != null) {
                return 'opera';
            }
            /*
             * �ж��Ƿ�ΪSafari�����
            */
            uaMatch = userAgent.match(/version\/([\d.]+).*safari/);
            if (uaMatch != null) {
                return 'safari';
            }
            if (userAgent.indexOf('edge') > -1) {
                return 'edge'
            }
            return '����';
        }
    }//myBrowser() end
    
    //�ж��Ƿ�Ϊ�ȸ���������
    function isChromeOrFirefox()
    {
        var userAgent = navigator.userAgent.toLowerCase();
        return (userAgent.match(/firefox\/([\d.]+)/) || userAgent.match(/chrome\/([\d.]+)/)) ? true : false;

        //var userAgent = navigator.userAgent; //ȡ���������userAgent�ַ���
        //var isFF = userAgent.indexOf("Firefox") > -1; //�ж��Ƿ�Firefox�����
        //var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //�ж�Chrome�����
        //if((isFF) || (isChrome))
        //    return true;
        //else 
        //    return false;
    }
    
	//�ж���Ļ�ֱ���
    function RCTInfo()
    {
        var RCT_W=screen.width;
        var RCT_H=screen.height;
        if((RCT_W < 1024))// || (RCT_H < 768))
	        return -1;//��ʱ�����û����뽫�ֱ��ʵ�����1024*768�����ϣ���
        else
	        return 1;//�ֱ�������ϵͳҪ��

        //alert("��ϵͳ��⣬�����Ļ�ֱ���Ϊ " + RCT_W+"*"+ RCT_H );
    }
