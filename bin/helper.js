const fs = require('fs');
const ncp = require('ncp').ncp;
const child_process = require('child_process');

ncp.limit = 128;

exports.cp = (source, destination) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, err => {
      if (err) reject(err);
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  });
};

exports.update = (destination, packageName, version) => {
  return new Promise((resolve, reject) => {
    const pkg = `${destination}/package.json`;

    fs.readFile(pkg, 'utf8', (err, data) => {
      if (err) reject(err);

      const json = JSON.parse(data);
      json.name = packageName;
      json.version = version;
      fs.writeFileSync(pkg, JSON.stringify(json, null, 2));
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  });
};

exports.publish = destination => {
  return new Promise((resolve, reject) => {
    child_process.exec(`npm publish ${destination}`, err => {
      if (err) reject(err);
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  });
};
