const sendEmail = require('./mailSender').sendMail;
let isSleeping = true;


const sendMessageToMaster = (message) => {
  process.send({
    pid: process.pid,
    details: message,
  });
};

const requestTask = () => sendMessageToMaster('requestTask');

const onMessage = (message) => {
  if (message.ping) {
    if (isSleeping) {
      console.log('sleeping worker got ping message');
      isSleeping = false;
      process.nextTick(requestTask);
    }

    return;
  }

  if (message.task === null) {
    console.log('time to sleep');
    isSleeping = true;
    return;
  }

  isSleeping = false;
  const {task} = message;
  console.log('worker implemeting the task');

  sendEmail(task.name, task.email, task.message, (e, ok) => {
    if (e){
      console.dir(e);
      process.exit(1);
      return;
    }

    console.dir('success', ok);
  })
  //ask next task
  process.nextTick(requestTask);
}

const init = () => {
  process.on('message', onMessage);
  sendMessageToMaster('Im alive');
  requestTask();
}

module.exports = {
  init
}