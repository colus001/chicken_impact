ig.module(
  'game.entities.rooster'
)
.requires(
  'impact.entity'
)
.defines(function() {

  EntityRooster = ig.Entity.extend({

    size: { x: 22, y: 22 },
    offset: { x: 5, y: 5 },
    health: 50,
    state: [ 'idle', 'up', 'down', 'left', 'right'],
    timer: 0,
    interval: 300,

    readyToBreed: true,
    readyToBreedTimer: 0,

    animSheet: new ig.AnimationSheet('media/chickens/chicken_red_32x32.png', 32, 32),

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

      if ( this.readyToBreed === false ) {
        this.readyToBreedTimer++;
      }

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

      // 10초에 한번씩 실행
      if ( this.readyToBreedTimer % this.interval === 0 ) {
        this.readyToBreed = true;
      }

    },

    kill: function() {
      this.parent();
      GameInfo.quality -= parseInt(GameInfo.quality*0.1, 10);
      console.log('SOUNDS');
    }

  });

});