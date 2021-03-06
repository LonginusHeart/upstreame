define(['underscore', 'core/actors/base', 'core/graphics/sprite',
        'core/util/random', 'submersion/util/group', 'submersion/util/layer'],
  function (_, Base, Sprite, Random, Group, Layer) {

    var PLANKTON_COLOR = '#5B5';

    // initialize all possible Plankton Sprites
    var SPRITES = [];
    SPRITES[0] = [ new Sprite([{ x: 0, y: 0, color: PLANKTON_COLOR }]) ];
    SPRITES[1] = [
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 0, y: 1, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 0, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 1, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 1, y: 0, color: PLANKTON_COLOR },
                   { x: 0, y: 1, color: PLANKTON_COLOR } ])
    ];
    SPRITES[2] = [
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 0, y: 1, color: PLANKTON_COLOR },
                   { x: 1, y: 1, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 1, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 0, color: PLANKTON_COLOR },
                   { x: 0, y: 1, color: PLANKTON_COLOR } ]),
      new Sprite([ { x: 0, y: 1, color: PLANKTON_COLOR },
                   { x: 1, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 1, color: PLANKTON_COLOR } ])
    ];
    SPRITES[3] = [
      new Sprite([ { x: 0, y: 0, color: PLANKTON_COLOR },
                   { x: 1, y: 0, color: PLANKTON_COLOR },
                   { x: 0, y: 1, color: PLANKTON_COLOR },
                   { x: 1, y: 1, color: PLANKTON_COLOR } ])
    ];
      
    
    // Scenery actors, used to visualize current and make world more realistic
    //
    // Argument object fields:
    //   center: Center of the object, essentially location in the world
    //   layer: Layer that it occupies in a LayeredCanvas heirarchy
    var Plankton = function (opts) {
      if (opts.layer < Plankton.BASE_PLANKTON_LAYER ||
          opts.layer > Plankton.TOP_PLANKTON_LAYER) {
        throw new Error('Plankton cannot be created on layer ' + opts.layer);
      }

      var size = opts.layer - Plankton.BASE_PLANKTON_LAYER;
      var randIndex = Random.integerWithinRange(0, SPRITES[size].length - 1);
      opts.sprite = SPRITES[size][randIndex];
      opts.group = 'Plankton';
      opts.noncollidables = Group.collect('friendlies');

      Base.call(this, opts);

      this.steps = 0;
    };
    Plankton.prototype = Object.create(Base.prototype);
    Plankton.prototype.constructor = Plankton;

    Plankton.BASE_PLANKTON_LAYER = Layer.nearBackground;
    Plankton.TOP_PLANKTON_LAYER = Layer.frontFocus;
    Plankton.DRIFT_FREQUENCY = 10;
    var SINK_CHANCE = 0.25;
    var HORIZONTAL_DRIFT_FREQUENCY = Plankton.DRIFT_FREQUENCY * 5;

    
    // overloaded Base#_act function
    Plankton.prototype._act = function () {
      if (this.steps === 0) {
        this.move({ x: Random.integerWithinRange(0, 2), y: 1 });
      }
      else if (this.steps%Plankton.DRIFT_FREQUENCY === 0) {
        if (Random.probability(SINK_CHANCE)) this.move({ x: 0, y: 1 });
      }

      this.steps = (this.steps + 1)%HORIZONTAL_DRIFT_FREQUENCY;
    };


    return Plankton;
  }
);
