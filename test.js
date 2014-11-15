/*global describe, it*/

var File = require('./index');
var expect = require('chai').expect;

describe('File', function () {
  describe('constructor:', function () {
    it('can be constructed with an object containing `contents`');
    it('can be constructed with options containing `text`');

    it('can be constructed with another File object');
    it('can be constructed with no path');

    it('errors if constructed with a non-string path');
    it('errors if constructed with something weird in `contents`');
  });

  describe('.contents and .text:', function () {
    it('setting .contents is reflected in .text', function () {
      var file = new File(null, 'hello');
      expect(file._newer).to.equal('text');

      file.contents = new Buffer('goodbye');
      expect(file._newer).to.equal('buffer');

      expect(file.text).to.equal('goodbye');
      
      expect(file._newer).to.be.a('null');
    });

    it('setting .text is reflected in .contents', function () {
      var file = new File(null, new Buffer('hello'));
      expect(file._newer).to.equal('buffer');

      expect(file.text).to.equal('hello');
      expect(file._newer).to.be.a('null');

      file.text += '...';
      expect(file._newer).to.equal('text');

      expect(file.contents.toString()).to.equal('hello...');
    });

    it('.contents and .text can be null', function () {
      // null implies the file's contents haven't been decided yet, as
      // opposed to "" which explicitly means a zero-length file

      var file = new File(null, null);
      expect(file._newer).to.be.a('null');

      file.text = 'hey';
      expect(file._newer).to.equal('text');
      expect(file.contents.toString()).to.equal('hey');
      expect(file._newer).to.be.a('null');

      file.text = null;
      expect(file.contents).to.be.a('null');

      file.text = 'hey';
      expect(file.contents).to.have.length(3);
      file.contents = null;

      expect(file.text).to.be.a('null');
    });


    it('both .contents and .text can be empty buffer/string', function () {
      var file = new File(null, '');

      expect(Buffer.isBuffer(file.contents)).to.equal(true);
      expect(file.contents.length).to.equal(0);

      file = new File(null, new Buffer(''));

      expect(Buffer.isBuffer(file.contents)).to.equal(true);
      expect(file.contents.length).to.equal(0);
    });

    it('both .contents and .text can be false', function () {
      // this is intended to indicate that the file is 'to be deleted'.

      var file = new File(null, false);
      expect(file.contents === false).to.equal(true);
      expect(file.text === false).to.equal(true);

      file.text = 'hey';
      expect(file.contents.toString()).to.equal('hey');
      file.text = false;
      expect(file.contents === false).to.equal(true);

      file.contents = new Buffer('ho');
      expect(file.text).to.equal('ho');
      file.contents = false;
      expect(file._newer).to.equal('buffer');
      expect(file.text).to.equal(false);
    });
  });


  describe('.path and .ext:', function () {
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


  describe('workaround for editing buffer in place:', function () {
    it('can force-sync .text by setting .contents to itself', function () {
      var file = new File(null, 'foo');
      
      file.contents.write('b');
      expect(file.text).to.equal('foo');

      file.contents = file.contents; // the recommended hack
      expect(file.text).to.equal('boo');
    });
  });
});
