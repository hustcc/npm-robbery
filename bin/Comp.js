const { h, Component, Color } = require('ink');
const path = require('path');
const rimraf = require('rimraf');
const helper = require('./helper');


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
    const destination = path.resolve(`./__npm-robbery-template__${new Date().getTime()}__`);

    try {
      // 1. copy
      await this.setStateAsync('cp', 'Copy template project...');
      await helper.cp(source, destination);

      // 2. update
      await this.setStateAsync('update', 'Update project package name...');
      const version = '0.0.1-beta.1';
      await helper.update(destination, packageName, version);

      // 3. npm publish
      await this.setStateAsync('publish', 'Publish to npm...');
      await helper.publish(destination);

      await this.setStateAsync('ok', `Success register '${packageName}@${version}'.`);
    } catch (e) {
      await this.setStateAsync('error', `Fail: ${e}`);
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
