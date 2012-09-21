var should = require("should"),
	gpio = require("pi-gpio"),
	async = require("async"),
	Motor = require("../");

describe("Motor", function() {
	var m1;
	it("should throw if pins are not specified", function() {
		var finished = false;
		try {
			var m1 = new Motor;
		} catch(e) {
			e.should.exist;
			finished = true;
		}

		finished.should.equal(true);
	});

	it("should rotate the motor clockwise", function(done) {
		m1 = new Motor(7, 11);
		m1.clockwise(function(err) {
			should.not.exist(err);

			async.forEach([7, 11], function(pin, done) {
				gpio.getDirection(pin, function(err, direction) {
					should.not.exist(err);
					direction.should.equal("out");
					done();
				});
			}, function() {
				async.parallel([
					function(done) {
						gpio.read(7, function(err, value) {
							should.not.exist(err);
							value.should.equal(1);
							done();
						});
					},
					function(done) {
						gpio.read(11, function(err, value) {
							should.not.exist(err);
							value.should.equal(0);
							done();
						});
					}
				], done);
			});
		});
	});

	it("should stop the motor and unexport pins", function(done) {
		m1.stop(function(err) {
			should.not.exist(err);

			async.forEach([7, 11], function(pin, done) {
				gpio.getDirection(pin, function(err, value) {
					err.should.exist;
					err.errno.should.equal(34);
					done();
				});
			}, done);
		});
	});

	it("should rotate the motor anticlockwise", function(done) {
		m1.anticlockwise(function(err) {
			should.not.exist(err);

			async.forEach([7, 11], function(pin, done) {
				gpio.getDirection(pin, function(err, direction) {
					should.not.exist(err);
					direction.should.equal("out");
					done();
				});
			}, function() {
				async.parallel([
					function(done) {
						gpio.read(7, function(err, value) {
							should.not.exist(err);
							value.should.equal(0);
							done();
						});
					},
					function(done) {
						gpio.read(11, function(err, value) {
							should.not.exist(err);
							value.should.equal(1);
							done();
						});
					}
				], function() {
					m1.stop();
					done();
				});
			});
		});
	});
});