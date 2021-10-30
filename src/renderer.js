const fs=require('fs');
const path = require('path');
const url = require('url');
const remote = require('electron').remote
const BrowserWindow = require('electron').remote.BrowserWindow;
let WindowsToaster,LinuxNotify; 

const curWin = remote.getCurrentWindow();

let notificationMessages = ['Mark as completed']
let myNotification = null;
let message = notificationMessages[0]
if (process.platform === 'linux') {
  LinuxNotify = require('linux-notify').LinuxNotify
} else if (process.platform === 'win32') {
  WindowsToaster = require('node-notifier').WindowsToaster;
}

const callNotif=()=>{
  if(process.platform==='win32')
  {
  myNotification=new WindowsToaster({withFallback:false,customPath:undefined});
    var options = {
      title: 'KOOO',
      message: "Hello",
      wait: false,
      timeout: 10,
      'app-name': 'node-notifier',
      actions:notificationMessages,
      urgency: undefined,
      category: undefined,
      hint: undefined
    }

    myNotification.notify(options,(err,action)=>{
    if (err) console.log(err)

    console.log(action,message)
    if(action==='activate') {
      open(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
      })) 
    } else if (action === message.toLowerCase()) {
      curWin.hide();
    }
  });}
  else if(process.platform==='linux'){

    const notif = new LinuxNotify('glorifiedTODO')
    myNotification = notif.createNotification('Hello')
    myNotification.addButton('btn1', message);
    console.log(notif)
    myNotification.on('action', (arg) => {
      if (arg.button.text == message) {
        curWin.hide();
      }
    })
  }
}

const check=()=>{
  fs.readFile('../tasks.json',(err,content)=>{
    if(err){
      return;
    }
    content=JSON.parse(content);
    let now =new Date();
    console.log(now);
    content.forEach((data)=>{console.log(data);})
  })
}
// check();
setInterval(check,100);

// const btn= document.getElementsByTagName('button')[0];

// btn.addEventListener('click',(e)=>{
//   callNotif();
// })

