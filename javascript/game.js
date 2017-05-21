var Game = {
//===============================================================================
//===                                 PRELOAD                                 ===
//===============================================================================

	preload : function(){
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.spritesheet('spritePlayerOne','asset/playerOne.png',64,60.05);
		game.load.spritesheet('spritePlayerTwo','asset/playerTwo.png',64,60.05);
		game.load.image('jeu', 'asset/map/jeu.jpg');
		game.load.tilemap('map', 'asset/map/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
	 	game.load.image('ground_1x1', 'asset/map/ground_1x1.png');
		game.load.image('tiles2', 'asset/map/tiles2.png');
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.image('restart', 'asset/restart.png');
		game.load.audio('audioGame', 'asset/audio/Kubbi-Ember-04Cascade.mp3')
	},

//==============================================================================
//===                                 CREATE                                 ===
//==============================================================================

	create : function(){
		var win = null;
		//IMPORT
		game.physics.startSystem(Phaser.Physics.ARCADE);
		Game.game.load.bitmapFont('myfont','assets/font/uprt8-fagwg.png', 'assets/font/uprt8-fagwg.fnt');
		//MAP
		line = new Phaser.Line();
		game.add.sprite(0, 0, 'jeu');
	    map = game.add.tilemap('map');
	    map.addTilesetImage('ground_1x1');
			map.addTilesetImage('tiles2');
	    layer = map.createLayer('Tile Layer 1');
			layer2 = map.createLayer('torch');
	    layer.resizeWorld();
	    map.setCollisionBetween(1, 12);
	    layer.debug = false;
		//PROPERTY
		game.physics.startSystem(Phaser.Physics.ARCADE);
		playerOne=game.add.sprite(460,250,'spritePlayerOne');
		playerTwo=game.add.sprite(550,250,'spritePlayerTwo');
		playerTwo.scale.x=-1;
		players=[playerOne, playerTwo];
		for(n=0;n<players.length;n++){
			players[n].anchor.setTo (0.5,0.6);
			//animations
			players[n].animations.add('isWalking',[16,17,18,19,20,21,22,23],15,false);
			players[n].animations.add('isJumpingBis',[49,50,51,52,53],9,false);;
			players[n].animations.add('isJumping',[35,36,37],5,true);
			players[n].animations.add('isFalling',[71],1,false);
			players[n].animations.add('isDroping',[199],5,false);
			players[n].animations.add('isStoping',[0,1,2,3],5,true);
			players[n].animations.add('isShifting',[72],1,false);
			players[n].animations.add('punch',[145,146,147,148,149,150,151,152,153],16,false);
			players[n].animations.add('animEnd',[64,65,66,67,68,69,70],16,false);
			players[n].animations.add('winAnim',[128,129,130,131,132,133,134,135,136,137,138,139,140],16,false);
			//Physics
			game.physics.enable(players[n],Phaser.Physics.ARCADE);
			players[n].hitBoxX=14;
			players[n].hitBoxY=26;
			players[n].body.setSize(players[n].hitBoxX, players[n].hitBoxY, 24,34);
			players[n].body.collideWorldBounds = true;
			players[n].body.mass=90;
			players[n].body.gravity.set(0,700);
			players[n].speedX=200;
			players[n].speedY=360;
			players[n].jumpCooldown=0;
			players[n].hitCooldown=0;
			players[n].tchFloor=true;
			players[n].did="";
			players[n].hit="";
			players[n].graphicCooldown=0;
			players[n].isMovable=true;
			players[n].combo=0;
			players[n].score=0;
			players[n].scoreTimer=60;
			players[n].body.bounce.y = 0.13;
			players[n].body.bounce.x = 0.5;
			players[n].win=null;
		}
		playerOne.keybinds=[Phaser.Keyboard.Z, Phaser.Keyboard.Q, Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.A];
		playerTwo.keybinds=[Phaser.Keyboard.O, Phaser.Keyboard.K, Phaser.Keyboard.L, Phaser.Keyboard.M, Phaser.Keyboard.I];

		// SQUARE

  	square = new Phaser.Rectangle(game.width/2-400/2, 180, 400, 250);
		square.timer=5*60;
		square.action="" ;
		square.edgeX=0;
		square.edgeY=0;
		square.edgeWidth=0
		square.edgeHeight=0;
		square.color = 'rgba(204, 193, 41,0.4)';
		square.end=false;

  	squareTopX=0;
  	squareTopY=62;
  	squareTopWidth=game.width;
  	squareTopHeight=square.y;

  	squareLeftX=0;
  	squareLeftY=square.y;
  	squareLeftWidth=square.x;
  	squareLeftHeight=square.height;

  	squareRightX=square.x+square.width;
    squareRightY=square.y;
  	squareRightWidth=game.width-(square.x+square.width);
  	squareRightHeight=square.height;

  	squareBottomX=0;
  	squareBottomY=square.y+square.height;
  	squareBottomWidth=game.width;
  	squareBottomHeight=game.height-(square.y+square.height);

    squareTop = new Phaser.Rectangle(squareTopX, squareTopY, squareTopWidth, squareTopHeight);
  	squareLeft = new Phaser.Rectangle(squareLeftX, squareLeftY, squareLeftWidth, squareLeftHeight);
  	squareBottom = new Phaser.Rectangle(squareBottomX, squareBottomY, squareBottomWidth, squareBottomHeight);
  	squareRight = new Phaser.Rectangle(squareRightX, squareRightY, squareRightWidth, squareRightHeight);

		//Timer
		Game.startTime=new Date();
		Game.totalTime=180;
		Game.timeElapsed=0;
		Game.timeLabel = Game.game.add.text(Game.game.world.centerX, 25,  "00:00", {fontSize: "35px",font: "Press Start 2P", fill: "#fff" });
		Game.timeLabel.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
    Game.timeLabel.anchor.setTo(0.5, 0);
    // Game.timeLabel.align = 'center';


		Game.gameTimer=game.time.events.loop(100,function(){
			Game.updateTimer();
		})
		//Graphics
		scoreTextOne = game.add.text(35, 20, 'player 1: '+playerOne.score+'%', { fontSize: '21px',font: "Press Start 2P", fill: 'rgb(255, 255, 255)' });
		scoreTextOne.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
		scoreTextTwo = game.add.text(630, 20, 'player 2: '+playerTwo.score+'%', { fontSize: '21px',font: "Press Start 2P", fill: 'rgb(255, 255, 255)' });
		scoreTextTwo.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
		//audio
		// music = game.add.audio('audioGame');
    // music.play();
	},

	updateTimer: function(){
    var currentTime = new Date();
    var timeDifference = Game.startTime.getTime() - currentTime.getTime();
    Game.timeElapsed = Math.abs(timeDifference / 1000);
    var timeRemaining = Game.totalTime - Game.timeElapsed;
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);
    var result = (minutes < 10) ? "0" + minutes : minutes;
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
    Game.timeLabel.text = result;
		if(Game.timeElapsed >= Game.totalTime){
		Game.winOrLoose();
		}
	},
		//==============================================================================


	winOrLoose : function(){
		if(playerOne.win!=false && playerTwo.win!=false){
					playerOne.body.velocity.x=0;
					playerTwo.body.velocity.x=0;
					Game.timeLabel.destroy();
					Game.add.button(320, 10, 'restart', Game.restartGame, Game);
					music.destroy();
					if(playerOne.score < playerTwo.score){
								playerTwo.win=true;
								playerOne.win=false;
								playerOne.play("animEnd");
								console.log("pute");
							}
						if(playerTwo.score < playerOne.score){
								playerTwo.win=false;
								playerOne.win=true;
								playerTwo.play("animEnd");
								}
						if(playerOne.score == playerTwo.score){
								playerOne.win=false;
								playerTwo.win=false;
								console.log("pas pute");
										}
						}
	},


		restartGame : function(){
  		this.state.start('Menu');
		},
		//==============================================================================
    //===                                 SCORE                                  ===
    //==============================================================================
    scoring : function(who){
				if(who.scoreTimer>=1){
					who.scoreTimer-=1
				}
				if( !(square.x > who.x && who.x > square.x+square.width) && !(square.y < who.y && who.y < square.y+square.height) && who.scoreTimer==0){
						who.score-=1
						who.scoreTimer=60;
				}
				scoreTextOne.setText("player 1: "+playerOne.score+"%");
				scoreTextTwo.setText("player 2: "+playerTwo.score+"%");
    },

    //==============================================================================
    //===                                 SQUARE                                 ===
    //==============================================================================

    squareUpdate : function(){

        squareTop.width=game.width;
        squareTop.height=square.y-62;

        squareLeft.y=square.y;
        squareLeft.width=square.x;
        squareLeft.height=square.height;

        squareRight.x=square.x+square.width;
        squareRight.y=square.y;
        squareRight.width=game.width-(square.x+square.width);
        squareRight.height=square.height;

        squareBottom.y=square.y+square.height;
        squareBottom.width=game.width;
        squareBottom.height=game.height-(square.y+square.height);

    },

	//=====================================
		randomUp : function(){
			console.log("il augmente");
			var minX = 10;
			var maxX = game.width-(square.x+square.width)-20;
			var minY = 10;
			var maxY = game.height-(square.y+square.height)-20;
			square.newWidth = Math.floor(Math.random() * (maxX - minX +1)) + minX;
			square.newHeight = Math.floor(Math.random() * (maxY - minY +1)) + minY;
		},

		randomDown : function(){
			var minX = 10;
			var maxX = square.width-150;
			var minY = 10;
			var maxY = square.height-100;
			square.newWidth = -Math.floor(Math.random() * (maxX - minX +1)) + minX;
			square.newHeight = -Math.floor(Math.random() * (maxY - minY +1)) + minY;
		},
		randomMove : function(){
			console.log("il bouge");
			var minX = -square.x;
			var maxX = game.width-(square.x+square.width);
			var minY = -(square.y);
			var maxY = game.height-62-(square.y+square.width);
			square.newX = Math.floor(Math.random() * (maxX - minX +1)) + minX;
			square.newY = Math.floor(Math.random() * (maxY - minY +1)) + minY;
		},

		randomTimer : function(){
			var min=1;
			var max=20;
			var secs = Math.floor(Math.random() * (max - min +1)) + min;
			square.timer=60*secs;
		},
		//====================================

		squareChanger : function(){
			if(square.timer>0){
				square.timer-=1;
					square.x+=square.edgeX;
					square.y+=square.edgeY;

					square.width+=square.edgeWidth;
					square.height+=square.edgeHeight;
				}

		},

		squareWin : function(){
			if((playerOne.win==false || playerTwo.win==false)&& square.end!=true){
				console.log(square.timer);
				square.end=true;
				square.timer=60*2;
				square.color = 'rgba(255, 255, 255,0.3)';
				console.log("square.x"+square.x);
				square.edgeX=-square.x/square.timer;
				square.edgeY=-(square.y-64)/square.timer;
				square.edgeWidth=(game.width-square.width)/square.timer;
				square.edgeHeight=(game.height-square.height)/square.timer;
			}
		},

		square : function(){
			Game.squareUpdate();
			Game.squareChanger();
			Game.squareWin();

			if(square.timer==0 && square.end!=true){
				square.edgeX=0;
				square.edgeY=0;
				square.edgeWidth=0
				square.edgeHeight=0;
				console.log("haahahahahahaha");
				Game.randomTimer();
				var token = Math.floor(Math.random()*4);

				if(token==0){
					square.color = 'rgba(204, 193, 41,0.4)';
					square.timer+=5*60
				}
				if(token==1){//UP
					Game.randomUp();
					square.color="rgba(52,255, 58,0.4)";
					square.edgeWidth=square.newWidth/square.timer;
					square.edgeHeight=square.newHeight/square.timer;
				}
				if(token==2){//DOWN
					Game.randomDown();
			 		square.color = 'rgba(255,47, 175,0.4)';
					square.edgeWidth=square.newWidth/square.timer;
					square.edgeHeight=square.newHeight/square.timer;
				}
				if(token==3){//MOVE
					Game.randomMove();
					square.color = 'rgba(22, 108, 200,0.4)';
					square.edgeX=square.newX/square.timer;
					square.edgeY=square.newY/square.timer;
				}
			}
		},

	//==============================================================================
	//===                                 DETECT                                ===
	//=============================================================================

	 nexTo : function(whoOne,whoTwo, distance ){
			 if(Math.sqrt(Math.pow(whoOne.x-whoTwo.x,2)+Math.pow(whoOne.y-whoTwo.y,2))< distance ){
					 return(true);
			 }
			 else{
					 return(false);
			 }
	 },

	 isOnHead : function(playerUp, playerDown,ajustement){
			 if(playerUp.y<playerDown.y && Game.nexToVer(playerUp, playerDown, 30) &&  Game.nexToHor(playerUp, playerDown, playerDown.hitBoxX+ajustement)){
					 return(true);
			 }
			 else {
					 return(false);
			 }

	 },

	 nexToVer : function(whoOne, whoTwo , delta){
			 if(Math.abs(whoOne.y - whoTwo.y)<=delta){
					 return(true);
			 }
			 else {
					 return(false);
			 }
	 },

	 nexToHor : function(whoOne, whoTwo, distance ){
			 if(Math.abs(whoOne.x - whoTwo.x)<=distance){
					 return(true);
			 }
			 else {
					 return(false);
			 }
	 },

	 isWhere : function(actif, passif){
			 if(actif.x < passif.x){
					 return("left");
			 }
			 if(actif.x > passif.x){
					 return("right");
			 }
			 else{
					 return("same");
			 }
	 },

	 facing : function(one, two){
			 if(Game.isWhere(one, two)=="left"){
					 if(one.scale.x==1){
							 return(true);
					 }
					 if(one.scale.x==-1){
							 return(false);
					 }
			 }
			 if(Game.isWhere(one,two)=="right"){
					 if(one.scale.x==-1){
							 return(true);
					 }
					 if(one.scale.x==1){
							 return(false);
					 }
			 }
	 },

	 //=============================================================================
	 //===                                 MOVE                                  ===
	 //=============================================================================
	 toTop : function(who){
			 if(who.jumpCooldown>0){
					 who.jumpCooldown--;
			 }
			 if(who.body.onFloor()){
					 who.tchFloor=true;
					 who.jumpCooldown=0;
					 who.jumpCount=0;
			 }
			 if(!game.input.keyboard.isDown(who.keybinds[2])){
				 if(game.input.keyboard.isDown(who.keybinds[0]) && who.jumpCount==0){
					 who.body.velocity.y = -who.speedY;
					 who.jumpCooldown=30;
					 who.jumpCount++;
					 who.tchFloor=false;
					 who.did="top";
					 return(true);
				 }
				 else if(game.input.keyboard.isDown(who.keybinds[0]) && who.jumpCount==1 && who.jumpCooldown==0){

					 who.body.velocity.y = -250;
					 who.tchFloor=false;
					 who.jumpCount++;
					 who.did="topBis";
					 return(true);
				 }
				 else{
					 return(false);
				 }
			 }
			 else{
					 return(false);
			 }
	 },
	 toLeft : function(who){
			 if(game.input.keyboard.isDown(who.keybinds[1])){
					 who.body.velocity.x=-who.speedX;
					 who.scale.x=-1;
					 who.did="left";
					 return(true);
			 }
			 else{
					 return(false);
			 }
	 },

	 toBottom : function(who){
			 if( game.input.keyboard.isDown(who.keybinds[2])) {
					 if(who.body.velocity.y<800){
							 who.did="bottom";
							 who.body.velocity.y+=30;
					 }
					 return(true);

					 }
			 else{
					 return(false)
			 }
	 },

	 toRight : function(who){
			 if( game.input.keyboard.isDown(who.keybinds[3])){
					 who.body.velocity.x=who.speedX;
					 who.did="right"
					 who.scale.x=1;
					 return(true);
			 }
			 else{
					 return(false);
			 }
	 },

	 toStop : function(who){
			 if(who.isMovable){
					 who.body.velocity.x=0;
					 who.did="stop";
					 return(true)
			 }
	 },

//=====================================

	 move : function(player){
		 if(player.body.y<65 && player.body.velocity.y<0){
			 player.body.velocity.y=0;
		 }
		 if(player.win!=false){
			 if(player.body.onFloor()){
				 player.jumpCount=0;
			 }
			 Game.toStop(player);
			 if(player.isMovable){
				 Game.toRight(player);
				 Game.toBottom(player);
				 Game.toLeft(player);
				 Game.toTop(player)
				 Game.animMove(player);
			 }
		 }
	 },

//======================================================================================
//===                                 INTERRACTIONS                                  ===
//======================================================================================
	 getJumpHead : function(actif, passif){
			 if(Game.isOnHead(actif, passif, -1) && Game.toBottom(actif)==false){
					 // QUI - Vitesse X - Vitesse Y - Cooldown - isMovable
					 Game.setHit(actif, passif, null, 100, null, true);
					 Game.getHit(actif, passif, null, -300, null, true);
					 actif.jumpCount=1;
			 }
	 },
//=====================================
	interact : function(actorOne, actorTwo){
 		if(square.end!=true){
			game.physics.arcade.collide(playerOne, playerTwo);
			Game.getJumpHead(actorOne, actorTwo);
 		}
	},

//===============================================================================
//===                                 ATTACKS                                 ===
//===============================================================================

	 downKick : function(actif, passif){
			 if(Game.isOnHead(actif, passif, 10) && Game.toBottom(actif)){
							 // Attaquant - Attaqué - Vitesse X - Vitesse Y - Cooldown - isMovable - facing
							 Game.setHit(actif, passif, 150, -370, 100, 50, false);
							 Game.getHit(actif, passif, null, null, 100, 50, false);
							 passif.y-=10;
			 }
	 },

	 punch : function(actif, passif){
		 if(game.input.keyboard.isDown(actif.keybinds[4])){
			 actif.hit="punch";
			 actif.graphicCooldown=60;
			 passif.hit="getpunch";
			 if(Game.nexToHor(actif, passif, 30) && Game.nexToVer(actif, passif, 14)){
				 var x = Math.abs(actif.x - passif.x);
				 var speedX = (1/(0.006*(x-10)))+180 ;
				 // Attaquant - Attaqué - Vitesse X - Vitesse Y - Cooldown - isMovable - facing
				 Game.setHit(actif,passif, speedX, -150, 72, false, true);
				 Game.getHit(actif, passif, null, 60, 100, false, false);
			 }
		 }
	 },

//===============================================================================
	 orientHit : function(mover, moved, speed){
			 if(speed!=null){
					 if(Game.isWhere(mover, moved)=="right"){
							 speed=-speed;
							 return(speed);
					 }
					 else{
							 return(speed);
					 }
			 }
			 else{
					 return(null);
			 }
	 },

	 setHit : function(mover, moved,hitSpeedX, hitSpeedY, setCooldown, isMovable, face){//PASSIF
			 if(face==true){
					 if(Game.facing(mover, moved)==true){
							 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
							 Game.appplyHit(moved, hitSpeedX, hitSpeedY, setCooldown, isMovable);
					 }
			 }
			 else{
							 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
							 Game.appplyHit(moved, hitSpeedX, hitSpeedY, this.cooldown, isMovable);
			 }
	 },
	 getHit : function(mover,moved, hitSpeedX, hitSpeedY, getcooldown, isMovable){//ACTIF
			 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
			 Game.appplyHit(mover, hitSpeedX, hitSpeedY, getcooldown, isMovable);
	 },
	 //==================
	 appplyHit : function(who , hitSpeedX, hitSpeedY, appCooldown, isMovable){
			 who.hitCooldown = appCooldown;
			 who.isMovable=isMovable;
			 if(hitSpeedY!=null){
					 who.body.velocity.y = hitSpeedY;
			 }
			 if(hitSpeedX!=null){
					 who.body.velocity.x = hitSpeedX;

			 }
	 },

//=====================================
	hit : function(hitter, hitted){
					if(hitter.win!=false && hitted.win!=false){
						 for(n=0;n<players.length;n++){
								 if(players[n].hitCooldown>0){
										 players[n].hitCooldown--;
								 }
								 if(players[n].hitCooldown==0){
										 players[n].hit="";
										 players[n].isMovable=true;
								 }
						 }
						 Game.downKick(hitter, hitted);
						 Game.punch(hitter, hitted);
						 Game.animAtack(hitter, hitted);
				 }
	},
//==================================================================================
//===                                 ANIMATIONS                                 ===
//==================================================================================
    animMove : function(who){
			 	if(who.hit==""){
					if(who.did=="left" && who.body.onFloor() && who.body.velocity.x!=0){
						who.play("isWalking");
					}
					if(who.did=="right" && who.body.onFloor() && who.body.velocity.x!=0){
						who.play("isWalking");
					}
					if(who.did=="top" && who.body.velocity.y<200){
						who.play('isJumping');
					}
					if(who.did=="topBis" && who.body.velocity.y<0){
						who.play('isJumpingBis');
					}
					if(who.body.onFloor()==false && Game.toBottom(who) && who.body.velocity.y>0 ){
						who.play('isDroping');
					}
					if(Game.toBottom(who)==false && who.body.velocity.y>0 ){
						who.play('isFalling');
					}
					if(who.body.onFloor() && Game.toBottom(who) ){
						who.play('isShifting');
					}
					if(who.body.onFloor() && who.did=="stop" &&	who.graphicCooldown==0){
						who.play('isStoping');
					}
				}

    },

		animAtack : function(actif, passif){
			if(actif.hit=="punch" && actif.graphicCooldown==60){
				actif.play('punch');
				actif.graphicCooldown=60;
			}
			if(actif.graphicCooldown>0){
				actif.graphicCooldown--;
			}
			if(actif.graphicCooldown==0){
				actif.hit="";
			}

		},

	//==============================================================================
	//===                                 UPDATE                                  ==
	//==============================================================================
		update : function(){
		        game.physics.arcade.collide(playerOne, layer);
		        game.physics.arcade.collide(playerTwo, layer);
		        Game.hit(playerOne, playerTwo);
		        Game.hit(playerTwo, playerOne);
		        Game.move(playerOne);
		        Game.move(playerTwo);
		        Game.interact(playerOne, playerTwo);
		        Game.interact(playerTwo, playerOne);
		        Game.scoring(playerOne);
						Game.scoring(playerTwo);
						Game.square();

		        //LOGS
	},

	render : function() {

					game.debug.geom(squareTop, square.color);
					game.debug.geom(squareBottom, square.color);
					game.debug.geom(squareLeft, square.color);
					game.debug.geom(squareRight, square.color);

	    },

}
