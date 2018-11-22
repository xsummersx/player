# player
this is jplayer

暂时只有文件index.ok.html，index.new.html和index.jianrong1.0.html可以使用

调试方法，去掉文件后缀名改成index.html，需要启用服务器，输入网址localhost:8080进行调试。

Index.ok.html这个文件是引用了上一版本的MPlay.js对该js进行了修改，原先的对vlc的调用方法不正确，进行了修改，但是目前只有播放、暂停、停止三个按钮有效果，其他的还未调试通。

Index.new.html引用了上一版本的MPlay.js未作修改，故在IE浏览器下未启用vlc播放器。（虽然代码有但是vlc方法不正确，或者不知道vlc用了哪个版本可以使用已写的方法）。

Index.jianrong1.0.html，自己写的播放器，在非IE浏览器下用了jplayer，在IE浏览器下自定义一个播放器，用了vlc的方法，但是效果功能不好。

Vlc调用方法参考网站：https://blog.csdn.net/vblittleboy/article/details/12947087