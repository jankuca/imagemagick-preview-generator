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
  this._im_dirname = null;
  if ([ 'darwin', 'win32' ].indexOf(this._platform_id) !== -1) {
    this._im_dirname = path.join(IM_DIRECTORY, this._platform_id);
  }
};


PreviewGenerator.prototype.createPreview = function (
    image_filename, preview_filename, callback) {
  var executable = 'convert';
  if (this._im_dirname) {
    executable = path.join(this._im_dirname, executable);
  }

  var cmd = [
    '"' + executable + '"',
    '"' + image_filename + '[0]"',
    '"' + preview_filename + '"'
  ].join(' ');

  this.$child_process.exec(cmd, null, function (err, stdout, stderr) {
    callback(err)
  });
};


PreviewGenerator.prototype.createTemporaryPreview = function (
    image_filename, format, callback) {
  var tmpdir = os.tmpdir();
  var basename = 'preview-' + Date.now() + '-' + Math.random() + '.' + format;
  var preview_filename = path.join(tmpdir, basename);

  this.createPreview(image_filename, preview_filename, function (err) {
    if (err) {
      return callback(err, null);
    }
    callback(null, preview_filename);
  });
};


module.exports = PreviewGenerator;
