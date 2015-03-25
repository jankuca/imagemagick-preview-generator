var os = require('os');
var path = require('path');


var IM_DIRECTORY = path.resolve(__dirname, '..', 'imagemagick');


/**
 * @constructor
 * @param {ChildProcessApi} child_process A child process API implementation.
 * @param {string} platform_id A platform ID (darwin, linux, win32).
 */
function PreviewGenerator(child_process, platform_id) {
  this.$child_process = child_process || require('child_process');

  this._platform_id = platform_id || global.process.platform;
  this._im_dirname = path.join(IM_DIRECTORY, this._platform_id);
};


PreviewGenerator.prototype.createPreview = function (
    image_filename, preview_filename, callback) {
  var executable = path.join(this._im_dirname, 'bin', 'convert')
  var cmd = [
    '"' + executable + '"',
    '"' + image_filename + '[0]"',
    '"' + preview_filename + '"'
  ].join(' ');

  var options = {
    env: {
      'MAGICK_HOME': this._im_dirname,
      'DYLD_LIBRARY_PATH': path.join(this._im_dirname, 'lib')
    }
  };

  this.$child_process.exec(cmd, options, function (err, stdout, stderr) {
    callback(err)
  });
};


module.exports = PreviewGenerator;
