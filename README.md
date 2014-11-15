# x-file

[![NPM version](https://badge.fury.io/js/x-file.png)](https://npmjs.org/package/x-file)
[![Build status](https://travis-ci.org/callumlocke/x-file.svg)](https://travis-ci.org/callumlocke/x-file)

This is a constructor for virtual file objects. It's intended for use in incremental build systems, where files in a destination directory get granularly created/edited/deleted depending on decisions made in the build process. An x-file instance is essentially a record of what that decision is for a single build action on one file.

Instantiate it with a path and some contents:

```js
var File = require('x-file');

var file = new File('some/imaginary/file.txt', 'hello');
```

The `.path` property can be a string or null.

A file's `.contents` property must be one of three types:

- a `Buffer` – simply, the contents you intend to be written to disk (at the end of the build process)
- `false` – to be interpreted as an instruction to delete this file from whatever destination directory
- `null` – contents not decided yet, or an explicit instruction *not* to write/delete anything at the given path.


It constructs an object with `.path` and `.contents` properties. But it also has a dynamic `.text` property for the common case of modifying the contents as a UTF-8 string over and over.

The `.text` and `.contents` properties automatically stay in sync, and they do this **lazily** in order to reduce work. If you make several changes to the `.text` during a build process, the `.contents` will only be updated when you next attempt to read it.

It also has an `.ext` property that you can read and write, and `.path` will automatically reflect it.


## usage

```js
var File = require('x-file');

var file = new File('some/imaginary/file.txt', 'hello');

file.contents.toString(); // "hello"
file.ext; // ".txt";

file.text += ' world';
file.contents.toString(); // "hello world"

file.contents = new Buffer('bye');
file.text; // "bye"
file.length; // 3

file.ext = '.foo';
file.path; // "some/imaginary/file.foo"
```

Note that calling `.write()` or `.fill()` to edit the buffer *in place* will not be reflected in `.text`, because it won't trigger the `.contents` setter. If you need to work around this, you can set `file.contents = file.contents` after editing the buffer in place, to trigger the setter.


### properties

- `.contents` - may be a Buffer, `false` or `null`. Recommended interpretation of values:
  - a buffer means that when this file is 'output' somehow (e.g. saved to disk), this buffer is what should be written.
  - `false` means that this file object is really a 'to be deleted' instruction; i.e. if the final stage of this build system requires
  - `null`
  - the recommended interpretation is that `null` means contents are undecided, or that they should not be changed (compared to some previous build).
- `.text` – the parallel to `.contents`. May be a string, `false` or `null`. This property is automatically kept in sync with `.contents`.

## licence

MIT
