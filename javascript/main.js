var game = new Phaser.Game(922,800,Phaser.AUTO,'content');

game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.start('Menu');
