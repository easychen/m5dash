const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/screen', async (req, res)=>{
  
  const from_url =  'http://ftqq.com';
  const to_url =  '';
  
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  const mobile = puppeteer.devices['iPhone X']
  await page.emulate(mobile);
  await page.setViewport({ width: 200, height: 200 });
  
  await page.setDefaultNavigationTimeout(1000*60*5); 
    await page.goto(from_url,{
        waitUntil: 'networkidle2',
    });
  
  const data = await page.screenshot({"fullPage":true,"type":"jpeg","quality":90});
  // SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
  var COS = require('cos-nodejs-sdk-v5');
  var cos = new COS({
    SecretId: '*',
    SecretKey: '*'
  });
  cos.putObject({
    Bucket: '*', /* 必须 */
    Region: 'ap-hongkong',    /* 必须 */
    Key: to_url ,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: data, // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
    }
 }, async function(err, ret) {
  res.set('Content-Type', 'application/json');
  res.send(err || ret);
  res.status(200).end();
  await browser.close();
 });
		
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
