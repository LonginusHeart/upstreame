define(['underscore', 'core/util/encoder', 'core/util/eventhub'],
  function (_, Encoder, EventHub) {

    // CollisionFrame events emitted:
    // 'collisionframe.resolve': event listeners receive an object with
    //                           'collisionframe' field, emitted on creation
    

    // CollisionFrame object detects collisions on a plane of width x height
    // metapixels
    //
    // Arguments:
    //   dimensions: An object with 'width' and 'height' fields
    var CollisionFrame = function (dimensions) {
      this.dim = _.clone(dimensions);
      this.world = Object.create(null);
      this.collisions = Object.create(null);
      this.elements = Object.create(null);

      EventHub.trigger('collisionframe.resolve', { collisionframe: this });
    };


    // resolves all collisions that have occured within the frame by calling
    // possibleCollision method on each pair of elements reflexively
    CollisionFrame.prototype.resolve = function () {
      _.each(this.collisions, function (v) {
        v[0].possibleCollision(v[1]);
        v[1].possibleCollision(v[0]);
      });
    };


    // set maps an array of pixels to an element object within the world, 
    // tracking any collisions that occur due to that element
    //
    // Arguments:
    //   element: the element object to be included in the frame
    CollisionFrame.prototype.set = function (element) {

      // if element has already been added to this frame, do nothing
      if (this.elements[element.id()]) return;

      // add all pixels to collision frame's world
      _.each(element.pixels(), function (p) {
        // only add on screen elements to collision frame
        if (p.x >= this.dim.width || p.x < 0 || p.y >= this.dim.height ||
            p.y < 0) {
          return;
        }
        var scalar = Encoder.coordToScalar(p, this.dim);

        // if other elements occupy the same pixel, update collisions with the
        // current element
        if (this.world[scalar]) {
          _.each(this.world[scalar], function (a) {
            var key;
            if (a.id() < element.id()) key = a.id() + element.id();
            else key = element.id() + a.id();

            this.collisions[key] = [a, element];
          }, this);
          this.world[scalar].push(element);
        }
        else this.world[scalar] = [element];
      }, this);

      this.elements[element.id()] = true;
    };


    return CollisionFrame;
  }
);
