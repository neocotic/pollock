/*
 * Copyright (C) 2017 Alasdair Mercer, !ninja
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

var expect = require('chai').expect;

var pollock = require('../src/pollock');

describe('pollock', function() {
  var TestType;

  beforeEach(function() {
    TestType = function() {};
  });

  it('should be a function', function() {
    expect(pollock).to.be.a('function');
  });

  context('when no options are provided', function() {
    it('should assign abstract instance method to type that throws error', function() {
      pollock(TestType, 'foo');

      var instance = new TestType();

      expect(TestType.foo).to.be.undefined;
      expect(instance.foo).to.be.a('function');
      expect(instance.foo).to.throw(Error, 'TestType#foo abstract method is not implemented');
    });
  });

  context('when "callback" option is specified', function() {
    context('and index is zero', function() {
      it('should assign abstract method to type that invokes first argument with error', function(done) {
        pollock(TestType, 'foo', { callback: 0 });

        var instance = new TestType();

        expect(TestType.foo).to.be.undefined;
        expect(instance.foo).to.be.a('function');

        instance.foo(function(error) {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('TestType#foo abstract method is not implemented');

          done();
        });
      });

      context('and argument is not a function', function() {
        it('should throw an error when abstract method is called', function() {
          pollock(TestType, 'foo', { callback: 0 });

          var instance = new TestType();

          expect(TestType.foo).to.be.undefined;
          expect(instance.foo).to.be.a('function');
          expect(instance.foo.bind(instance, null)).to.throw(Error, 'TestType#foo abstract method is not implemented');
        });
      });
    });

    context('and index is a positive value', function() {
      it('should assign abstract method to type that invokes argument at index with error', function(done) {
        pollock(TestType, 'foo', { callback: 2 });

        var instance = new TestType();

        expect(TestType.foo).to.be.undefined;
        expect(instance.foo).to.be.a('function');

        instance.foo('fu', 'baz', function(error) {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('TestType#foo abstract method is not implemented');

          done();
        });
      });

      context('and argument is not a function', function() {
        it('should throw an error when abstract method is called', function() {
          pollock(TestType, 'foo', { callback: 2 });

          var instance = new TestType();

          expect(TestType.foo).to.be.undefined;
          expect(instance.foo).to.be.a('function');
          expect(instance.foo.bind(instance, 'fu', 'baz', 'fizz')).to.throw(Error,
            'TestType#foo abstract method is not implemented');
        });
      });

      context('and index is a greater than or equal to number of arguments', function() {
        it('should throw an error when abstract method is called', function() {
          pollock(TestType, 'foo', { callback: 2 });

          var instance = new TestType();

          expect(TestType.foo).to.be.undefined;
          expect(instance.foo).to.be.a('function');
          expect(instance.foo.bind(instance, 'fu', 'baz')).to.throw(Error,
            'TestType#foo abstract method is not implemented');
        });
      });
    });

    context('and index is a negative value', function() {
      it('should assign abstract method to type that invokes argument relative to index with error', function(done) {
        pollock(TestType, 'foo', { callback: -1 });

        var instance = new TestType();

        expect(TestType.foo).to.be.undefined;
        expect(instance.foo).to.be.a('function');

        instance.foo('fu', 'baz', function(error) {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('TestType#foo abstract method is not implemented');

          done();
        });
      });

      context('and argument is not a function', function() {
        it('should throw an error when abstract method is called', function() {
          pollock(TestType, 'foo', { callback: -1 });

          var instance = new TestType();

          expect(TestType.foo).to.be.undefined;
          expect(instance.foo).to.be.a('function');
          expect(instance.foo.bind(instance, 'fu', 'baz')).to.throw(Error,
            'TestType#foo abstract method is not implemented');
        });
      });

      context('and index is a greater than or equal to number of arguments (ignoring sign)', function() {
        it('should invoke first argument with error when abstract method is called', function(done) {
          pollock(TestType, 'foo', { callback: -2 });

          var instance = new TestType();

          expect(TestType.foo).to.be.undefined;
          expect(instance.foo).to.be.a('function');

          instance.foo(function(error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal('TestType#foo abstract method is not implemented');

            done();
          });
        });
      });
    });
  });

  context('when "promise" option is enabled', function() {
    it('should assign abstract method to type that returns promise rejected with error', function(done) {
      pollock(TestType, 'foo', { promise: true });

      var instance = new TestType();

      expect(TestType.foo).to.be.undefined;
      expect(instance.foo).to.be.a('function');

      var result = instance.foo();

      expect(result).to.be.a('promise');

      result
        .then(function() {
          done(new Error('Promise should have been rejected'));
        })
        .catch(function(error) {
          expect(error).to.be.an('error');
          expect(error.message).to.equal('TestType#foo abstract method is not implemented');

          done();
        });
    });
  });

  context('when "static" option is enabled', function() {
    it('should assign abstract static method to type that throws error', function() {
      pollock(TestType, 'foo', { static: true });

      var instance = new TestType();

      expect(instance.foo).to.be.undefined;
      expect(TestType.foo).to.be.a('function');
      expect(TestType.foo).to.throw(Error, 'TestType.foo abstract method is not implemented');
    });
  });

  context('when "typeName" option is specified', function() {
    it('should assign abstract method to type that throws error with custom type name', function() {
      pollock(TestType, 'foo', { typeName: 'CustomType' });
      pollock(TestType, 'bar', {
        static: true,
        typeName: 'CustomType'
      });

      var instance = new TestType();

      expect(TestType.foo).to.be.undefined;
      expect(instance.foo).to.be.a('function');
      expect(instance.foo).to.throw(Error, 'CustomType#foo abstract method is not implemented');

      expect(instance.bar).to.be.undefined;
      expect(TestType.bar).to.be.a('function');
      expect(TestType.bar).to.throw(Error, 'CustomType.bar abstract method is not implemented');
    });
  });

  context('when type name cannot be identified', function() {
    it('should assign abstract method to type that throws error with anonymous type name', function() {
      TestType = (function() {
        return function() {};
      }());

      pollock(TestType, 'foo');

      var instance = new TestType();

      expect(TestType.foo).to.be.undefined;
      expect(instance.foo).to.be.a('function');
      expect(instance.foo).to.throw(Error, '<anonymous>#foo abstract method is not implemented');
    });
  });
});
