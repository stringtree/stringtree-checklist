var test = require('tape');
var util = require('util');
var Checklist = require('../index');

test('empty checklist no ticks', function (t) {
  t.plan(3);
  var ck = new Checklist([]);
  var n = 0;
  ck.check(function(err, message) {
    t.error(err, 'empty checklist should immediately succeed');
    t.equal(1, n, 'call each just once');
  }, function(err, message) {
    t.error(err, 'empty checklist should report no unknowns');
    ++n;
  });
});

test('empty checklist with ticks', function (t) {
  t.plan(4);
  var ck = new Checklist([]);
  var n = 0;
  ck.tick('ugh', function(err, message) {
    t.ok(err, 'tick an unknown value should error');
  });
  ck.check(function(err, message) {
    t.ok(err, 'empty checklist with unknown should error');
    t.equal(1, n, 'call each just once');
  }, function(err, message) {
    t.ok(err, 'empty checklist should report unknowns');
    ++n;
  });
});

test('checklist with values but no ticks', function (t) {
  t.plan(5);
  var ck = new Checklist(['ping', 'pong']);
  var n = 0;
  ck.check(function(err, message) {
    t.ok(err, 'checklist with values but no ticks should error');
    t.equal(3, n, 'call each 3 times');
  }, function(err, message) {
    if (n < 2) {
      t.ok(err, 'checklist with values but no ticks should report unticked and unknowns');
    } else {
      t.error(err, 'checklist with values but no ticks should report no unknowns');
    }
    ++n;
  });
});

test('checklist with values and partial ticks', function (t) {
  t.plan(6);
  var ck = new Checklist(['ping', 'pong']);
  var n = 0;
  ck.tick('pong', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.check(function(err, message) {
    t.ok(err, 'checklist with values and partial ticks should error');
    t.equal(3, n, 'call each 3 times');
  }, function(err, message) {
    if (n < 1) {
      t.ok(err, 'checklist with values but no ticks should report unticked and unknowns');
    } else {
      t.error(err, 'checklist with values but no ticks should report values ticked and no unknowns');
    }
    ++n;
  });
});

test('checklist with values and full ticks', function (t) {
  t.plan(7);
  var ck = new Checklist(['ping', 'pong']);
  var n = 0;
  ck.tick('pong', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.tick('ping', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.check(function(err, message) {
    t.error(err, 'checklist with full ticks should succeed');
    t.equal(3, n, 'call each 3 times');
  }, function(err, message) {
    t.error(err, 'checklist with values but no ticks should report values ticked and no unknowns');
    ++n;
  });
});

test('checklist with values and duplicate ticks', function (t) {
  t.plan(8);
  var ck = new Checklist(['ping', 'pong']);
  var n = 0;
  ck.tick('pong', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.tick('ping', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.tick('pong', function(err, message) {
    t.ok(err, 'tick duplicate value should error');
  });
  ck.check(function(err, message) {
    t.ok(err, 'checklist with values and partial ticks should fail');
    t.equal(3, n, 'call each 3 times');
  }, function(err, message) {
    switch(n) {
    case 0:
      t.error(err, 'single-ticked item should succeed');
      break;
    case 1:
      t.ok(err, 'double-ticked item should error');
      break;
    case 2:
      t.error(err, 'duplicate values but no unknowns');
    }
    ++n;
  });
});

test('checklist with values, duplicates and unknowns', function (t) {
  t.plan(9);
  var ck = new Checklist(['ping', 'pong']);
  var n = 0;
  ck.tick('pong', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.tick('ping', function(err, message) {
    t.error(err, 'tick known value should not error');
  });
  ck.tick('pong', function(err, message) {
    t.ok(err, 'tick duplicate value should error');
  });
  ck.tick('pang', function(err, message) {
    t.ok(err, 'tick unknown value should error');
  });
  ck.check(function(err, message) {
    t.ok(err, 'checklist with values and partial ticks should fail');
    t.equal(3, n, 'call each 3 times');
  }, function(err, message) {
    switch(n) {
    case 0:
      t.error(err, 'single-ticked item should succeed');
      break;
    case 1:
      t.ok(err, 'double-ticked item should error');
      break;
    case 2:
      t.ok(err, 'unknown value should error');
    }
    ++n;
  });
});
