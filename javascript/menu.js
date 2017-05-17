var Menu = {

preload : function() {

        game.load.image('menu', 'asset/menu.jpg');
		      game.load.image('play', 'asset/play.png');
    },

create : function() {
        this.add.sprite(0, 0, 'menu');
		this.add.button(200, 200, 'play', this.startGame, this);
    },

startGame : function(){
	this.state.start('Game');
}

};
