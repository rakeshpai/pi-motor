pi-motor
========

pi-motor is a simple node.js module to help control dual-half-bridge motor control ICs like the L293 and its variants using the Raspberry Pi's GPIO pins.

```javascript
var Motor = require("pi-motor");

var m = new Motor(7, 11);
m.clockwise(function(err) {
	m.counterclockwise(function(err) {
		m.stop();
	});
});
```

## About

The L293 and similar ICs are among the most common motor drivers for DC motors. If you are planning to pick up a toy RC car and break that apart to make your own hardware on top of it, or if you are building a robot from scratch and need a DC motor in it, chances are you will want to use one of these ICs. Some of the ICs in this family are L293/L293D ([pdf](http://idmax.free.fr/Aide/Stepper/l293.pdf)) and SN754410 ([pdf](http://www.ti.com/lit/ds/symlink/sn754410.pdf)), available in several variations of packaging.

I've been using the L293D IC in my projects, wired up to the Raspberry Pi in the following fashion:

<img src="https://raw.github.com/rakeshpai/pi-motor/master/assets/L293D%20sketch_bb.png" alt="Fritzing connection diagram">

Note that I've provided the 3v3 output from the Pi to the Vcc1 of the IC, and not the 5v from the Pi. Supplying the 5v seemed to cause the IC to draw huge amounts of current, overheating the IC and preventing the Pi from booting up. I guess that's not such a good thing. The 3v3 output from the Pi worked just fine.

Also note that I've hardwired the enable pin to 3v3, rather than using a separate GPIO pin to set this flag. I've seen a lot of people do this, so I did it too. If I'm wrong, please let me know! This module allows you both modes of operation - having the enable pin hardwired, or specified using a GPIO pin. The latter is untested, though there's no reason it shouldn't work.

## Pin configuration

Use the pin-configuration as described at [pi-gpio](https://github.com/rakeshpai/pi-gpio#about-the-pin-configuration). In effect, you should the physical pin numbers as you see on the Pi. That gives you the following pins to use: pins 7, 11, 12, 13, 15, 16, 18 and 22.

## Installation

Follow the installation instructions at [pi-gpio](https://github.com/rakeshpai/pi-gpio#installation) to get set up. Then simply

	npm install pi-motor

That's it!

## Usage

### new Motor(pin1, pin2, [enable])

Create a new instance of a motor.

* ``pin1`` and ``pin2``: The two control pins on the Raspberry Pi that are used as control pins for the motor driver IC. Note that these pins don't need to be explicitly exported before use - it's done internally. Required.
* ``enable``: (Optional) If you intend to drive the enable pin using a GPIO pin of the Pi (as opposed to hard-wiring it to a digital HIGH), you should provide the pin number here.

### motor.clockwise([callback])

Aliased to ``.forward``, ``.left`` and ``.start``.

Rotates the motor in the clockwise direction. Pin1 is set to a digital HIGH, and pin2 is set to digital LOW. If the enable pin was specified, it's set to a digital HIGH. All these pins are first exported so that they are available for use.

* ``callback``: (Optional) Will be called when motor has started moving, ie, when the pin values have been set correctly. The callback might receive an error if something went wrong.

### motor.anticlockwise([callback])

Aliased to ``.backward``, ``.counterclockwise``, ``.reverse``, ``.back`` and ``.right``.

Rotates the motor in the anti-clockwise direction. Pin1 is set to a digital LOW, and pin2 is set to a digital HIGH. If the enable pin was specified, it's set to a digital HIGH. All pins are exported first.

* ``callback``: (Optional) Will be called when the motor has started moving. Again, may receive an error as the first argument.

### motor.stop([callback])

Aliased to ``straight`` and ``reset``.

Stops the motor from rotating. Sets both pin1 and pin2 to digital low. If the enable pin was specified, it's set to a digital low as well. All these pins are then unexported so that they are available for use elsewhere.

* ``callback``: (Optional) Will be called when the motor has stopped moving.

## Misc

* To run tests: ``npm install && npm test`` where you've got the checkout.
* This module was created, ``git push``'ed and ``npm publish``'ed all from the Raspberry Pi! The Pi rocks!
* Built on top of the [pi-gpio](https://github.com/rakeshpai/pi-gpio) module. Check it out!

## License

(The MIT License)

Copyright (c) 2012 Rakesh Pai <rakeshpai@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
