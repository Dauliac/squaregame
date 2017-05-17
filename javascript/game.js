var Game = {
//===============================================================================
//===                                 PRELOAD                                 ===
//===============================================================================

	preload : function(){
		game.load.spritesheet('spritePlayerOne','asset/playerOne.png',64,60.05);
		game.load.spritesheet('spritePlayerTwo','asset/playerTwo.png',64,60.05);
		game.load.image('jeu', 'asset/map/jeu.jpg');
		game.load.tilemap('map', 'asset/map/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
	 	game.load.image('ground_1x1', 'asset/map/ground_1x1.png');
		game.load.image('tiles2', 'asset/map/tiles2.png');
	},

//==============================================================================
//===                                 CREATE                                 ===
//==============================================================================

	create : function(){
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
		playerOne=game.add.sprite(400,300,'spritePlayerOne');
		playerTwo=game.add.sprite(400,300,'spritePlayerTwo');
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
			players[n].scoreTimer=0;
			players[n].body.bounce.y = 0.13;
			players[n].body.bounce.x = 0.5;
		}
		playerOne.keybinds=[Phaser.Keyboard.Z, Phaser.Keyboard.Q, Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.A];
		playerTwo.keybinds=[Phaser.Keyboard.O, Phaser.Keyboard.K, Phaser.Keyboard.L, Phaser.Keyboard.M, Phaser.Keyboard.I];

		// SQUARE
  	square = new Phaser.Rectangle(200, 200, 380, 220);

  	squareTopX=0;
  	squareTopY=62;
  	squareTopWidth=game.width;
  	squareTopHeight=square.y-62;

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

		Game.timeLabel = Game.game.add.text(Game.game.world.centerX, 32,  "00:00", {fontSize: "25px",font:"Press Start 2P", fill: "#fff" });
		Game.timeLabel.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
    Game.timeLabel.anchor.setTo(0.5, 0);
    Game.timeLabel.align = 'center';


		Game.gameTimer=game.time.events.loop(100,function(){
			Game.updateTimer();
		})
		//Graphics
		scoreTextOne = game.add.text(35, 16, 'player 1: '+playerOne.score+'%', { fontSize: '20px',font: 'Press Start 2P', fill: 'rgb(255, 255, 255)' });
		scoreTextOne.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
		scoreTextTwo = game.add.text(530, 16, 'player 2: '+playerTwo.score+'%', { fontSize: '20px',font: "Press Start 2P", fill: 'rgb(255, 255, 255)' });
		scoreTextTwo.setShadow(3, 3, 'rgba(0,0,0,0.6)', 0);
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
    game.state.start('Menu');
}
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
						who.scoreTimer=100;
				}
				scoreTextOne.setText("player 1: "+playerOne.score+"%");
				scoreTextTwo.setText("player 2: "+playerTwo.score+"%");
    },

    //==============================================================================
    //===                                 SQUARE                                 ===
    //==============================================================================

    updateSquare : function(){

        squareTop.width=game.width;
        squareTop.height=square.y;

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

	//==============================================================================
	//===                                 GRAPHIC                                ===
	//==============================================================================

	//=====================================

	//==============================================================================
	 //===                                 DETECT                                 ===
	 //==============================================================================
	 nexTo : function(whoOne,whoTwo, distance ){
			 if(Math.sqrt(Math.pow(whoOne.x-whoTwo.x,2)+Math.pow(whoOne.y-whoTwo.y,2))< distance ){
					 return(true);
			 }
			 else{
					 return(false);
			 }
	 },

	 isOnHead : function(playerUp, playerDown, deltaX){
			 if(playerUp.y<playerDown.y && Game.nexToVer(playerUp, playerDown, playerDown.hitBoxY+5) &&  Game.nexToHor(playerUp, playerDown, playerDown.hitBoxX+deltaX)){
					 return(true);
			 }
			 else {
					 return(false);
			 }

	 },

	 nexToVer : function(whoOne, whoTwo , distance ){
			 if(Math.abs(whoOne.y - whoTwo.y)<distance){
					 return(true);
			 }
			 else {
					 return(false);
			 }
	 },

	 nexToHor : function(whoOne, whoTwo, distance ){
			 if(Math.abs(whoOne.x - whoTwo.x)<distance){
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
			 if(who.body.onFloor()){
					 who.tchFloor=true;
					 who.jumpCooldown=0;
					 who.jumpCount=0;
			 }
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
					 if(who.body.velocity.y<850){
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
			 if(player.body.onFloor()){
					 player.jumpCount= 0;
			 }
			 Game.toStop(player);
			 if(player.isMovable){
					 Game.toRight(player);
					 Game.toBottom(player);
					 Game.toLeft(player);
					 Game.toTop(player)
					 Game.animMove(player);
			 }
	 },

//======================================================================================
//===                                 INTERRACTIONS                                  ===
//======================================================================================
	 getJumpHead : function(actif, passif){
			 if(Game.isOnHead(actif, passif, 3) && Game.toBottom(actif)==false && !actif.body.onFloor() ){
					 // QUI - Vitesse X - Vitesse Y - Cooldown - isMovable
					 Game.setHit(actif, passif, null, 300, null, true);
					 Game.getHit(actif, passif, null, -300, null, true);
					 actif.jumpCount=1;
			 }
	 },
//=====================================
	 interact : function(actorOne, actorTwo){
			 if(actorOne.isMovable==true){
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
			 if(Game.nexToHor(actif, passif, 50) && Game.nexToVer(actif, passif, 10)){
				 var x = Math.abs(actif.x - passif.x);
				 var speedX = (1/(0.006*(x-10)))+180 ;
				 console.log(speedX);
				 // Attaquant - Attaqué - Vitesse X - Vitesse Y - Cooldown - isMovable - facing
				 Game.setHit(actif,passif, speedX, -150, 100, true, true);
				 Game.getHit(actif, passif, speedX, 60, 60, true, false);
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

	 setHit : function(mover, moved,hitSpeedX, hitSpeedY, cooldown, isMovable, face){//PASSIF
		 console.log("sethit :"+hitSpeedX);
			 if(face==true){
					 if(Game.facing(mover, moved)==true){
							 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
							 Game.appplyHit(moved, hitSpeedX, hitSpeedY, this.cooldown, isMovable);
					 }
			 }
			 else{
							 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
							 Game.appplyHit(moved, hitSpeedX, hitSpeedY, this.cooldown, isMovable);
			 }
	 },
	 getHit : function(mover,moved, hitSpeedX, hitSpeedY, getcooldown, isMovable){//ACTIF
		 	 console.log("gethit :"+hitSpeedX);
			 var hitSpeedX = Game.orientHit(mover, moved, hitSpeedX);
			 Game.appplyHit(mover, hitSpeedX, hitSpeedY, getcooldown, isMovable);
	 },
	 //==================
	 appplyHit : function(who , hitSpeedX, hitSpeedY, appCooldown, isMovable){
		 		 console.log("applyhit :"+hitSpeedX);
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
					if(who.body.onFloor() && who.did=="stop"){
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
			game.physics.arcade.collide(playerOne, playerTwo);
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
		        //LOGS

	},

	render : function() {
	        //game.debug.text('timer: ' + total, 350, 32,{fontSize :'30px'});$
	        var color = 'rgba(255,47, 175,0.4)';
					game.debug.geom(squareTop, color);
					game.debug.geom(squareBottom, color);
					game.debug.geom(squareLeft, color);
					game.debug.geom(squareRight, color);
	    },

}
