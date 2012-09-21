var gpio = require("pi-gpio"),
	async = require("async");

var Motor = function(pin1, pin2, enable) {
	this._pin1 = parseInt(pin1, 10);
	this._pin2 = parseInt(pin2, 10);
	this._enable = enable?parseInt(enable, 10):null;

	if(isNaN(this._pin1) || isNaN(this._pin2) || (this._enable && isNaN(this._enable))) {
		throw new Error("The pin numbers provided are not valid");
	}
};

Motor.prototype._exportPins = function(done) {
	var self = this;
	async.parallel([
		function(done) { gpio.open(self._pin1, done); },
		function(done) { gpio.open(self._pin2, done); },
		function(done) {
			if(self._enable) {
				gpio.open(self._enable, "output", done);
			} else {
				done();
			}
		}
	], done);
}

Motor.prototype._unexportPins = function(done) {
	var self = this;
	async.parallel([
		function(done) { gpio.close(self._pin1, done); },
		function(done) { gpio.close(self._pin2, done); },
		function(done) {
			if(self._enable) {
				gpio.close(self._enable, done);
			} else {
				done();
			}
		}
	], done);
}

Motor.prototype.clockwise = function(done) {
	var self = this;
	this._exportPins(function(err) {
		if(err) console.log(err);
		async.parallel([
			function(done) { gpio.write(self._pin1, 1, done); },
			function(done) { gpio.write(self._pin2, 0, done); }
		], done);
	});
}

Motor.prototype.anticlockwise = function(done) {
	var self = this;
	this._exportPins(function(err) {
		if(err) console.log(err);
		async.parallel([
			function(done) { gpio.write(self._pin1, 0, done); },
			function(done) { gpio.write(self._pin2, 1, done); }
		], done);
	});
}

Motor.prototype.stop = function(done) {
	var self = this;
	async.parallel([
		function(done) { gpio.write(self._pin1, 0, done); },
		function(done) { gpio.write(self._pin2, 0, done); }
	], function() { self._unexportPins(done); });
};

["forward", "left", "start"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.clockwise; });
["backward", "counterclockwise", "reverse", "back", "right"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.anticlockwise; });
["straight", "reset"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.stop; });

module.exports = Motor;