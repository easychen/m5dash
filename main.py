from m5stack import *
from m5ui import *
from uiflow import *
import wifiCfg
from microWebCli import MicroWebCli

ssid = "SSID"
wifiPassword = "PASS"
dashImageUrl = "https://tvax3.sinaimg.cn/crop.33.3.473.473.200/40dfde6fly8gdioq5co9jj20eo0d977t.jpg"

wifiCfg.doConnect(ssid,wifiPassword)

while True:
  try:
    wCli = MicroWebCli(dashImageUrl)
    wCli.OpenRequest()
    resp = wCli.GetResponse()
    contentType = resp.WriteContentToFile("a1.jpg")
    image0 = M5Img(0, 0, "a1.jpg",  visible=True, invert=False, threshold=128)
    coreInkShow()
  except Exception as e:
    with open("log.txt", "w") as f:
      f.write( str(e) )
  wait(60)
