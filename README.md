# stringtree-checklist

A simple helper to get round the problem of checking returned collections.

It's a common enough problem, particularly in testing remote and/or asynchronous systems, 
that you wish to assert that some collection of values are returned or supplied. Naive approaches
such as collecting the values followed by a direct comparison of two arrays will work until the
items are returned in a different order. Other approaches might (for example) accidentally ignore unexpected
values, or values which occur more than once. 

This can be a common point at which testing becomes "too hard", leaving key aspects of a system or API untested.

This module implements a 'Checklist' pattern. A Checklist is created by supplying a collection of values, then
during the test each incoming value is 'ticked off' against the list. At any point (commonly when you think the 
incoming values have finished) you can ask the checklist whether it is complete, by the following rules:

* All values have been ticked
* No value has been ticked more than once
* No unexpected values were supplied.

## API

### Constructor
var ck = new Checklist( [ _value_, _value_, ... ] )

The array of values may contain almost anything, but note that (due to a relatively simplistic approach to value equality), 
functions, objects with prototypes, and objects with recursive structure may not work as expected. Stick with
data and you should be OK.

### 'Tick' an incoming value
ck.tick(value, callback(err, value))

The callback is optional, but if provided will be invoked once. If the supplied value is not in the checklist,
or has already been ticked, err will be non-null and contain a descriptive message to that effect. Otherwise err
will be null, and value will contain the supplied value.

### 'Check' the overall checklist
ck.check(all(err, message), each(err, message))

Both callbacks are optional, although the checklist is not very useful if neither is supplied.

'all' will be called once after all entries in the checklist have been evaluated. If any of the above rules have been broken,
err will be non-null and contain a set of messages, separated by newlines, indicating all the failures. If no rules have been
broken, err will be null and message will contain some text to that effect.

'each' will be called once for each expected entry in the order they were given to the constructor. If the entry breaks a rule (i.e. not supplied, or supplied more than once) 
err will contain a descriptive message to that effect, otherwise err will be null and message will confirm that the entry was correct. 

'each' will also be called one additional time to indicate the status of unexpected values. If any unexpected values were supplied,
err will contain a message with a count, otherwise err will be null and message will contain a reassuring confirmation.

## Usage
```js
var Checklist = require('stringtree-checklist');
var ck = new Checklist([ 12, 'wibble', {a:'b'} ]);

ck.tick('wibble');
ck.tick(12);

ck.check(function(err, message) {
  console.log('err: ' + err);
  console.log('message: ' + message);
});
// err: Value { a: 'b' } not supplied
// message: undefined

ck.tick({ a : 'b' });

ck.check(function(err, message) {
  console.log('err: ' + err);
  console.log('message: ' + message);
});
// err: null
// message: Checklist OK
```



### Configuration

None needed, other than supplying a collection of values to the constructor
