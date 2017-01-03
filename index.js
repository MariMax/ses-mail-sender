const cluster = require('cluster');
const role = cluster.isMaster ? './master' : './worker';
const task = require(role);

task.init();