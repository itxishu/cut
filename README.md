# cut
#cut img

主要功能：通过对本地图片分割为多张图片上传至七牛存储（可带参数分割，默认分割为3张），代码中的AccessKey、SecretKey可以替换为自己的。

运行前提：已经安装了node的环境，并且有安装了七牛存储的组件    npm install qiniu

分割与上传命令执行：  node dealImg.js  testimg.jpeg  2     //testimg.jpeg 图片名称路径    2 为分割为几张图片
