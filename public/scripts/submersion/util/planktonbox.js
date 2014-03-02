define(['underscore', 'core/util/frame', 'core/util/subscriber',
        'submersion/actors/plankton', 'submersion/util/layer'],
  function (_, Frame, Subscriber, Plankton, Layer) {

    var INITIAL_PLANKTON_DENSITY = 0.0001;
    var MAXIMUM_PLANKTON_DENSITY = 0.0003;
    var MINIMUM_PLANKTON_DENSITY = 0.00005;
    var PLANKTON_DENSITY_STEP = 0.00005;

    // PlanktonBox manages an area of plankton, destroying any that leave
    // the enclosed area and ensuring a constant density of plankton within
    // the box
    //
    // Argument object with fields:
    //   dimensions: object with 'width' and 'height' fields
    //   origin: object with 'x' and 'y' fields
    var PlanktonBox = function (opts) {
      Frame.call(this, opts.dimensions, opts.origin);
      Subscriber.call(this);
      this.density = INITIAL_PLANKTON_DENSITY;
      this.step = 0;
      this.prevOrigin = _.clone(opts.origin);

      var box = this;
      this.register('actor.move', function (params) {
        if (params.actor instanceof Plankton && !box.contains(params.actor)) {
          params.actor.destroy();
        }
      });
      this.register('world.step', function () {
        box.step = (box.step + 1) % Plankton.DRIFT_FREQUENCY;
        if (box.step === 0) box.repopulate();
      });

      for (var i=this.origin.x; i<this.origin.x + this.dim.width; i++) {
        for (var j=this.origin.y; j<this.origin.y + this.dim.height; j++) {
          if (Math.random() < this.density) {
            new Plankton({
              center: { x: i, y: j },
              layer: Layer.random(Plankton.BASE_PLANKTON_LAYER,
                                  Plankton.TOP_PLANKTON_LAYER)
            });
          }
        }
      }
    };
    _.extend(PlanktonBox.prototype, Frame.prototype, Subscriber.prototype);
    PlanktonBox.prototype.constructor = PlanktonBox;


    // repopulate generates new plankton in the area that the frame has
    // moved since last repopulation
    PlanktonBox.prototype.repopulate = function () {
      var posDiff = { x: this.prevOrigin.x - this.origin.x,
                      y: this.prevOrigin.y - this.origin.y };
      this.prevOrigin = _.clone(this.origin);

      var range = {};
      if (posDiff.x >= 0) {
        range.x = { from: this.origin.x,
                    to: this.origin.x + Math.min(this.dim.width, posDiff.x) };
      }
      else {
        range.x = { from: this.origin.x +
                          Math.max(0, this.dim.width + posDiff.x),
                    to: this.origin.x + this.dim.width };
      }
      if (posDiff.y > 0) {
        range.y = { from: this.origin.y,
                    to: this.origin.y + Math.min(this.dim.height,
                                                 posDiff.y) };
      }
      else if (posDiff.y < 0) {
        range.y = { from: this.origin.y +
                          Math.max(0, this.dim.height + posDiff.y),
                    to: this.origin.y + this.dim.height };
      }
      else {
        range.y = { from: this.origin.y, to: this.origin.y + 1 };
      }

      for (var i=this.origin.x; i<this.origin.x + this.dim.width; i++) {
        for (var j=range.y.from; j<range.y.to; j++) {
          if (Math.random() < this.density) {
            new Plankton({
              center: { x: i, y: j },
              layer: Layer.random(Plankton.BASE_PLANKTON_LAYER,
                                  Plankton.TOP_PLANKTON_LAYER)
            });
          }
        }
      }

      if (posDiff.y >= 0) {
        range.y.from = range.y.to;
        range.y.to = this.origin.y + this.dim.height;
      }
      else {
        range.y.to = range.y.from;
        range.y.from = this.origin.y;
      }

      for (var i=range.x.from; i<range.x.to; i++) {
        for (var j=range.y.from; j<range.y.to; j++) {
          if (Math.random() < this.density) {
            new Plankton({
              center: { x: i, y: j },
              layer: Layer.random(Plankton.BASE_PLANKTON_LAYER,
                                  Plankton.TOP_PLANKTON_LAYER)
            });
          }
        }
      }
    };


    // stepDensity modifies the density of the plankton field by discrete
    // increments
    //
    // Arguments:
    //   steps: Integer, positive or negative, change in density steps
    PlanktonBox.prototype.stepDensity = function (steps) {
      var proposed = this.density + steps * PLANKTON_DENSITY_STEP;
      this.density = Math.min(Math.max(MINIMUM_PLANKTON_DENSITY, proposed),
                              MAXIMUM_PLANKTON_DENSITY);
    };


    return PlanktonBox;
  }
);