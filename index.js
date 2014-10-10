var util = require('util');

function Checklist(expected) {
  this.expected = [];
  this.count = [];
  this.unknown = 0;
  for (var i = 0; i < expected.length; ++i) {
    var value = expected[i];
    this.expected[i] = value;
    this.count[i] = 0;
  }
}

function find(obj) {
  for (var i = 0; i < this.expected.length; ++i) {
    if (JSON.stringify(this.expected[i]) === JSON.stringify(obj)) { //TODO horrible way to compare, anyone know a better one?
      return i;
    }
  }
  return -1;
}
Checklist.prototype.find = find;

function tick(value, callback) {
  var index = this.find(value);
  if (index < 0) {
    ++this.unknown;
    if (callback) {
      callback('Value [' + util.inspect(value) + '] not expected');
    }
  } else {
    var n = ++this.count[index];
    if (n > 1) {
      if (callback) {
        callback('Value [' + util.inspect(value) + '] supplied ' + n + ' times');
      }
    } else {
      if (callback) {
        callback(null, value);
      }
    }
  }
}
Checklist.prototype.tick = tick;

function check(callback, each) {
  var self = this;
  var messages = null;

  function push(message) {
    if (messages) {
      messages += '\n' + message;
    } else {
      messages = message;
    }
    if (each) {
      each(message);
    }
  }

  this.count.forEach(function(n, i) {
    var message;
    if (n > 1) {
      message = 'Value ' + util.inspect(self.expected[i]) + ' supplied ' + n + ' times';
    } else if (0 === n) {
      message = 'Value ' + util.inspect(self.expected[i]) + ' not supplied';
    }
    
    if (message) {
      push(message);
    } else {
      if (each) {
        each(null, 'Value ' + util.inspect(self.expected[i]) + ' OK');
      }
    }
  });

  if (this.unknown > 0) {
    push(0 + this.unknown + ' unknown values were checked');
  } else {
    if (each) {
      each(null, '0 unknown values were checked');
    }
  }

  if (callback) {
    if (messages) {
      callback(messages);
    } else {
      callback(null, 'Checklist OK');
    }
  }
}
Checklist.prototype.check = check;

module.exports = Checklist;