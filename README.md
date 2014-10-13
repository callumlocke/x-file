# x-file

This is a constructor for virtual file objects.

It constructs an object with `.path` and `.contents` properties. But it also has a dynamic `.string` property for the common case of modifying the contents as a UTF-8 string over and over.

The `.string` and `.content` properties automatically stay in sync, and they do this lazily. If you make several changes to the `.string` during a build process, the `.contents` will only be updated when you next attempt to read it.

It also has an `.ext` property that you can read and write, and `.path` will automatically reflect it.


## usage

```js
var File = require('x-file');

var file = new File('some/imaginary/file.txt', 'hello');

file.contents.toString(); // "hello"
file.ext; // ".txt";

file.string += ' world';
file.contents.toString(); // "hello world"

file.contents = new Buffer('bye');
file.string; // "bye"
file.length; // 3

file.ext = '.foo';
file.path; // "some/imaginary/file.foo"
```

Note that calling `.write()` or `.fill()` to edit the buffer *in place* will not be reflected in `.string`, because it won't trigger the `.contents` setter. If you need to work around this, you can just set `file.contents = file.contents` after editing the buffer in place.


## licence

MIT
