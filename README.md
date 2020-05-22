# cut
#cut img

主要功能：通过对本地图片分割为多张图片上传至七牛存储（可带参数分割，默认分割为3张），代码中的AccessKey、SecretKey、bucket到时可以替换为自己的。

运行前提：已经安装了node的环境，并且有安装了七牛存储的组件（npm install qiniu），现在代码是可以直接拿来用。

分割与上传命令执行：  node  dealImg.js  {filename} {num}     //{filename} 图片名称   {num}分割为几张图片，不传默认为3张。

例：node  dealImg.js  testimg.jpeg  2   #把 testimg.jpeg 图片分水平分割为两张上传
