/**
 * Plugin to hook into the "onEnd" esbuild event
 * @param {() => void} callback Post-build callback
 */
const reloadPlugin = callback => ({
  name: "acc-reload",
  setup: build => {
    build.onEnd(callback);
  },
});

module.exports = reloadPlugin;
