Movable.js
========

#### presentation ####

A micro library to allow html element to have a "Movable" behavior.
Use CSS3 transform3d to have smooth trasitions.

### Usage ###

Simple as ...

```html
var s = {};
movable.apply( s );
```

By default, Movable will attach a new div element to the body.
You can change that with the options:

```html
movable.set({
    add_data_to: 'sprite',          // to add the Movable properties & methods to another object
    container: ''                   // the container of all movable objects
});
```

After that, you have a bunch of methods to move your element around:

`position( x, y )`

To set the 2d position (no animation)

`rotation( r )`

To set the rotation in degree (no animation)

`scale( s )`

To scale the element. Original size is 1 (no animation)

`move_to( x, y, duration, easing )`

To move to the 2d position.
Duration is in milliseconds
Easing is in ['linear', 'ease-in', 'ease-out', 'ease-in-out'];

`transform( rotation, scale, duration, easing )`

To transform the angle and/or the scale

`animation( x, y, rotation, scale, duration, easing)`

To move and transform (equal move_to and transform in sync) 

`direction_to( x, y, speed )`

To go to a direction. Only stop when direction_stop() occure.

`direction_stop()`

To stop the direction animation.


**All methods are chainables **