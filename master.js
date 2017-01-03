const cluster = require('cluster');
const workerCount = 1;//Math.max(4, require('os').cpus().length - 1);
const server = require('./server');

let taskList = [];

const addTask = (task) => {
  taskList = [...taskList, task];

  Object.keys(cluster.workers).forEach(key => {
    cluster.workers[key].send({ ping: true });
  });


}

const onWorkerDisconnect = (code, signal) => {
  console.log('worker disconnected', code, signal);
  createWorkerIfNeeded();
}

const createWorkerIfNeeded = () => {
  
  const numOfWorkers = cluster.workers ? Object.keys(cluster.workers).length : 0;
  const createCount = workerCount - numOfWorkers;
  let worker;
  for (let w = 0; w < createCount; w++) {
    worker = cluster.fork(process.env);
    worker.on('message', onWorkerMessage);
    worker.on('exit', onWorkerDisconnect);
  }
};

function onWorkerMessage(message) {
  const worker = this;
  switch (message.details) {
    case 'requestTask':
      let task = null;
      if (taskList.length) {
        task = taskList.pop();
      }

      worker.send({
        task
      });
      break;

    default:
      console.log('worker trying to say something', message);
      break;
  }
}

function init() {
  createWorkerIfNeeded();
  server.init(this);
}

const purge = () => taskList = [];

module.exports = {
  init,
  addTask,
  purge,
};

