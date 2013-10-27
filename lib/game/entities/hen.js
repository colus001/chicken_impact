ig.module(
  'game.entities.hen'
)
.requires(
  'impact.entity',

  'game.entities.egg'
)
.defines(function() {

  EntityHen = ig.Entity.extend({

    size: { x: 22, y: 22 },
    offset: { x: 5, y: 5 },
    health: 70,
    state: [ 'idle', 'up', 'down', 'left', 'right'],
    timer: 0,
    interval: 300,

    animSheet: new ig.AnimationSheet('media/chickens/chicken_white_32x32.png', 32, 32),

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 0.1, [0]);
      this.addAnim('down', 0.1, [0, 1, 2, 1]);
      this.addAnim('left', 0.1, [3, 4, 5, 4]);
      this.addAnim('right', 0.1, [6, 7, 8, 7]);
      this.addAnim('up', 0.1, [9, 10, 11, 10]);
    },

    update: function() {
      this.parent();
      this.timer++;

      var random = Math.floor(Math.random()*5);
      var current_state = this.state[random];

      // 0.5초에 한번씩 실행
      if ( this.timer % 30 === 0 ) {
        if ( current_state == 'up' ) {
          this.vel.y = -100;
          this.currentAnim = this.anims.up;
        } else if ( current_state == 'down' ) {
          this.vel.y = 100;
          this.currentAnim = this.anims.down;
        } else if ( current_state == 'left' ) {
          this.vel.x = -100;
          this.currentAnim = this.anims.left;
        } else if ( current_state == 'right' ) {
          this.vel.x = 100;
          this.currentAnim = this.anims.right;
        } else {
          this.vel.y = 0;
          this.vel.x = 0;
          this.currentAnim = this.anims.idle;
        }
      }

      // 1초에 한번씩 실행
      if ( this.timer % 60 === 0 ) {
        this.receiveDamage(1);
      }

      if ( this.timer % this.interval === 0 ) {
        this.layEgg();
      }

    },

    layEgg: function() {
      var roosters = ig.game.getEntitiesByType(EntityRooster);
      var breedablesArray = [];

      for ( var i in roosters ) {
        var rooster = roosters[i];
        if ( roosters[i].readyToBreed === true && breedablesArray.length < 3 ) {
          breedablesArray.push(i);
        }
      }

      // 3마리 이상이면 유정알을 낳는다.
      if ( breedablesArray.length >= 3 ) {
        for ( var j in breedablesArray ) {
          roosters[j].readyToBreed = false;
        }

        if ( GameInfo.live_eggs+GameInfo.eggs < GameInfo.basket_volume[GameInfo.basket_level] ) {
          GameInfo.live_eggs++;
          ig.game.spawnEntity(EntityEggLive, this.pos.x, this.pos.y);
        } else {
          ig.game.spawnEntity(EntityEggBroken, this.pos.x, this.pos.y);
        }
      } else {
        if ( GameInfo.live_eggs+GameInfo.eggs < GameInfo.basket_volume[GameInfo.basket_level] ) {
          GameInfo.eggs++;
          ig.game.spawnEntity(EntityEgg, this.pos.x, this.pos.y);
        } else {
          console.log('EGG BROKEN');
          ig.game.spawnEntity(EntityEggBroken, this.pos.x, this.pos.y);
        }
      }

    },

    kill: function() {
      this.parent();
      GameInfo.quality -= parseInt(GameInfo.quality*0.1, 10);
      console.log('SOUNDS');
    }

  });

});