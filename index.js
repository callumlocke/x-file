'use strict';


function File(path, contents) {
  this.path = path || null;

  if (Buffer.isBuffer(contents)) {
    this._buffer = contents;
    this._newer = 'buffer';
  }
  else if (typeof contents === 'string') {
    this._string = contents;
    this._newer = 'string';
  }
  else if (contents === false) {
    this._string = false;
    this._buffer = false;
    this._newer = null;
  }
  else if (contents != null) {
    throw new TypeError('Expectd contents to be a buffer or string.');
  }
  else {
    this._newer = null;
  }
}


File.prototype.inspect = function () {
  var info = [
    'path: ' + JSON.stringify(this.path),
    'length: ' + this.length,
    '_newer: ' + this._newer,
    'string: ' + (this.string ? JSON.stringify(this.string.substring(0,50)) : this.string)
  ];

  return '<File ' + info.join(', ') + '>';
};


Object.defineProperty(File.prototype, 'length', {
  get: function () {
    if (Buffer.isBuffer(this.contents))
      return this.contents.length;
    return null;
  },

  set: function () {
    throw new Error('You cannot set the .length property directly.');
  }
});


Object.defineProperty(File.prototype, 'contents', {
  get: function () {
    if (this._newer === 'string') {
      if (this._string == null) this._buffer = null;
      else if (this._string === false) this._buffer = false;
      else this._buffer = new Buffer(this._string);

      this._newer = null;
    }
    
    if (this._buffer == null) return null;
    return this._buffer;
  },

  set: function (newBuffer) {
    this._buffer = newBuffer;
    this._newer = 'buffer';
  }
});


Object.defineProperty(File.prototype, 'string', {
  get: function () {
    if (this._newer === 'buffer') {
      if (this._buffer == null) this._string = null;
      else if (this._buffer === false) this._string = false;
      else this._string = this._buffer.toString();
      this._newer = null;
    }

    if (this._string == null) return null;
    return this._string;
  },

  set: function (newString) {
    this._string = newString;
    this._newer = 'string';
  }
});



Object.defineProperty(File.prototype, 'ext', {
  get: function () {
    return this.path.substr((~-this.path.lastIndexOf(".") >>> 0) + 2);
  },

  set: function (newExt) {
    if (newExt && newExt.charAt(0) !== '.')
      throw new Error('file.ext must begin with a dot');

    var dotIndex = this.path.lastIndexOf('.');

    if (dotIndex === -1) this.path += newExt;
    else this.path = this.path.substring(0, dotIndex) + newExt;
  }
});




Object.defineProperty(File.prototype, 'buffer', {
  get: function () {
    throw new Error('There is no property named "buffer". Use "contents".');
  },

  set: function (newBuffer) {
    throw new Error('There is no property named "buffer". Use "contents".');
  }
});



module.exports = File;
