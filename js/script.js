var numberOfEggs = 0;
var numberOfChickEggs = 0;
var level = 1;
var quality = 0;
var qualityLevel = 1;
var wallet = 1000;
var maximumNumberOfChickens = 10;
var basket = 1;

var price  = {
  egg: [ 37, 75, 112, 168, 252, 378 ],
  hen: 300,
  rooster: 150,
  feed: [ 111, 222, 444 ],
  level: [ 0, 400, 1000, 1800, 2800, 4000, 5400, 7000, 8800 ],
  basket: [ 0, 400, 500, 600, 700, 800, 900, 1000, 1100 ],
};

var basketVolume = [ 8, 16, 24, 32, 40, 48, 56, 64, 72 ];

var levelSetting = [
  { maximumNumberOfChickens: 10, multiply: 1 },
  { maximumNumberOfChickens: 14, multiply: 1 },
  { maximumNumberOfChickens: 20, multiply: 1 },
  { maximumNumberOfChickens: 28, multiply: 1 },
  { maximumNumberOfChickens: 38, multiply: 1 },
  { maximumNumberOfChickens: 50, multiply: 1 },
  { maximumNumberOfChickens: 64, multiply: 1 },
  { maximumNumberOfChickens: 80, multiply: 1 },
  { maximumNumberOfChickens: 98, multiply: 1 },
  { maximumNumberOfChickens: 100, multiply: 1 }
];

Rooster = function () {
  var interval = 10000;
  var isBreedable = true;
  var timer = 50;

  var myInterval = setInterval(function(){
    isBreedable = true;
    timer -= interval / 1000;
  }, interval);

  this.getBreedable = function() {
    return isBreedable;
  };

  this.crossBreed = function() {
    isBreedable = false;
  };

  this.getTimer = function() {
    return timer;
  };

  this.removeInterval = function() {
    clearInterval(myInterval);
  };

};

Hen = function () {
  var interval = 10000;
  var timer = 70;

  var myInterval = setInterval(function(){
    var breedable = thisHenCanBreed();
    // console.log('breedable?', breedable);

    if ( numberOfEggs+numberOfChickEggs < basketVolume[basket-1] ) {
      if ( breedable ) {
        numberOfChickEggs += level;
      } else {
        numberOfEggs += level;
      }
    } else {
      console.log('알깨짐');
    }

    timer -= interval / 1000;

  }, interval);

  this.getTimer = function() {
    return timer;
  };

  this.removeInterval = function() {
    clearInterval(myInterval);
  };

};

var thisHenCanBreed = function () {

  var breedableArray = [];

  for ( var i in roosterArray ) {
    // console.log('roosterArray['+i+'].isBreedable: ' + roosterArray[i].getBreedable());
    if ( roosterArray[i].getBreedable() ) {
      if ( breedableArray.length < 3 ) {
        breedableArray.push(i);
      }
    }
  }

  if ( breedableArray.length >= 3 ) {
    for ( var j in breedableArray ) {
      var index = breedableArray[j];
      console.log('index:', index);
      roosterArray[index].crossBreed();
    }
    return true;
  } else {
    return false;
  }

  this.removeInterval = function() {
    clearInterval(myInterval);
  };

};

var henArray = [];
henArray.push(new Hen());
var roosterArray = [];
roosterArray.push(new Rooster());

var updateLables = function () {
  $('label#total').text('암컷: ' + henArray.length + ' 수컷: ' + roosterArray.length);
  $('label#egg').text('무정란: ' + numberOfEggs + ' | 유정란: ' + numberOfChickEggs);
  $('label#level').text('레벨: ' + level);
  $('label#wallet').text('돈: ' + wallet);
  $('label#quality').text('품질: ' + quality);
  $('label#basket').text('바구니 용량: ' + basketVolume[basket-1]);
};

var decreaseQuailty = function() {
  quality -= parseInt(quality * 0.1, 10);
  quality = (quality < 1) ? 0 : quality;
};

$(document).ready(function() {

  setInterval(function(){
    for ( var i in henArray ) {
      // console.log(henArray[i].getTimer());
      // 시간이 지나면 없애주기
      if ( henArray[i].getTimer() === 0 ) {
        // console.log(hen);
        // 수정할 것
        console.log(henArray[i]);
        // setTimeout(henArray[i]);
        henArray[i].removeInterval();
        henArray.splice(i, 1);
        decreaseQuailty();
      }

    }

    for ( var j in roosterArray ) {
      if ( roosterArray[j].getTimer() === 0 ) {
        // console.log(hen);
        // 수정할 것
        console.log(roosterArray[j]);
        // setTimeout(henArray[i]);
        roosterArray[j].removeInterval();
        roosterArray.splice(j, 1);
        decreaseQuailty();
      }
    }

    updateLables();

    if ( henArray.length === 0 && wallet <= price.hen ) {
      alert('GAME OVER');
      for (var interval = 1; interval < 99999; interval++)
        window.clearInterval(interval);
      return;
    }

  });

  // 자동 품질 감소
  setInterval(function() {
    decreaseQuailty();
  }, 20000);


  $('button').click(function(){

    switch ( this.id ) {
      case 'hen':
        if ( henArray.length + roosterArray.length < levelSetting[level-1].maximumNumberOfChickens && wallet >= price.hen ) {
          wallet -= price.hen;
          henArray.push(new Hen());
        } else {
          alert('you cannot add');
        }
        break;

      case 'rooster':
        if ( henArray.length + roosterArray.length < levelSetting[level-1].maximumNumberOfChickens && wallet >= price.rooster ) {
          wallet -= price.rooster;
          roosterArray.push(new Rooster());
        } else {
          alert('you cannot add');
        }
        break;

      case 'level':
        if ( level < 10 && wallet >= price.level[level] ) {
          console.log(price.level[level]);
          wallet -= price.level[level];
          level++;
        } else {
          alert('NOT ENOUGH MONEY');
        }
        break;

      case 'sell':
        wallet += numberOfEggs * price.egg[0];
        wallet += numberOfChickEggs * price.egg[qualityLevel];
        numberOfEggs = 0;
        numberOfChickEggs = 0;
        break;

      case 'feed':
        if ( quality < 700 && wallet >= price.feed[0] ) {
          wallet -= price.feed[0];
          quality += 30;
          if ( quality < 100 ) {
            qualityLevel = 1;
          } else if ( quality < 300 ) {
            qualityLevel = 2;
          } else if ( quality < 500 ) {
            qualityLevel = 3;
          } else if ( quality < 700 ) {
            qualityLevel = 4;
          } else {
            qualityLevel = 5;
          }
        }
        break;

      case 'basket':
        if ( basket < 10 && wallet >= price.basket[basket] ) {
          wallet -= price.basket[basket];
          basket++;
        }
        break;

      default:
        break;

    }

  });

});