// 현재 돌아가는 걸 확인하려면 bg / ctrl-z 등을 확인하기

ig.module(
  'game.main'
  )
.requires(
  'impact.game',
  'impact.font',

  'plugins.button',

  'game.entities.hen',
  'game.entities.rooster',

  'game.levels.level1',
  'game.levels.level2',
  'game.levels.level3',
  'game.levels.level4',
  'game.levels.level5',
  'game.levels.level6',
  'game.levels.level7',
  'game.levels.level8',
  'game.levels.level9',
  'game.levels.level10'
  )
.defines(function(){

  GameInfo = new function () {
   this.eggs = 0;
   this.live_eggs = 0;
   this.level = 1;
   this.quality = 0;
   this.quality_level = 1;
   this.wallet = 1000;

   this.basket_level = 0;
   this.maximum_chicken_level = 0;
   this.feed = 10;

   this.maximum_number_of_chickens = [ 5, 9, 15, 23, 33, 45, 59, 75, 93, 110 ];
   this.basket_volume = [ 5, 9, 15, 23, 33, 45, 59, 75, 93 ];
   this.price  = {
      egg: [ 83, 616, 1278, 2237, 3375, 3825 ],
      hen: 300,
      rooster: 150,
      feed: 600,
      level: [ 0, 5000, 18500, 41500, 84400, 151900, 264000, 414000, 627900, 924900 ],
      basket: [ 0, 3000, 16500, 37200, 66900, 107400, 172300, 277300, 416800 ]
    };
  };

  MyGame = ig.Game.extend({

    // Load a font
    smallFont: new ig.Font( 'media/apple.font.png' ),
    whiteSmallFont: new ig.Font( 'media/apple.white.font.png' ),
    font: new ig.Font( 'media/fredoka-one.font.png' ),
    timer: 0,
    gameStarted: false,

    sfxSell: new ig.Sound('media/sounds/coin.mp3'),
    // sfxCheck: new ig.Sound('media/sounds/check.mp3'),

    // HUD
    scoreBoard: new ig.Image('media/buttons/goldScoreSpr.png'),
    coinImg: new ig.Image('media/buttons/goldSpr.png'),
    eggImg: new ig.Image('media/buttons/eggSpr.png'),
    liveEggImg: new ig.Image('media/buttons/liveEggSpr.png'),
    roosterImg: new ig.Image('media/buttons/roosterIcon.png'),
    henImg: new ig.Image('media/buttons/henIcon.png'),
    coinSmallImg: new ig.Image('media/buttons/coinSmall.png'),
    barImg: new ig.Image('media/buttons/bar.png'),


    init: function() {
      // 레벨 불러오기
      var level_string = 'LevelLevel'+(GameInfo.maximum_chicken_level+1);
      this.loadLevel(ig.global[level_string]);

      // 입력키 설정
      // ig.input.bind(ig.KEY.UP_ARROW, 'up')
      // ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
      // ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
      // ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
      ig.input.bind(ig.KEY.MOUSE1, 'click');

      this.font.letterSpacing = -2;

      this.setStage();
    },

    qualityCheck: function() {

      if ( GameInfo.quality < 0 ) {
        GameInfo.quality = 0;
      } else if ( GameInfo.quality >= 700 ) {
        GameInfo.quality = 700;
      }

      if ( GameInfo.quality < 100 ) {
        GameInfo.quality_level = 1;
      } else if ( GameInfo.quality < 300 ) {
        GameInfo.quality_level = 2;
      } else if ( GameInfo.quality < 500 ) {
        GameInfo.quality_level = 3;
      } else if ( GameInfo.quality < 700 ) {
        GameInfo.quality_level = 4;
      } else if ( GameInfo.quality >= 700 ) {
        GameInfo.quality_level = 5;
      }

    },

    update: function() {
      // Update all entities and backgroundMaps
      this.parent();

      this.timer++;

      if ( this.timer === 240 ) {
        this.gameStarted = true;
        ig.game.spawnEntity(EntityHen, 250, 300);
      }

      if ( this.timer % (600*2) === 0 ) {
        GameInfo.quality -= parseInt(GameInfo.quality*0.1, 10);
      }

      // 닭이 0 마리가 되면 게임오버
      if ( ig.game.getEntitiesByType(EntityHen).length + ig.game.getEntitiesByType(EntityRooster).length === 0 && this.gameStarted === true ) {
        ig.system.setGame(MyGameOver);
      }

      this.qualityCheck();

    },

    setStage: function(roosters, hens) {

      for ( var i = 0; i < roosters; i++ ) {
        ig.game.spawnEntity(EntityRooster, 300, 300);
      }

      for ( var j = 0; j < hens; j++ ) {
        ig.game.spawnEntity(EntityHen, 300, 300);
      }

      // 다음레벨
      ig.game.spawnEntity( Button, 10, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'EXPANSION' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/fenceBtn.png', 80, 80 ),

        pressedUp: function() {

          if ( GameInfo.wallet >= GameInfo.price.level[GameInfo.maximum_chicken_level+1] && ig.game.gameStarted === true ) {
            GameInfo.wallet -= GameInfo.price.level[GameInfo.maximum_chicken_level+1];
            GameInfo.maximum_chicken_level++;

            var level_string = 'LevelLevel'+(GameInfo.maximum_chicken_level+1);

            var number_of_roosters = ig.game.getEntitiesByType(EntityRooster).length;
            var number_of_hens = ig.game.getEntitiesByType(EntityHen).length;

            console.log('number_rooster', number_of_roosters, number_of_hens);
            // console.log('number_of_chickens', number_of_chickens);

            ig.game.loadLevel(ig.global[level_string]);
            ig.game.setStage(number_of_roosters, number_of_hens);

          } else {
            console.log('NOT ENOUGH MONEY');
          }
        }
      });

      // 장바구니 사기
      ig.game.spawnEntity( Button, 100, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'BASKET UP' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/basketBtn.png', 80, 80 ),

        pressedUp: function() {
          if ( GameInfo.wallet >= GameInfo.price.basket[GameInfo.basket_level+1] && ig.game.gameStarted === true && GameInfo.basket_level < GameInfo.basket_volume.length ) {
            GameInfo.wallet -= GameInfo.price.basket[GameInfo.basket_level+1];
            GameInfo.basket_level++;
            console.log(GameInfo.basket_level);
          } else {
            console.log('NOT ENOUGH MONEY');
          }
        }
      });

      // 암컷 추가
      ig.game.spawnEntity( Button, 190, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'ADD HEN' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/femaleChickenBtn.png', 80, 80 ),

        pressedUp: function() {
          var number_of_chickens = ig.game.getEntitiesByType(EntityHen).length + ig.game.getEntitiesByType(EntityRooster).length;

          if ( number_of_chickens < GameInfo.maximum_number_of_chickens[GameInfo.maximum_chicken_level]  && ig.game.gameStarted === true ) {
            ig.game.addChicken(EntityHen);
          }
          console.log(number_of_chickens);
        }
      });

      // 수컷
      ig.game.spawnEntity( Button, 280, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'ADD ROOSTER' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/maleChickenBtn.png', 80, 80 ),

        pressedUp: function() {
          var number_of_chickens = ig.game.getEntitiesByType(EntityHen).length + ig.game.getEntitiesByType(EntityRooster).length;

          if ( number_of_chickens < GameInfo.maximum_number_of_chickens[GameInfo.maximum_chicken_level] && ig.game.gameStarted === true ) {
            ig.game.addChicken(EntityRooster);
          }
          console.log(number_of_chickens);
        }
      });


      // 먹이 사기
      ig.game.spawnEntity( Button, 370, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'FEED MORE' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/feedingBtn.png', 80, 80 ),

        pressedUp: function() {
          if ( GameInfo.wallet >= GameInfo.price.feed && ig.game.gameStarted === true  ) {
            GameInfo.wallet -= GameInfo.price.feed;
            GameInfo.quality += GameInfo.feed;
          } else {
            console.log('NOT ENOUGH MONEY');
          }
        }
      });

      // 팔기
      ig.game.spawnEntity( Button, 550, 530, {
        font: new ig.Font( 'media/apple.white.font.png' ),
        text: [ 'SELL' ],
        textPos: { x: 2, y: 2 },
        textAlign: ig.Font.ALIGN.LEFT,
        size: { x: 80, y: 80 },
        animSheet: new ig.AnimationSheet( 'media/buttons/eggSellBtn.png', 80, 80 ),

        pressedUp: function() {
          if ( ig.game.gameStarted === true ) {
            console.log(this);
            GameInfo.wallet += GameInfo.eggs*GameInfo.price.egg[0];
            GameInfo.wallet += GameInfo.live_eggs*GameInfo.price.egg[GameInfo.quality_level];
            GameInfo.eggs = 0;
            GameInfo.live_eggs = 0;
            ig.game.sfxSell.play();
          }
        }
      });

    },

    addChicken: function(entity) {

      var purchased = false;
      var x_position = 250;

      switch (entity) {

        case EntityHen:
        if ( GameInfo.wallet >= GameInfo.price.hen ) {
          GameInfo.wallet -= GameInfo.price.hen;
          purchased = true;
        }
        break;

        case EntityRooster:
        if ( GameInfo.wallet >= GameInfo.price.rooster ) {
          GameInfo.wallet -= GameInfo.price.rooster;
          purchased = true;
          x_position = 380;
        }
        break;

        default:
        break;

      }

      if ( purchased ) {
        ig.game.spawnEntity(entity, x_position, 300);
      } else {
        console.log('NOT ENOUGH MONEY');
      }

      console.log('GameInfo.wallet:', GameInfo.wallet);
    },

    draw: function() {
      // Draw all entities and backgroundMaps
      this.parent();
      this.barImg.draw(0,0);

      // 판매가 표시
      this.coinSmallImg.draw(555, 615);
      var price = GameInfo.eggs*GameInfo.price.egg[0] + GameInfo.live_eggs*GameInfo.price.egg[GameInfo.quality_level];
      this.smallFont.draw(price, 573, 615);

      // 현재 돈 표시
      this.scoreBoard.draw(75, 10);
      this.coinImg.draw(30, 10);
      this.font.draw(GameInfo.wallet, 85, 15);

      // 무정란/유정란 표시
      this.liveEggImg.draw(430, 10);
      this.eggImg.draw(520, 10);
      this.font.draw('X' + GameInfo.live_eggs, 468, 18);
      this.font.draw('X' + GameInfo.eggs, 558, 18);

      // Add your own drawing code here
      var x = ig.system.width/2, y = ig.system.height/2;

      // 바구니 상태
      this.font.draw( (GameInfo.live_eggs+GameInfo.eggs) + '/' + GameInfo.basket_volume[GameInfo.basket_level], 560, 495);
      this.coinSmallImg.draw(105, 615);
      var basket_price;
      if ( GameInfo.price.basket[GameInfo.basket_level+1] ) {
        basket_price = GameInfo.price.basket[GameInfo.basket_level+1];
      } else {
        basket_price = "MAX";
      }
      this.smallFont.draw(basket_price, 123, 615);

      // 암탉, 수탉 개수
      var number_of_hens = ig.game.getEntitiesByType(EntityHen).length;
      var number_of_roosters = ig.game.getEntitiesByType(EntityRooster).length;
      this.henImg.draw(190, 497);
      this.roosterImg.draw(280, 497);
      this.font.draw('X'+number_of_hens, 215, 495);
      this.coinSmallImg.draw(195, 615);
      this.smallFont.draw(GameInfo.price.hen, 213, 615);

      this.font.draw('X'+number_of_roosters, 305, 495);
      this.coinSmallImg.draw(285, 615);
      this.smallFont.draw(GameInfo.price.rooster, 303, 615);

      // 현재닭/최대닭
      this.font.draw( (number_of_hens+number_of_roosters) + '/' + GameInfo.maximum_number_of_chickens[GameInfo.maximum_chicken_level], 10, 495);
      this.coinSmallImg.draw(15, 615);
      var level_price;
      console.log(GameInfo.price.basket[GameInfo.maximum_chicken_level+1]);
      if ( GameInfo.price.basket[GameInfo.maximum_chicken_level+1] ) {
        level_price = GameInfo.price.level[GameInfo.maximum_chicken_level+1];
      } else {
        level_price = 'MAX';
      }
      this.smallFont.draw(level_price, 33, 615);

      // 닭 품질
      var quality_string;
      switch ( GameInfo.quality_level ) {
        case 1:
          quality_string = 'BAD';
          break;
        case 2:
          quality_string = 'LOW';
          break;
        case 3:
          quality_string = 'NORMAL';
          break;
        case 4:
          quality_string = 'GOOD';
          break;
        case 5:
          quality_string = 'BEST';
          break;
        default:
          quality_string = 'NONE';
          break;
      }
      this.smallFont.draw('grade:', 370, 480);
      this.font.draw(quality_string, 370, 495);
      this.coinSmallImg.draw(375, 615);
      this.smallFont.draw(GameInfo.price.feed, 393, 615);

      ig.system.context.strokeStyle = "rgb(0,0,0)";
      ig.system.context.lineWidth = 2;
      ig.system.context.beginPath();
      ig.system.context.rect( 380, 590, 60, 10 );
      ig.system.context.closePath();
      ig.system.context.fill();
      ig.system.context.stroke();

      var quality_percentage;

      if ( GameInfo.quality < 100 ) {
        quality_percentage = GameInfo.quality / 100 * 60;
      } else if ( GameInfo.quality < 300 ) {
        quality_percentage = GameInfo.quality / 300 * 60;
      } else if ( GameInfo.quality < 500 ) {
        quality_percentage = GameInfo.quality / 500 * 60;
      } else if ( GameInfo.quality <= 700 ) {
        quality_percentage = GameInfo.quality / 700 * 60;
      }

      ig.system.context.fillStyle = "rgb(0,255,0)";
      ig.system.context.beginPath();
      ig.system.context.rect( 380, 590, quality_percentage, 10 );
      ig.system.context.closePath();
      ig.system.context.fill();
      ig.system.context.stroke();

      if ( this.timer < 60 ) {
        this.font.draw('PREPARE YOURSELF', 320, 280, ig.Font.ALIGN.CENTER);
      } else if ( this.timer < 120 ) {
        this.font.draw('PREPARE YOURSELF', 320, 280, ig.Font.ALIGN.CENTER);
        this.font.draw('3', 320, 320, ig.Font.ALIGN.CENTER);
      } else if ( this.timer < 180 ) {
        this.font.draw('PREPARE YOURSELF', 320, 280, ig.Font.ALIGN.CENTER);
        this.font.draw('2', 320, 320, ig.Font.ALIGN.CENTER);
      } else if ( this.timer < 240 ) {
        this.font.draw('PREPARE YOURSELF', 320, 280, ig.Font.ALIGN.CENTER);
        this.font.draw('1', 320, 320, ig.Font.ALIGN.CENTER);
      } else if ( this.timer < 350 ) {
        this.font.draw('START!', 320, 320, ig.Font.ALIGN.CENTER);
      }

      if ( this.timer > 240 && this.timer < 450 ) {
        this.smallFont.draw('The game developer presented you a hen', 320, 450, ig.Font.ALIGN.CENTER);
      }

    }

  });

  // 타이틀

  MyTitle = ig.Game.extend({
    clearColor: "#d0f4f7",

    // The title image
    title: new ig.Image( 'media/backgrounds/title.png' ),

    // Load a font
    font: new ig.Font( 'media/fredoka-one.font.png' ),

    init: function() {
      // Bind keys
      ig.input.bind( ig.KEY.MOUSE1, 'click' );

      // Align touch buttons to the screen size, if we have any
      if( window.myTouchButtons ) {
        window.myTouchButtons.align();
      }

      // We want the font's chars to slightly touch each other,
      // so set the letter spacing to -2px.
      this.font.letterSpacing = -2;

      this.loadLevel( LevelLevel1 );
      this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;

      for ( var i = 0; i < 5; i++ ) {
        ig.game.spawnEntity(EntityHen, 250, 310);
        ig.game.spawnEntity(EntityRooster, 380, 310);
      }

    },

    update: function() {
      // Check for buttons; start the game if pressed
      if( ig.input.pressed('click') ) {
        ig.system.setGame( MyGame );
        return;
      }

      this.parent();

      // Scroll the screen down; apply some damping.
      var move = this.maxY - this.screen.y;
      if( move > 5 ) {
        this.screen.y += move * ig.system.tick;
        this.titleAlpha = this.screen.y / this.maxY;
      }
      this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;

    },

    draw: function() {
      this.parent();

      var cx = ig.system.width/2;
      this.title.draw( cx - this.title.width/2, 0 );

      var startText = 'Click anywhere to Play!';
      this.font.draw( startText, cx, 480, ig.Font.ALIGN.CENTER);

      var startText2 = 'Welcome to EGG IMPACT!';
      this.font.draw( startText2, cx, 300, ig.Font.ALIGN.CENTER);

      // Draw touch buttons, if we have any
      if( window.myTouchButtons ) {
        window.myTouchButtons.draw();
      }
    }
  });

  MyGameOver = ig.Game.extend({
    clearColor: "#d0f4f7",

    // The title image
    title: new ig.Image( 'media/backgrounds/gameover.png' ),

    // Load a font
    font: new ig.Font( 'media/fredoka-one.font.png' ),

    init: function() {
      // Bind keys
      ig.input.bind( ig.KEY.MOUSE1, 'click' );

      // We want the font's chars to slightly touch each other,
      // so set the letter spacing to -2px.
      this.font.letterSpacing = -2;

      this.loadLevel( LevelLevel1 );
      this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
    },

    update: function() {
      // Check for buttons; start the game if pressed
      this.parent();

      // Scroll the screen down; apply some damping.
      var move = this.maxY - this.screen.y;
      if( move > 5 ) {
        this.screen.y += move * ig.system.tick;
        this.titleAlpha = this.screen.y / this.maxY;
      }
      this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;

    },

    draw: function() {
      this.parent();

      var cx = ig.system.width/2;
      this.title.draw( cx - this.title.width/2, 0 );

      var overText = 'GAME OVER!';
      var currentMoney = GameInfo.wallet;
      this.font.draw( overText, cx, 220, ig.Font.ALIGN.CENTER);
      this.font.draw( 'You have earned ' + currentMoney + ' won', cx, 300, ig.Font.ALIGN.CENTER);

    }
  });

  // Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
  ig.main( '#canvas', MyTitle, 60, 640, 640, 1 );

});
