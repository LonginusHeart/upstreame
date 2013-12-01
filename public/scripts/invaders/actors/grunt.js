define(['core/graphics/spritearchive', 'invaders/actors/baseinvader',
        'invaders/actors/projectile'],
  function (SpriteArchive, BaseInvader, Projectile) {

    // CONTANTS
    var SPEED = 2;
    var DIAGONAL_SPEED = SPEED/Math.sqrt(2);
    var FIRE_CHANCE = 0.25;


    // Grunt actor, performs simplistic actions with no situational
    // awareness
    //
    // Arguments:
    //   opts: object with the following required fields
    //     group: String group name of the object ['Enemy', 'Player', etc]
    //     layer: Layer that it occupies in a LayeredCanvas heirarchy
    //     noncollidables: Array of strings describing groups with which the new
    //                     instance cannot collide
    //     frameClock: FrameClock object
    //     bounds: Object with four fields: 'topmost', 'bottommost', 'leftmost',
    //             'rightmost' representing the area in which the actor may move
    //   optional fields for the opts param:
    //     onDestroy: extra cleanup that takes place when the actor is destroyed
    var Grunt = function (opts) {
      opts.sprite = SpriteArchive.get('lizard-ship');
      BaseInvader.call(this, opts);

      this.bounds = opts.bounds;
      this.velocity = { x: 0, y: 0 };
      this.frameClock = opts.frameClock;
      this.fireID = undefined;

      var enemy = this;
      this.behaviorID = enemy.frameClock.recurring(function () {
        // randomly select direction in which to move
        if (Math.random() < FIRE_CHANCE) {
          enemy.velocity.x = 0;
          enemy.velocity.y = 0;
          enemy.fire();
        }
        else {
          enemy.velocity.x = Math.floor(Math.random() * 3) - 1;
          enemy.velocity.y = Math.floor(Math.random() * 3) - 1;
        }
      }, 30);
    };
    Grunt.prototype = Object.create(BaseInvader.prototype);
    Grunt.prototype.constructor = Grunt;


    // overloaded BaseInvader.act function
    Grunt.prototype.act = function () {
      // update sprite location
      if (this.velocity.x && this.velocity.y) {
        this.center.x += DIAGONAL_SPEED * this.velocity.x;
        this.center.y += DIAGONAL_SPEED * this.velocity.y;
      }
      else if (this.velocity.x) {
        this.center.x += SPEED * this.velocity.x;
      }
      else {
        this.center.y += SPEED * this.velocity.y;
      }

      // update sprite location to stay within bounds
      if (this.center.x < this.bounds.leftmost) {
        this.center.x = this.bounds.leftmost;
      }
      if (this.center.x > this.bounds.rightmost) {
        this.center.x = this.bounds.rightmost;
      }
      if (this.center.y < this.bounds.topmost) {
        this.center.y = this.bounds.topmost;
      }
      if (this.center.y > this.bounds.bottommost) {
        this.center.y = this.bounds.bottommost;
      }
    };


    // overloaded BaseInvader.collision function
    Grunt.prototype.collision = function () {
      this.destroy();
    };


    // overloaded BaseInvader.destroy function
    Grunt.prototype.destroy = function () {
      if (this.behaviorID) this.frameClock.cancel(this.behaviorID);
      if (this.fireID) this.frameClock.cancel(this.fireID);
      BaseInvader.prototype.destroy.call(this);
    };


    Grunt.prototype.fire = function () {
      var enemy = this;
      enemy.sprite = SpriteArchive.get('lizard-ship-prefire');

      enemy.fireID = enemy.frameClock.schedule(function () {

        enemy.sprite = SpriteArchive.get('lizard-ship-firing');
        new Projectile({
          group: enemy.group,
          sprite: SpriteArchive.get('enemy-ship-laser'),
          center: enemy.center,
          layer: enemy.layer,
          noncollidables: [enemy.group],
          path: function () {
            return { x: this.center.x, y: this.center.y + SPEED*2 };
          }
        });

        enemy.fireID = enemy.frameClock.schedule(function () {

          enemy.sprite = SpriteArchive.get('lizard-ship-prefire');

          enemy.fireID = enemy.frameClock.schedule(function () {

            enemy.sprite = SpriteArchive.get('lizard-ship');
            enemy.fireID = undefined;
          }, 10);
        }, 5);
      }, 10);
    };

    return Grunt;
  }
);