const { h, Component, Color } = require('ink');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;
const child_process = require('child_process');

ncp.limit = 128;

const cp = (source, destination) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, err => {
      if (err) reject(err);
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  });
};

const update = (destination, packageName) => {
  return new Promise((resolve, reject) => {
    const pkg = `${destination}/package.json`;

    fs.readFile(pkg, 'utf8', (err, data) => {
      if (err) reject(err);

      const json = JSON.parse(data);
      json.name = packageName;
      fs.writeFileSync(pkg, JSON.stringify(json, null, 2));
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  });
};

const publish = destination => {
  return new Promise((resolve, reject) => {
    child_process.exec(`npm publish ${destination}`, err => {
      if (err) reject(err);
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  });
};

module.exports = class Comp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: '',
      text: '',
    };
  }

  componentDidMount() {
    this.start();
  }

  async start() {
    const { packageName, onExit } = this.props;

    const source = path.resolve(__dirname, '../template');
    const destination = path.resolve(`./__npm-robbery-template__${new Date().getTime()}`);

    try {
      // 1. copy
      await this.setStateAsync('cp', 'Copy template project...');
      await cp(source, destination);

      // 2. update
      await this.setStateAsync('update', 'Update project package name...');
      await update(destination, packageName);

      // 3. npm publish
      await this.setStateAsync('publish', 'Publish to npm...');
      await publish(destination);

      await this.setStateAsync('ok', `Success register ${packageName}.`);
    } catch (e) {
      await this.setStateAsync('error', `Fail: ${e.message}`);
    } finally {
      // 4. remove
      rimraf.sync(destination);
    }
    const { status, text } = this.state;
    // 是否出错
    onExit(status === 'ok' ? 0 : 1);
  }

  setStateAsync(status, text) {
    return new Promise((resolve, reject) => {
      this.setState({ status, text }, () => {
        resolve();
      });
    });
  };

  render() {
    const { status, text } = this.state;
    return h(
      'div',
      {},
      [
        h(Color, { green: status !== 'error', red: status === 'error' }, text),
      ]
    );
  }
};
