import plugin from '../plugin.json';

const { exec } = require('child_process');
const path = require('path');

class AcodePlugin {

  async init() {
    // plugin initialisation
    console.log('Android Build Tools Plugin initialized');

    // Example: Run a Gradle task when the plugin is initialized
    this.runGradleTask('build', (output) => {
      console.log('Build output:', output);
    });
  }

  async destroy() {
    // plugin clean up
    console.log('Android Build Tools Plugin cleaned up');
  }

  runGradleTask(task, callback) {
    const gradlePath = path.join(process.cwd(), 'gradlew');
    const command = `${gradlePath} ${task}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
      callback(stdout);
    });
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}

module.exports = {
  initPlugin: acodePlugin.init,
  destroyPlugin: acodePlugin.destroy
};
