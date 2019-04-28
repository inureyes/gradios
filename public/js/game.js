var player;
var aliens;
var bullets;
var bulletTime = 0;
var invincibleTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var countstage = 1;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var music;
var sfx_fire;
var sfx_enemy_die;
var heart;
var live_count = 3;
var last = -1;
var first = 0;
var stage = 1;
var stageString = '';
var stageText;
var sfx_stage_clear;
var speedup;
var player_speed;
var power_up_count = 1;
var power_up;
var settings;
var speed_up;
var player_speed;
var power_up_count = 1;
var power_up;
var score_up_2;
var score_2_switch = false;
var score_up_3;
var score_3_switch = false;
var Game = {

    preload : function() {

        // load all sprites
        game.load.image('speed_up', 'img/speed_up.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemyBullet', 'img/enemy-bullet.png');
        game.load.spritesheet('invader', 'img/invader32x32x4.png', 32, 32);
        game.load.spritesheet('ship', 'img/ship64x64x5.png', 64, 64, 5);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        game.load.image('starfield', 'img/starfield.png');
        game.load.image('heart', 'img/heart.png');
        game.load.image('power_up','img/power_up.png');
        game.load.image('score_up_2', 'img/score_up_2.png');
        game.load.image('score_up_3', 'img/score_up_3.png');
        game.load.image('lower_mountain', 'img/lower_mountain.png');
        game.load.image('upper_mountain', 'img/upper_mountain.png');
        
        // load all sfx and music
        game.load.audio('music1', 'audio/gradius.mp3');
        game.load.audio('sfx_enemy_die', 'audio/enemy-die.wav');
        game.load.audio('sfx_fire', 'audio/fire.wav');
        game.load.audio('sfx_player_hit', 'audio/player-hit.wav');
        game.load.audio('sfx_stage_clear', 'audio/stage-clear.wav');
        // load the setting icon
        game.load.image('settingButton', 'img/settingButton.png');
        game.load.image('settingBack', 'img/settingBackground.png');
        game.load.image('resumeButton', 'img/resumeButton.png');
        game.load.image('onButton', 'img/onButton.png');
        game.load.image('offButton', 'img/offButton.png');
    },

    create  : function() {

        // reset
        bulletTime = 0;
        invincibleTime = 0;
        score = 0;
        scoreString = '';
        firingTimer = 0;
        livingEnemies = [];
        countstage = 1;
        stage = 1;
        player_speed = 200;
        stageString = '';
        power_up_count = 1;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        music = game.add.audio('music1');
        music.volume = 0.4;
        music.play();


        //	Here we set-up our audio sprites
        sfx_fire = game.add.audio('sfx_fire');
        sfx_fire.allowMultiple = false;

        sfx_stage_clear = game.add.audio('sfx_stage_clear');
        sfx_stage_clear.allowMultiple = true;

        sfx_player_hit = game.add.audio('sfx_player_hit');
        sfx_player_hit.allowMultiple = true;

        sfx_enemy_die = game.add.audio('sfx_enemy_die');
        sfx_enemy_die.allowMultiple = true;

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 900, 600, 'starfield');
        upper_mountain = game.add.tileSprite(0, 0, 900, 30, 'upper_mountain');
        lower_mountain = game.add.tileSprite(0, 500, 900, 0, 'lower_mountain');

        //  The starship
        player = game.add.sprite(150, 300, 'ship');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(64,32,0,16);

        //  Our two animations, moving up and down.
        player.animations.add('up', [3, 4], 2, false);
        player.animations.add('down', [0, 1], 2, false);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(200, 'bullet', 100, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(200, 'enemyBullet', 100, false);
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  The bad guys
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        // The setting button
        game.add.button(30,20, 'settingButton', this.showSettingMessageBox, this);
        settings = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        // The stage
        stageString = 'Stage: ';
        stageText = game.add.text(70, 10, stageString + stage, { font: '40px Arial', fill: '#fff' });
        // this.generatespeed_up();
        this.createAliens();

        //  The score
        scoreString = 'Score: ';
        scoreText = game.add.text(250, 10, scoreString + score, { font: '40px Arial', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        // hearts
        heart = game.add.group();
        heart.enableBody = true;
        heart.physicsBodyType = Phaser.Physics.ARCADE;

        // power_up
        power_up = game.add.group();
        power_up.enableBody = true;
        power_up.physicsBodyType = Phaser.Physics.ARCADE;


        //speed_up
        speed_up = game.add.group();
        speed_up.enableBody = true;
        speed_up.physicsBodyType = Phaser.Physics.ARCADE;

        // score_up_2
        score_up_2 = game.add.group();
        score_up_2.enableBody = true;
        score_up_2.physicsBodyType = Phaser.Physics.ARCADE;

        // score_up_3
        score_up_3 = game.add.group();
        score_up_3.enableBody = true;
        score_up_3.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 2; i >= 0; i--) {
            var ship = lives.create(game.world.width - 150 + (60 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }

        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(200, 'kaboom', 100, false);
        explosions.forEach(this.setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update : function() {

        //  Scroll the background
        starfield.tilePosition.x -= 3;
        upper_mountain.tilePosition.x -= 1;
        lower_mountain.tilePosition.x -= 1;

        // Setting
        if (settings.isDown){
            music.stop();
            this.showSettingMessageBox();
            music.play();
        }

        if (player.alive) {
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            if (cursors.left.isDown && (40 < player.x)) {
                player.body.velocity.x = -player_speed;
            }
            else if (cursors.right.isDown && (player.x < 860)) {
                player.body.velocity.x = player_speed;
            }

            // keyboard up/down
            if (cursors.up.isDown && (40 < player.y)) {
                player.body.velocity.y = -player_speed;
                player.animations.play('up');
            }
            else if (cursors.down.isDown && (player.y < 560)) {
                player.body.velocity.y = player_speed;
                player.animations.play('down');
            }
            else {  // stand still
                player.animations.stop();
                player.frame = 2;
            }

            //  Firing?
            if (fireButton.isDown) {
                this.fireBullet();
            }

            if (game.time.now > firingTimer) {
                this.enemyFires();
            }

            //  Run collision
            game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
            game.physics.arcade.overlap(bullets, enemyBullets, this.playerBreakEnemyBullet, null, this);
            game.physics.arcade.overlap(player, aliens, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(player, enemyBullets, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(bullets, heart, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, speed_up, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, power_up, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, score_up_2, this.changeItem, null, this);
            game.physics.arcade.overlap(bullets, score_up_3, this.changeItem, null, this);
            game.physics.arcade.overlap(player, heart, this.getHeart, null, this);
            game.physics.arcade.overlap(player, power_up, this.getPower_up, null, this);
            game.physics.arcade.overlap(player, speed_up, this.getspeed_up, null, this);
            game.physics.arcade.overlap(player, score_up_2, this.getScore_up_2, null, this);
            game.physics.arcade.overlap(player, score_up_3, this.getScore_up_3, null, this);
        }
    },

    createAliens : function() {

        for (var i = 0; i < stage * 3; i++) {
            var alien = aliens.create(Math.random() * 290, Math.random() * 540, 'invader');
            while(game.physics.arcade.overlap(alien, aliens)){
                alien.kill();
                alien = aliens.create(Math.random() * 290, Math.random() * 540, 'invader');
            }
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
            alien.body.setSize(24,32,0,0);
        }

        aliens.x = 600;
        aliens.y = 30;


        //  Alien movements
        if (stage > 18) {
            var tween = game.add.tween(aliens).to( { x: 200 }, 1500, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
        }
        else if (stage > 16) {
            var tween = game.add.tween(aliens).to( { x: 200 }, 1500, Phaser.Easing.Sinusoidal.In, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 1000, Phaser.Easing.Sinusoidal.In, true, 0, 1000, true);
        }
        else if (stage > 14) {
            var tween = game.add.tween(aliens).to( { x: 15 }, 2500, Phaser.Easing.Linear.None, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        else if (stage > 12) {
            var tween = game.add.tween(aliens).to( { x: 200 }, 1500, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
        }
        else if (stage > 10) {
            var tween = game.add.tween(aliens).to( { x: 15 }, 2500, Phaser.Easing.Linear.None, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        else if (stage > 8) {
            var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Quintic.Out, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Quintic.Out, true, 0, 1000, true);
        }
        else if (stage > 6) {
            var tween = game.add.tween(aliens).to( { x: 250 }, 2000, Phaser.Easing.Quintic.Out, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Quintic.Out, true, 0, 1000, true);
        }
        else if (stage > 4) {
            var tween = game.add.tween(aliens).to( { x: 200 }, 1500, Phaser.Easing.Linear.None, true, 0, 1000, true);
            var tween = game.add.tween(aliens).to( { y: 50 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        else if (stage > 2) {
            var tween = game.add.tween(aliens).to( { x: 300 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }
        else {
            var tween = game.add.tween(aliens).to( { x: 400 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        }

        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);

    },

    setupInvader : function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },

    descend : function() {
        aliens.x -= 10;
    },

    render : function() {
        // game.debug.body(player);
        // game.debug.body(aliens.getFirstAlive());
    },

    fireBullet : function() {
        game.add.audio('sfx_fire');
        sfx_fire.volume = 0.2;

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime) {

            //  Grab the first bullet we can from the pool
            for(var n = power_up_count; n > 0; n--){
                bullet = bullets.getFirstExists(false);

                if (bullet) {
                    sfx_fire.play();
                    //  And fire it
                    if (n%2 === 0) {
                        bullet.reset(player.x + 8, player.y + Math.pow(-1, n) * 7 * n);
                        bullet.body.velocity.x = 800;
                        bulletTime = game.time.now + 200;
                    }
                    else {
                        bullet.reset(player.x + 8, player.y + Math.pow(-1, n) * 7 * n);
                        bullet.body.velocity.x = 400;
                        bulletTime = game.time.now + 200;
                    }
                }
            }
        }
    },

    collisionHandler : function(bullet, alien) {
        //  When a bullet hits an alien we kill them both
        bullet.kill();

        // hearts
        if(Math.random() * 1000 < 20) {
            var heart_1 = heart.create(alien.body.x, alien.body.y, 'heart');
            game.physics.arcade.moveToObject(heart_1, player, 100 + 10 * stage);
        }
        // power
        else if(Math.random() * 1000 < 20){
            var power = power_up.create(alien.body.x, alien.body.y,'power_up');
            game.physics.arcade.moveToObject(power, player, 100 + 10 * stage);
        }
        // speed up
        else if(Math.random() * 1000 < 20){
            var speed_up_1 = speed_up.create(alien.body.x, alien.body.y, 'speed_up');
            game.physics.arcade.moveToObject(speed_up_1, player, 100 + 10 * stage);
        }
        // score up 2
        else if(Math.random() * 1000 < 20){
            var score_2 = score_up_2.create(alien.body.x, alien.body.y,'score_up_2');
            game.physics.arcade.moveToObject(score_2, player, 100 + 10 * stage);
        }
        // score up 3
        else if(Math.random() * 1000 < 20){
            var score_3 = score_up_3.create(alien.body.x, alien.body.y,'score_up_3');
            game.physics.arcade.moveToObject(score_3, player, 100 + 10 * stage);
        }
        alien.kill();

        game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.6;
        sfx_enemy_die.play();

        //  Increase the score
        if (score_2_switch === true && score_3_switch === false) {
            score += 40*lives.countLiving();
        }
        else if (score_2_switch === false && score_3_switch == true) {
            score += 60*lives.countLiving();
        }
        else if (score_2_switch === true && score_3_switch == true) {
            score += 120*lives.countLiving();
        }
        else {
        score += 20*lives.countLiving();
        }
        scoreText.text = scoreString + score;
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        /*setTimeout(function() { explosion.kill(); }, 750);*/

        if (aliens.countLiving() === 0) {
            game.add.audio('stage_clear');
            sfx_stage_clear.volume = 2.0;
            sfx_stage_clear.play();

            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;
		
            
        }
    },

    changeItem : function(bullet, object){
        object.kill();
        var random = Math.random();
        if(random < 0.22){
            var power = power_up.create(bullet.body.x+30, bullet.body.y,'power_up');
            game.physics.arcade.moveToObject(power, player, 5 * stage);
        }
        else if(random < 0.44){
            var speed_up_1 = speed_up.create(bullet.body.x+30, bullet.body.y, 'speed_up');
            game.physics.arcade.moveToObject(speed_up_1, player, 5 * stage);

        }
        else if(random < 0.66){
            var score_2 = score_up_2.create(bullet.body.x+30, bullet.body.y, 'score_up_2');
            game.physics.arcade.moveToObject(score_2, player, 5 * stage);

        }
        else if(random < 0.77){
            var score_3 = score_up_3.create(bullet.body.x+30, bullet.body.y, 'score_up_3');
            game.physics.arcade.moveToObject(score_3, player, 5 * stage);

        }
        else{
            var heart_1 = heart.create(bullet.body.x+30, bullet.body.y, 'heart');
            game.physics.arcade.moveToObject(heart_1, player, 5 * stage);
        }
        bullet.kill();
    },

    playerBreakEnemyBullet : function(bullet, enemyBullet) {
        bullet.kill();
        enemyBullet.kill();

        game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.6;
        sfx_enemy_die.play();

        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemyBullet.body.x, enemyBullet.body.y);
        explosion.play('kaboom', 30, false, true);
    },

    enemyHitsPlayer : function(player, object) {
        if ((game.time.now < player.invincibleTime) || !aliens.countLiving()) return;
        game.add.audio('sfx_player_hit');
        sfx_player_hit.volume = 0.6;
        sfx_player_hit.play();
        object.kill();

        live = lives.getFirstAlive();
        if(live){
            live.kill();
            live_count--;
        }

        // reset player's power & speed
        player_speed = 200;
        power_up_count = 1;

        player.invincibleTime = game.time.now + 1000;
        // blink player
        game.add.tween(player).to( { alpha : 0.2 }, 250, Phaser.Easing.Linear.None, true, 0, 1, true);

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        if (lives.countLiving() < 1) {
            countstage = 1;
            this.finishGame();
        }

        if (aliens.countLiving() === 0) {
            game.add.audio('stage_clear');
            sfx_stage_clear.volume = 2.0;
            sfx_stage_clear.play();
            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;

        }
        score_2_switch = false;
        score_3_switch = false;
    },

    getHeart: function(player, heart) {
        heart.kill();
      
        if (live_count < 3){
	        for (var i = live_count; i >= 0; i--) {
	            var ship = lives.create(game.world.width - 150 + (60 * i), 60, 'ship');
	            ship.anchor.setTo(0.5, 0.5);
	            ship.angle = 0;
	            ship.alpha = 0.4;
	        }
	        for (var i = 0; i < live_count; i++)
			{        
				live = lives.getFirstAlive();
	    	    if(live)
	    	        live.kill();
		    }
		    live_count++;
		}
	},

     getPower_up: function(player, power_up){
        power_up.kill();
        power_up_count++;
        if(power_up_count > 6) power_up_count = 6;
    },

    finishGame : function() {
        if (lives.countLiving() < 1) {
            player.kill();
        }

        music.stop();

        game.time.events.add(Phaser.Timer.SECOND, function() {
            enemyBullets.callAll('kill');
            //aliens.removeAll();
            this.state.start('ending');
        }, this);
    },

    enemyFires : function() {
        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length = 0;

        aliens.forEachAlive(function(alien) {

            // put every living enemy in an array
            livingEnemies.push(alien);
        });

        if (enemyBullet && livingEnemies.length > 0) {

            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            if(countstage >= 7) countstage -=1;
            game.physics.arcade.moveToObject(enemyBullet,player,100 + 20 * countstage);
            firingTimer = game.time.now + 2000 / countstage;
        }
    },

    resetBullet : function(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    },
  
    getScore_up_2 : function(player, score_up_2){
        score_up_2.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 40*lives.countLiving();
        score_2_switch = true;
    },

    getScore_up_3 : function(player, score_up_3){
        score_up_3.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 60*lives.countLiving();
        score_3_switch = true;
    },

    getspeed_up : function(player, speed_up){
        speed_up.kill();
        if(player_speed <340){
            player_speed += 20;
        }
    },

    showSettingMessageBox : function(){
        game.paused = true;

        if(this.msgBox){
            this.msgBox.destroy();
        }

        var msgBox = game.add.group();
        var back = game.add.sprite(0,0,'settingBack');
        var resumeButton = game.add.sprite(0, 0, 'resumeButton');
        var musicOnButton = game.add.sprite(0,0, 'onButton');
        var musicOffButton = game.add.sprite(0,0,'offButton');
        var backgroundMusicText = game.add.text(0,0, 'BackgroundMusic');

        msgBox.add(back);
        msgBox.add(resumeButton);
        msgBox.add(musicOnButton);
        msgBox.add(musicOffButton);
        msgBox.add(backgroundMusicText);

        msgBox.x = game.width / 2 - msgBox.width / 2;
        msgBox.y = game.height / 2 - msgBox.height / 2;

        resumeButton.x = msgBox.width / 2 - resumeButton.width / 2;
        resumeButton.y = msgBox.height - resumeButton.height*2;
        resumeButton.inputEnabled = true;
        resumeButton.events.onInputDown.add(this.hideBox,this);

        backgroundMusicText.wordWrapWidth = back * 0.8;
        backgroundMusicText.x = msgBox.width / 2 - backgroundMusicText.width / 2;
        backgroundMusicText.y = msgBox.y;
        backgroundMusicText.addColor("#ffffff", 0);

        musicOnButton.x = msgBox.width / 2 - musicOnButton.width - 10;
        musicOnButton.y = msgBox.y + backgroundMusicText.height;
        musicOnButton.inputEnabled = true;
        musicOnButton.events.onInputDown.add(this.turnOnMusic,this);

        musicOffButton.x = msgBox.width / 2 + 10;
        musicOffButton.y = msgBox.y + backgroundMusicText.height;
        musicOffButton.inputEnabled = true;
        musicOffButton.events.onInputDown.add(this.turnOffMusic,this);

        this.msgBox = msgBox;
    },

    hideBox : function(){
        this.msgBox.destroy();
        game.paused = false;
    },

    turnOnMusic : function(){
        music.play();
    },

    turnOffMusic : function(){
        music.stop();
    }
}

