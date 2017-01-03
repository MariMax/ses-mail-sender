const get_ip = require('ipware')().get_ip;

let activeClients = [];

const clearClient = (ip) => {
  activeClients = activeClients.filter(i => i !== ip);
}

module.exports = (req, res, next) => {
  const ipInfo = get_ip(req);
  if (!ipInfo || activeClients.find(i => i === ipInfo.clientIp)) {
    return res.status(403).send('Not so often please')
  }

  activeClients = [...activeClients, ipInfo.clientIp];
  setTimeout(() => clearClient(ipInfo.clientIp), process.env.IP_TIMEOUT * 1000);

  next();
};
