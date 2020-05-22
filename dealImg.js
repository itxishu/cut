
//七牛上传组件
var qiniu = require("qiniu");
// 用户获取图片大小
const sizeOf = require('image-size')
// 导入canvas库，用于裁剪图片
const { createCanvas, loadImage } = require('canvas')

//要上传的空间
bucket = 'nwx0522';
//需要填写你的 Access Key 和 Secret Key  此帐号为测试帐号，30天后会失效
qiniu.conf.ACCESS_KEY = '0q0pYK7nRUWp2B8rd5kl1R0w3GPOyYuwQ_xF2Hmf';
qiniu.conf.SECRET_KEY = 'QC_se284GsWbQiTQ4hZ2PfjLvUm_oQxlbEtENebM';
const config = new qiniu.conf.Config();



!(async () => {
    //获取带来的参数 命令行为： node dealImg.js  testimg.jpeg  4
    var arguments = process.argv.splice(2);

    // 明确我们需要水平分割成几份  默认为分割为3块
    const num = arguments[1] ?? 3

    //是分割的图片 没传参数就为本地默认的一张测试图片 testimg.jpeg
    const dealImg = (arguments[0] !== '') ? arguments[0] : "testimg.jpeg"

    // 加载图片
    const image = await loadImage(dealImg)
    // 获取图片宽高
    const { width, height } = await sizeOf(dealImg)

    // 创建等宽登高的canvas
    const mainCanvas = createCanvas(width, height)
    // 获取canvas上下文
    const ctx = mainCanvas.getContext('2d')
    // 绘图
    ctx.drawImage(image, 0, 0)


    // 获取一份的高度
    const oneHeight = height / num
    for (let i = 0; i < num; i++) {
        // 创建一份裁剪的canvas
        let clipCanvas = createCanvas(width, oneHeight)
        // 获取canvas上下文
        const clipCtx = clipCanvas.getContext('2d')
        // 通过 clipCtx 裁剪 mainCanvas
        clipCtx.drawImage(mainCanvas, 0, oneHeight * i, width, oneHeight, 0, 0, width, oneHeight)

        // console.log(clipCanvas.toBuffer())
        var fs = require("fs");
        var currtime = Date.now();

        //上传到七牛后保存的文件名
        var key = currtime + '_' + num + '_' + `${i + 1}.png`
        var fd = fs.openSync(key, "w");
        var result = fs.writeSync(fd, clipCanvas.toBuffer(), 0);

        if (result) {
            //生成上传 Token
            token = uptoken(bucket, key);
            //调用uploadFile上传    //要上传文件的本地路径 //filePath = './tttt.jpeg'
            uploadFile(token, key, './' + key);
        }

        // 主动释放内存
        fs.closeSync(fd);
        clipCanvas = null
    }
})()


//构建上传策略函数获取token
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy({ scope: bucket + ":" + key });
    //设置回调的url以及需要回调给业务服务器的数据
    //putPolicy.callbackUrl = 'http://your.domain.com/callback';
    //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
    return putPolicy.uploadToken();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    const extra = new qiniu.form_up.PutExtra()
    const formUploader = new qiniu.form_up.FormUploader(config);

    formUploader.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}
