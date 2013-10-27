ig.module(
  'game.entities.egg'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityEgg = ig.Entity.extend({

    animSheet: new ig.AnimationSheet('media/eggs/eggs_32x32.png', 32, 32),
    target: { x: 590, y: 590 },
    collides: ig.Entity.COLLIDES.NEVER,
    distance: { x: 0, y: 0 },
    index: 0,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 0.1, [21, 22, 23]);
      this.distance.x = this.target.x-this.pos.x;
      this.distance.y = this.target.y-this.pos.y;
    },

    update: function() {
      this.parent();

      this.currentAnim = this.anims.idle;

      if ( this.pos.x < this.target.x ) {
        this.pos.x += this.distance.x/120*this.index/3;
      }

      if ( this.pos.y < this.target.y ) {
        this.pos.y += this.distance.y/120*this.index/3;
      }

      this.index++;
      if ( this.pos.x >= this.target.x && this.pos.y >= this.target.y ) {
        this.kill();
      }

    }

  });

  EntityEggLive = ig.Entity.extend({

    animSheet: new ig.AnimationSheet('media/eggs/eggs_32x32.png', 32, 32),
    target: { x: 590, y: 590 },
    collides: ig.Entity.COLLIDES.NEVER,
    distance: { x: 0, y: 0 },
    index: 0,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 0.1, [24, 25, 26]);
      this.distance.x = this.target.x-this.pos.x;
      this.distance.y = this.target.y-this.pos.y;
    },

    update: function() {
      this.parent();

      this.currentAnim = this.anims.idle;

      if ( this.pos.x < this.target.x ) {
        this.pos.x += this.distance.x/120*this.index/3;
      }

      if ( this.pos.y < this.target.y ) {
        this.pos.y += this.distance.y/120*this.index/3;
      }

      this.index++;
      if ( this.pos.x >= this.target.x && this.pos.y >= this.target.y ) {
        this.kill();
      }

    }

  });

  EntityEggBroken = ig.Entity.extend({

    animSheet: new ig.AnimationSheet('media/eggs/eggs_32x32.png', 32, 32),
    target: { x: 590, y: 590 },
    collides: ig.Entity.COLLIDES.NEVER,
    distance: { x: 0, y: 0 },
    index: 0,

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 0.1, [0, 1, 2]);
      this.distance.x = this.target.x-this.pos.x;
      this.distance.y = this.target.y-this.pos.y;
    },

    update: function() {
      this.parent();

      this.currentAnim = this.anims.idle;

      if ( this.pos.x > -this.target.x - 100 ) {
        this.pos.x -= this.distance.x/120*this.index/3;
      }

      if ( this.pos.y > -this.target.y - 100 ) {
        this.pos.y -= this.distance.y/120*this.index/3;
      }

      this.index++;
      if ( this.pos.x <= -this.target.x && this.pos.y <= -this.target.y ) {
        this.kill();
      }

    }

  });
});