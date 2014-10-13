/*global describe, it*/

var File = require('./index');
var expect = require('chai').expect;

describe('File', function () {

  describe('.contents and .string', function () {
    it('setting .contents is reflected in .string', function () {
      var file = new File(null, 'hello');
      expect(file._newer).to.equal('string');

      file.contents = new Buffer('goodbye');
      expect(file._newer).to.equal('buffer');

      expect(file.string).to.equal('goodbye');
      
      expect(file._newer).to.be.a('null');
    });

    it('setting .string is reflected in .contents', function () {
      var file = new File(null, new Buffer('hello'));
      expect(file._newer).to.equal('buffer');

      expect(file.string).to.equal('hello');
      expect(file._newer).to.be.a('null');

      file.string += '...';
      expect(file._newer).to.equal('string');

      expect(file.contents.toString()).to.equal('hello...');
    });

    it('.contents and .string can be null', function () {
      // null implies the file's contents haven't been decided yet, as
      // opposed to "" which explicitly means a zero-length file

      var file = new File(null, null);
      expect(file._newer).to.be.a('null');

      file.string = 'hey';
      expect(file._newer).to.equal('string');
      expect(file.contents.toString()).to.equal('hey');
      expect(file._newer).to.be.a('null');

      file.string = null;
      expect(file.contents).to.be.a('null');

      file.string = 'hey';
      expect(file.contents).to.have.length(3);
      file.contents = null;

      expect(file.string).to.be.a('null');
    });


    it('.contents and .string can be empty buffer/string', function () {
      var file = new File(null, '');

      expect(Buffer.isBuffer(file.contents)).to.equal(true);
      expect(file.contents.length).to.equal(0);
    });

    it('.contents and .string can be false', function () {
      // this is intended to indicate that the file is 'to be deleted'.

      var file = new File(null, false);
      expect(file.contents === false).to.equal(true);
      expect(file.string === false).to.equal(true);

      file.string = 'hey';
      expect(file.contents.toString()).to.equal('hey');
      file.string = false;
      expect(file.contents === false).to.equal(true);

      file.contents = new Buffer('ho');
      expect(file.string).to.equal('ho');
      file.contents = false;
      expect(file._newer).to.equal('buffer');
      expect(file.string).to.equal(false);
    });
  });


  describe('.path and .ext', function () {
    it('can change the path\'s extension', function () {
      var file = new File('some/thing.scss');
      expect(file.path).to.equal('some/thing.scss');

      file.ext = '.css';
      expect(file.path).to.equal('some/thing.css');
    });

    it('can add an extension to a path that doesn\'t have one', function () {
      var file = new File('some/thing');
      expect(file.path).to.equal('some/thing');

      file.ext = '.css';
      expect(file.path).to.equal('some/thing.css');
    });

    it('can be set to empty to remove the extension', function () {
      var file = new File('some/thing.css');

      file.ext = '';
      expect(file.path).to.equal('some/thing');
    });
  });


  describe('workaround for editing buffer in place', function () {
    it('can force-sync the string by setting the buffer to itself', function () {
      var file = new File(null, 'foo');
      
      file.contents.write('b');
      expect(file.string).to.equal('foo');

      file.contents = file.contents;
      expect(file.string).to.equal('boo');
    });
  });
});
