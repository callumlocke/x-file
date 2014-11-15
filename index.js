'use strict';


function File(path, contents) {
  // allow constructing with an object (perhaps another File instance)
  if (path && typeof path === 'object') {
    var options = path;
    // console.log(path);
    contents = options.contents;

    if (options.contents != null) contents = options.contents;
    else if (options.text != null) contents = options.text;

    path = options.path;
  }

  if (path != null && typeof path !== 'string')
    throw new TypeError('Expected path to be string or null/undefined');

  this.path = path || null;

  if (Buffer.isBuffer(contents)) {
    this._buffer = contents;
    this._newer = 'buffer';
  }
  else if (typeof contents === 'string') {
    this._text = contents;
    this._newer = 'text';
  }
  else if (contents === false) {
    this._text = false;
    this._buffer = false;
    this._newer = null;
  }
  else if (contents != null) {
    // console.log('WEIRD CONTENTS', arguments);
    throw new TypeError('Expected contents to be provided as a buffer, string, false or null.');
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
    'text: ' + (typeof this.text === 'string' ? JSON.stringify(this.text.substring(0,50)) : this.text)
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
    if (this._newer === 'text') {
      if (this._text == null) this._buffer = null;
      else if (this._text === false) this._buffer = false;
      else this._buffer = new Buffer(this._text);

      this._newer = null;
    }
    
    if (this._buffer == null) return null;
    return this._buffer;
  },

  set: function (value) {
    if (value != null && value !== false && !Buffer.isBuffer(value))
      throw new TypeError('Cannot set property "contents" to a non-buffer.');

    this._buffer = value;
    this._newer = 'buffer';
  }
});


Object.defineProperty(File.prototype, 'text', {
  get: function () {
    if (this._newer === 'buffer') {
      if (this._buffer == null) this._text = null;
      else if (this._buffer === false) this._text = false;
      else this._text = this._buffer.toString();
      this._newer = null;
    }

    if (this._text == null) return null;
    return this._text;
  },

  set: function (value) {
    if (value != null && value !== false && typeof value !== 'string')
      throw new TypeError('Expected "text" to be a string or null; was ' + typeof value);

    this._text = value;
    this._newer = 'text';
  }
});


Object.defineProperty(File.prototype, 'ext', {
  get: function () {
    return this.path.substr((~-this.path.lastIndexOf(".") >>> 0) + 1);
  },

  set: function (value) {
    if (value != null) {
      if (typeof value !== 'string') throw new TypeError('Expected string');
      if (value !== '') {
        if (value.charAt(0) !== '.') throw new Error('file.ext must begin with a dot');
        if (value.length > 10) throw new Error('file.ext too long');
        if (value.indexOf(' ') > -1) throw new Error('file.ext cannot contain spaces');
      }
    }

    var dotIndex = this.path.lastIndexOf('.');

    if (dotIndex === -1) this.path += value;
    else this.path = this.path.substring(0, dotIndex) + value;
  }
});


// error on common mistakes to avoid hard-to-debug issues
['buffer', 'string', 'extension'].forEach(function (name) {
  var fn = function () {
    throw new Error('Invalid property name: "' + name + '"');
  };

  Object.defineProperty(File.prototype, name, {get: fn, set: fn});
});


module.exports = File;
