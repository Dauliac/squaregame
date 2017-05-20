var Menu = {

preload : function() {

    game.load.image('menu', 'asset/menu.jpg');
    game.load.image('play', 'asset/play.png');
    game.load.audio('audioMenu', 'asset/audio/Yeah.mp3');
    },

create : function() {
    this.add.sprite(0, 0, 'menu');
    this.add.button(370, 300, 'play', this.startGame, this);
    music = game.add.audio('audioMenu');
    music.play();
    },

startGame : function(){
    this.state.start('Game');
}

};
