'use strict';
const puppeteer = require('puppeteer');
exports.main_handler = async (event, context) => {
  const from_url =  '';
  const to_url =  'dashboard.jpg';
  
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
    Region: '*',    /* 必须 */
    Key: to_url ,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: data, // 上传文件对象
  }, function(err, data) {
    console.log(err || data);
    return err || data;
  });
  return event
};
