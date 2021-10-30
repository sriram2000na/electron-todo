const remote = require('electron').remote
const fs=require('fs');
let win;


const submit = document.querySelector('#btn');

submit.addEventListener('click', () => {
  win = remote.getCurrentWindow();

  const title = document.querySelector('#title').value;
  const message = document.querySelector('#message').value;
  const date = document.querySelector('#date').value;
  const time = document.querySelector('#time').value;
  let content={title,message,date,time};
  fs.readFile('tasks.json','utf-8',(err,data)=>{
    // console.log(data);
    if(!data){
      data={data:[]};
      data=JSON.stringify(data);
    }
    let newjson=JSON.parse(data,null,2);
    console.log(newjson);
    content['key']=newjson['data'].length;
    newjson['data'].push(content);
    content=newjson;
    // console.log(newjson);
    content=JSON.stringify(content);
    console.log(content);
    fs.writeFile('tasks.json', content, (err) => {
      if (err) {
          throw err;
      }
    });
  })
  // win.close();
});

