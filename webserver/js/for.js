var player;
var aliens;
var bullets;
var bulletTime = 0;
var invincibleTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var live_count;
var max_live = 3;
var enemyBullet;
var firingTimer = 0;
var ailencreatetimer;
var ailencreatecount = 0;
var livingEnemies = [];
var music;
var sfx_fire;
var sfx_enemy_die;
var sfx_get_item;
var sfx_stage_clear;
var sfx_player_hit;
var heart;
var shield;
var isShield = false;
var last = -1;
var first = 0;
var stage = 1;
var stageString = '';
var stageText;
var alienscount;
var aliensString;
var alienkillText;
var alienkill=0;
var alienString;
var speedup;
var player_speed;
var power_up_count = 1;
var power_up;
var settings;
var settingButton;
var speed_up;
var player_speed;
var power_up_count = 1;
var power_up;
var score_up_2;
var score_2_switch = false;
var score_up_3;
var score_3_switch = false;
var debugFlag = false;
var bulletsCollision = true;
var music_status;
var bulletsCollision_status;
var seconds = 0;
var minutes = 0;
var itemchangetime;
var shiptype = 0;
var ship1button;
var ship2button;
var backButton
var characterSelection;
var ailencreatecount;
var items = [];
var Game = {

    preload : function() {

        // load all sprites
        game.load.spritesheet('invaderBasic', 'img/invader32x32x4.png', 32, 32);
        game.load.spritesheet('invaderGreen', 'img/invader32x32x4-green.png', 32, 32);
        game.load.spritesheet('invaderPurple', 'img/invader32x32x4-purple.png', 32, 32);
        game.load.spritesheet('ship', 'img/ship64x64x5.png', 64, 64, 5);
        game.load.spritesheet('armerShip', 'img/armerShip64x64x5.png', 64, 64, 5);
        game.load.spritesheet('ship2', 'img/ship264x64x5.png', 64, 64, 5);
        game.load.spritesheet('armerShip2', 'img/armerShip64x64x5.png', 64, 64, 5);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        //ship img
        game.load.image('shipimg', 'img/ship.png');
        game.load.image('ship2img', 'img/ship2.png');
        //bullet
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('bullet2', 'img/bullet2.png');
        game.load.image('enemyBullet', 'img/enemy-bullet.png');
        //map
        game.load.image('starfield', 'img/starfield.png');
        game.load.image('lower_mountain', 'img/lower_mountain.png');
        game.load.image('upper_mountain', 'img/upper_mountain.png');
        //item
        game.load.image('heart', 'img/heart.png');
        game.load.image('shield', 'img/shield.png');
        game.load.image('speed_up', 'img/speed_up.png');
        game.load.image('power_up','img/power_up.png');
        game.load.image('score_up_2', 'img/score_up_2.png');
        game.load.image('score_up_3', 'img/score_up_3.png');
        //debug
        game.load.image('debug_message', 'img/debugMessage.png');

        // load all sfx and music
        game.load.audio('music1', 'audio/gradius.mp3');
        game.load.audio('sfx_enemy_die', 'audio/enemy-die.wav');
        game.load.audio('sfx_fire', 'audio/fire.wav');
        game.load.audio('sfx_player_hit', 'audio/player-hit.wav');
        game.load.audio('sfx_stage_clear', 'audio/stage-clear.wav');
        game.load.audio('sfx_get_item' , 'audio/get_item.mp3');
        // load the setting icon
        game.load.image('settingButton', 'img/settingButton.png');
        game.load.image('settingBack', 'img/settingBackground.png');
        game.load.image('settingBack1', 'img/settingBackground1.png');
        game.load.image('backButton', 'img/backButton.png');
    },

    create  : function() {

        // reset
        ailencreatecount = 0;
        bulletsCollision = true;
        itemchangetime = 0;
        bulletTime = 0;
        invincibleTime = 0;
        score = 0;
        alienkill = 0;
        scoreString = '';
        firingTimer = 0;
        livingEnemies = [];
        countstage = 1;
        stage = 1;
        player_speed = 200;
        stageString = '';
        power_up_count = 1;
        seconds = 0;
        minutes = 0;
        music_status = 'ON';
        bulletsCollision_status = 'ON';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        if (!music) music = game.add.audio('music1');
        music.loop = true;
        music.volume = 0.5;
        music.play();

        //  Here we set-up our audio sprites
        if (!sfx_fire) sfx_fire = game.add.audio('sfx_fire');
        sfx_fire.volume = 0.5;
        sfx_fire.allowMultiple = false;

        if (!sfx_stage_clear) sfx_stage_clear = game.add.audio('sfx_stage_clear');
        sfx_stage_clear.volume = 0.5;
        sfx_stage_clear.allowMultiple = true;

        if (!sfx_player_hit) sfx_player_hit = game.add.audio('sfx_player_hit');
        sfx_player_hit.volume = 0.5;
        sfx_player_hit.allowMultiple = true;

        if (!sfx_enemy_die) sfx_enemy_die = game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.5;
        sfx_enemy_die.allowMultiple = true;

        if (!sfx_get_item) sfx_get_item = game.add.audio('sfx_get_item');
        sfx_get_item.volume = 0.5;
        sfx_get_item.allowMultiple = true;

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 900, 600, 'starfield');
        upper_mountain = game.add.tileSprite(0, 0, 900, 30, 'upper_mountain');
        lower_mountain = game.add.tileSprite(0, 500, 900, 0, 'lower_mountain');

        //  The starship
        game.paused = true;
        backButton = game.add.button(game.world.centerX+350,+30,'backButton', this.goMenu1, this);
        characterSelection = game.add.text(game.world.centerX-160, game.world.centerY-120, "Select Spaceship", { font: '50px Arial', fill: '#fff' });
        ship1button = game.add.button(game.world.centerX-250, game.world.centerY, 'shipimg', this.character1, this);
        ship2button = game.add.button(game.world.centerX, game.world.centerY, 'ship2img', this.character2, this);

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
            // this.state.start('pauseMenu');
            music.play();
        }

        if (player.alive) {
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            alienscount.text = aliensString + aliens.countLiving();
            
            if(cursors.left.isDown && cursors.up.isDown){
                player.body.velocity.x = -player_speed * Math.sqrt(2) / 2;
                player.body.velocity.y = -player_speed * Math.sqrt(2) / 2;
                player.animations.play('up');
            }

            else if(cursors.left.isDown && cursors.down.isDown){
                player.body.velocity.x = -player_speed  * Math.sqrt(2) / 2;
                player.body.velocity.y = player_speed  * Math.sqrt(2) / 2;
                player.animations.play('down');
            }
            else if(cursors.right.isDown && cursors.up.isDown){
                player.body.velocity.x = player_speed * Math.sqrt(2) / 2;
                player.body.velocity.y = -player_speed * Math.sqrt(2) / 2;
                player.animations.play('up');
            }
            else if(cursors.right.isDown && cursors.down.isDown){
                player.body.velocity.x = player_speed  * Math.sqrt(2) / 2;
                player.body.velocity.y = player_speed  * Math.sqrt(2) / 2;
                player.animations.play('down');
            }

            else if (cursors.left.isDown) {
                player.body.velocity.x = -player_speed;
            }
            else if (cursors.right.isDown) {
                player.body.velocity.x = player_speed;
            }

            // keyboard up/down
            else if (cursors.up.isDown) {
                player.body.velocity.y = -player_speed;
                player.animations.play('up');
            }
            else if (cursors.down.isDown) {
                player.body.velocity.y = player_speed;
                player.animations.play('down');
            }
            else {  // stand still
                player.animations.stop();
                player.frame = 2;
            }

            if((game.time.now > ailencreatetimer && ailencreatecount < 10*stage) || aliens.countLiving() === 0)  {
                this.createAliens();
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
            if (bulletsCollision){
                game.physics.arcade.overlap(bullets, enemyBullets, this.playerBreakEnemyBullet, null, this);
            }
            game.physics.arcade.overlap(player, aliens, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(player, enemyBullets, this.enemyHitsPlayer, null, this);
            if (itemchangetime < game.time.now) {
                game.physics.arcade.overlap(bullets, heart, this.changeItem, null, this);
                game.physics.arcade.overlap(bullets, shield, this.changeItem, null, this);
                game.physics.arcade.overlap(bullets, power_up, this.changeItem, null, this);
                game.physics.arcade.overlap(bullets, speed_up, this.changeItem, null, this);
                game.physics.arcade.overlap(bullets, score_up_2, this.changeItem, null, this);
                game.physics.arcade.overlap(bullets, score_up_3, this.changeItem, null, this);
            }
            game.physics.arcade.overlap(player, heart, this.getHeart, null, this);
            game.physics.arcade.overlap(player, shield, this.getShield, null, this);
            game.physics.arcade.overlap(player, power_up, this.getPower_up, null, this);
            game.physics.arcade.overlap(player, speed_up, this.getspeed_up, null, this);
            game.physics.arcade.overlap(player, score_up_2, this.getScore_up_2, null, this);
            game.physics.arcade.overlap(player, score_up_3, this.getScore_up_3, null, this);
        }
    },

    character1 : function() {
        shiptype = 1
        backButton.destroy();
        characterSelection.destroy();
        ship1button.destroy();
        ship2button.destroy();
        this.createContinue();
        game.paused = false;
    },

    character2 : function() {
        shiptype = 2
        player_speed = 300;
        backButton.destroy();
        ship1button.destroy();
        ship2button.destroy();
        characterSelection.destroy();
        this.createContinue();
        game.paused = false;
    },

    createContinue : function() {
        if (shiptype === 2) {
            player = game.add.sprite(150, 300, 'ship2');
        }
        else {
            player = game.add.sprite(150, 300, 'ship');
        }
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.bounce.set(0);
        player.body.setSize(64,32,0,16);

        //  Our two animations, moving up and down.
        player.animations.add('up', [3, 4], 2, false);
        player.animations.add('down', [0, 1], 2, false);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        if (shiptype === 2)
            bullets.createMultiple(200, 'bullet2', 100, false);
        else
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
        settingButton = game.add.button(30,20, 'settingButton', this.showSettingMessageBox, this);
        settings = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        settingButton.inputEnabled = true;
        settings.inputEnabled = true;

        // The stage
        stageString = 'Stage: ';
        stageText = game.add.text(70, 10, stageString + stage, { font: '40px Arial', fill: '#fff' });
        // this.generatespeed_up();
        this.createAliens();
        musicString = 'BGM: ';
        musicText = game.add.text(70,50,musicString + music_status,{ font: '30px Arial', fill: '#fff' });
        //  The score
        scoreString = 'Score: ';
        scoreText = game.add.text(250, 10, scoreString + score, { font: '40px Arial', fill: '#fff' });

        aliensString = 'Alien: ';
        alienscount = game.add.text(750,70,aliensString + aliens.countLiving(), { font: '40px Arial', fill: '#fff' });

        alienString = 'Kill: ';
        alienkillText = game.add.text(750,110,alienString + alienkill, { font: '40px Arial', fill: '#fff' });

        bulletsCollisionString = 'Bul Col: ';
        bulletsCollisionText = game.add.text(230,50,bulletsCollisionString+bulletsCollision_status,{ font: '30px Arial', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        for (var i = 2; i >= 0; i--) {
            var ship = lives.create(game.world.width - 150 + (60 * i), 50, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
        live_count = 3
        //game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        // hearts
        heart = game.add.group();
        heart.enableBody = true;
        heart.physicsBodyType = Phaser.Physics.ARCADE;

        // shield
        shield = game.add.group();
        shield.enableBody = true;
        shield.physicsBodyType = Phaser.Physics.ARCADE

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


        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(200, 'kaboom', 100, false);
        explosions.forEach(this.setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        var me = this;

        me.startTime = new Date();
        me.totalTime = 120;
        me.timeElapsed = 0;

        me.createTimer();

        me.gameTimer = game.time.events.loop(1000, function(){
            me.updateTimer();
        });
    },

    createAliens : function() {
        let alienImage;
        let alienHealth;
        let alienSizeMultiple;
        let specialEnemyPer = Math.random()*50;
        if(specialEnemyPer < stage/10){
            alienImage = 'invaderPurple';
            alienHealth = 3;
            alienSizeMultiple = 2;
        }
        else if(specialEnemyPer < stage/3){
            alienImage = 'invaderGreen';
            alienHealth = 2;
            alienSizeMultiple = 1.5;
        }
        else{
            alienImage = 'invaderBasic';
            alienHealth = 1;
            alienSizeMultiple = 1;
        }

        ailencreatetimer = game.time.now + 500 + 1000*Math.random();
        ailencreatecount++;
        var movepoint_x = 930;
        var movepoint_y = Math.random() * 540 + 30;
        var alien = aliens.create(movepoint_x, movepoint_y, alienImage);
        while(game.physics.arcade.overlap(alien, aliens) || game.physics.arcade.overlap(alien, player)){
            alien.kill();
            movepoint_y = Math.random() * 540 + 30;
            alien = aliens.create(movepoint_x, movepoint_y, alienImage);
        }

        alien.maxHealth = alienHealth;
        alien.setHealth(alienHealth);
        alien.scale.set(alienSizeMultiple);

        alien.anchor.setTo(0.5, 0.5);
        alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
        alien.play('fly');
        alien.body.moves = false;
        alien.body.setSize(24,32,0,0);

        var movestyle = Phaser.Easing;
        var style = Math.random();
        if (style < 0.2)
            movestyle = movestyle.Cubic;
        else if (style < 0.4)
            movestyle = movestyle.Back;
        else if (style < 0.6)
            movestyle = movestyle.Circular;
        else if (style < 0.8)
            movestyle = movestyle.Linear;
        style = Math.random();
        if (style < 0.33)
            movestyle = movestyle.In;
        else if (style < 0.66)
            movestyle = movestyle.InOut;
        else
            movestyle = movestyle.Out;

        if(movepoint_x < 600)
            movepoint_x = 700 + Math.random()*200;
        else
            movepoint_x = 300 + Math.random()*200;
        if(movepoint_y < 300)
            movepoint_y = 600 - Math.random()*220;
        else
            movepoint_y = Math.random()*220;

        var difficulty = stage;
        if (difficulty > 20)
            difficulty = 20;

        //game.physics.arcade.moveToObject(enemyBullet,{x : alien.body.x, y : -100},100 + 20 * countstage);

        var tween = game.add.tween(alien).to( { x: -30}, 10000, movestyle, true, 0, 20000, false);
        var tween = game.add.tween(alien).to( { y: movepoint_y }, 3000 - 1000*Math.random() - 50*difficulty*Math.random(), movestyle, true, 0, 20000, true);


        //  Alien movements


            //var tween = game.add.tween(aliens).to( { y: 500 }, 2000, Phaser.Easing.Cubic.Out, true, 0, 0, true);


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
        // game.debug.spriteInfo(player);
        // game.debug.body(aliens.getFirstAlive());
    },

    fireBullet : function() {
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
                        if (shiptype === 2)
                            bulletTime = game.time.now + 100;
                        else
                            bulletTime = game.time.now + 200;
                    }
                    else {
                        bullet.reset(player.x + 8, player.y + Math.pow(-1, n) * 7 * n);
                        bullet.body.velocity.x = 400;
                        if (shiptype === 2)
                            bulletTime = game.time.now + 100;
                        else
                            bulletTime = game.time.now + 200;
                    }
                }
            }
        }
    },

    collisionHandler : function(bullet, alien) {

        if (debugFlag){
            this.debugCollisionMessage(bullet, alien);
        }
        //  When a bullet hits an alien we kill them both
        bullet.kill();

        if(Math.random() * 1000 < 200) {
            this.makeRandomItem(alien.body.x, alien.body.y, -130, (Math.random()*2-1)*60 );
        }
        alien.damage(1);
        alienkill++;
        sfx_enemy_die.play();

        //  Increase the score
        if (score_2_switch === true && score_3_switch === false) {
            score += 40*live_count;
        }
        else if (score_2_switch === false && score_3_switch == true) {
            score += 60*live_count;
        }
        else if (score_2_switch === true && score_3_switch == true) {
            score += 120*live_count;
        }
        else {
        score += 20*live_count;
        }
        scoreText.text = scoreString + score;
        alienkillText.text = alienString + alienkill;
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        /*setTimeout(function() { explosion.kill(); }, 750);*/

        if (aliens.countLiving() === 0 && ailencreatecount >= stage*10) {
            aliens.removeAll();
            sfx_stage_clear.play();

            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;
            console.log(stage, aliens.countLiving(), ailencreatecount);

            if(debugFlag){
                console.log("%c STAGE "+stage, 'background: #222; color: #bada55');
            }

        }
    },

    makeRandomItem : function(x, y, x_vel = 0, y_vel = 0){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        if (debugFlag){
            console.log("Item created at X:"+ x +", Y:"+ y +" velosity = ( X:"+x_vel+", Y:"+y_vel+")");
        }
        var option = ['power_up', 'speed_up', 'score_up_2', 'score_up_3', 'heart', 'shield'];

        var random = option[Math.floor(Math.random() * option.length)];

        var item = eval(random).create(x,y,random);

        item.anchor.setTo(0.5, 0.5);
        if(x_vel != 0){
            item.body.velocity.x = x_vel;
        }
        if(y_vel != 0){
            item.body.velocity.y = y_vel;
        }
        item.body.collideWorldBounds = true;
        item.body.bounce.set(1);
        game.time.events.add(Phaser.Timer.SECOND * 10, erase, this);
        function erase() {
            item.body.collideWorldBounds = false;
        }
        return item;
    },

    createTimer : function() {

        var me = this;

        me.timeLabel = me.game.add.text(640, 20, "00:00", {font: "50px Arial", fill: "#fff"});
        me.timeLabel.anchor.setTo(0.5, 0);
        me.timeLabel.align = 'center';

    },

    updateTimer: function(){
        var me = this;
        if(seconds + 1 >= 60) {
            minutes += 1;
            seconds = 0;
        } else {
            seconds += 1;
        }
        //Display minutes, add a 0 to the start if less than 10
        var result = (minutes < 10) ? "0" + minutes : minutes;

        //Display seconds, add a 0 to the start if less than 10
        result += (seconds < 10) ? ":0" + seconds : ":" + seconds;

        if(seconds != 0 && seconds % 10 == 0) {
            score += 100 * stage;
            scoreText.text = scoreString + score;
            setTimeout(function()
            {
                var bonustext = game.add.text(scoreText.width+280, 40, "+"+100 * stage,{ font: '25px Arial', fill: '#ffffff' });
                bonustext.anchor.setTo(0.5, 0.5);
                setTimeout(function(){bonustext.destroy();}, 999);
            }, 0);
        }

        me.timeLabel.text = result;
    },

    changeItem : function(bullet, object){
        itemchangetime = game.time.now + 1000;
        if(debugFlag){
            this.debugCollisionMessage(bullet, object);
        }
        var x_vel = object.body.velocity.x;
        var y_vel = object.body.velocity.y;
        var x = object.x;
        var y = object.y;
        object.kill();
        var item = this.makeRandomItem(x, y, x_vel, y_vel);
        bullet.kill();
    },

    playerBreakEnemyBullet : function(bullet, enemyBullet) {
        if(debugFlag){
            this.debugCollisionMessage(bullet, enemyBullet);
        }
        bullet.kill();
        enemyBullet.kill();

        sfx_enemy_die.play();

        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemyBullet.body.x, enemyBullet.body.y);
        explosion.play('kaboom', 30, false, true);
    },

    enemyHitsPlayer : function(player, object) {
        if(debugFlag){
            this.debugCollisionMessage(player, object);
        }
        if (isShield) {
            if ((game.time.now < player.invincibleTime)) {
                sfx_enemy_die.play();
                object.kill()

                var explosion = explosions.getFirstExists(false);
                explosion.reset(player.body.x, player.body.y);
                explosion.play('kaboom', 30, false, true);
                return;
            }
            else {
                isShield = false;
            }
        }
        else {
            if ((game.time.now < player.invincibleTime) || !aliens.countLiving()) return;
        }
        sfx_player_hit.play();
        object.kill();

        live = lives.getChildAt(max_live-live_count);
        live.alpha = 0;
        live_count--;

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

        if (live_count < 1) {
            this.finishGame();
        }

        if (aliens.countLiving() === 0 && ailencreatecount >= stage*10) {
            sfx_stage_clear.play();
            this.createAliens();
            countstage++;
            stage++;
            stageText.text = stageString + stage;
            console.log(stage);

            if(debugFlag){
                console.log("%c STAGE "+stage, 'background: #222; color: #bada55');
            }

        }
        score_2_switch = false;
        score_3_switch = false;
    },

    getHeart: function(player, heart) {
        sfx_get_item.play();
        if(debugFlag){
            this.debugCollisionMessage(player, heart);
        }
        heart.kill();

        if (live_count < 3){
            live_count++;
            live = lives.getChildAt(max_live-live_count);
            live.alpha = 0.4;
        }
    },

    getShield : () => {
        if (shiptype === 2) {
            player.loadTexture('armerShip2', 0);
        }
        else {
            player.loadTexture('armerShip', 0);
        }
        sfx_get_item.play();
        shield.kill();
        player.invincibleTime = game.time.now + 15000;
        isShield = true;
        setTimeout(() => {
            if (shiptype === 2) {
                player.loadTexture('ship2', 0);
            }
            else {
                player.loadTexture('ship', 0);
            }
        }, 15000);
    },

    getPower_up: function(player, power_up) {
        sfx_get_item.play();
        if(debugFlag){
            this.debugCollisionMessage(player, power_up);
        }
        power_up.kill();
        power_up_count++;
        if(power_up_count > 6) power_up_count = 6;
    },

    finishGame : function() {

        player.kill();

        music.stop();

        game.time.events.add(Phaser.Timer.SECOND , function() {
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
        sfx_get_item.play();
        if(debugFlag){
            this.debugCollisionMessage(player, score_up_2);
        }
        score_up_2.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 40*lives.countLiving();
        score_2_switch = true;
    },

    getScore_up_3 : function(player, score_up_3){
        sfx_get_item.play();
        if(debugFlag){
            this.debugCollisionMessage(player, score_up_3);
        }
        score_up_3.kill();
        //if(player_speed <340){
            //player_speed += 20;
        //}
        //score += 60*lives.countLiving();
        score_3_switch = true;
    },

    getspeed_up : function(player, speed_up){
        sfx_get_item.play();
        if(debugFlag){
            this.debugCollisionMessage(player, speed_up);
        }
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
        var mainMenu = game.add.text(0, 0, 'MAIN MENU');
        var restartButton1 = game.add.text(0, 0, 'RESTART');
        var resumeButton = game.add.text(0, 0, 'RESUME');
        var musicOnButton = game.add.text(0,0, 'ON', { fontSize: 19});
        var musicOffButton = game.add.text(0,0,'OFF', { fontSize: 19 });
        var backgroundMusicText = game.add.text(0,0, 'BackgroundMusic', { fontSize: 19 });
        var dbgMsgText = game.add.text(0, 0, "Debug Message", { fontSize: 19 });
        var dbgMsgOnButton = game.add.text(0,0, 'ON', { fontSize: 19});
        var dbgMsgOffButton = game.add.text(0,0,'OFF', { fontSize: 19 });
        var bulletCollisionText = game.add.text(0, 0, 'Bullets Collision', { fontSize: 19 });
        var bulletCollisionOnButton = game.add.text(0,0, 'ON', { fontSize: 19 });
        var bulletCollisionOffButton = game.add.text(0,0, 'OFF', { fontSize: 19 });
        var m_vol_text = game.add.text(0,0, 'BGM Volume', { fontSize: 19 });
        var m_volumeUp = game.add.text(0, 0, '+', {fontsize: 19});
        var m_volumeDown = game.add.text(0, 0, '-', {fontsize: 19});
        var m_volume = game.add.text(0, 0, Math.round(music.volume * 100), { fontsize: 19 });
        var sfx_volume_text = game.add.text(0,0, 'SFX Volume', { fontSize: 19 });
        var sfx_volumeUp = game.add.text(0, 0, '+', {fontsize: 19});
        var sfx_volumeDown = game.add.text(0, 0, '-', {fontsize: 19});
        var sfx_volume = game.add.text(0, 0, Math.round(sfx_fire.volume * 100), { fontsize: 19 });


        msgBox.add(back);
        msgBox.add(mainMenu);
        msgBox.add(restartButton1);
        msgBox.add(resumeButton);
        msgBox.add(musicOnButton);
        msgBox.add(musicOffButton);
        msgBox.add(backgroundMusicText);
        msgBox.add(dbgMsgText);
        msgBox.add(dbgMsgOnButton);
        msgBox.add(dbgMsgOffButton);
        msgBox.add(bulletCollisionText);
        msgBox.add(bulletCollisionOffButton);
        msgBox.add(bulletCollisionOnButton);
        msgBox.add(m_vol_text);
        msgBox.add(m_volumeUp);
        msgBox.add(m_volume);
        msgBox.add(m_volumeDown);
        msgBox.add(sfx_volume_text);
        msgBox.add(sfx_volumeUp);
        msgBox.add(sfx_volumeDown);
        msgBox.add(sfx_volume);

        msgBox.x = game.width / 2 - msgBox.width / 2;
        msgBox.y = game.height / 2 - msgBox.height / 2;

        mainMenu.wordWrapWidth = back * 0.8;
        mainMenu.addColor("#ffffff", 0);
        mainMenu.x = msgBox.width / 2 - mainMenu.width / 2;
        mainMenu.y = msgBox.height - mainMenu.height*3.75;
        mainMenu.inputEnabled = true;
        mainMenu.events.onInputDown.add(this.real,this);

        restartButton1.wordWrapWidth = back * 0.8;
        restartButton1.addColor("#ffffff", 0);
        restartButton1.x = msgBox.width / 2 - restartButton1.width / 2;
        restartButton1.y = msgBox.height - restartButton1.height*5;
        restartButton1.inputEnabled = true;
        restartButton1.events.onInputDown.add(this.startGame,this);

        resumeButton.wordWrapWidth = back * 0.8;
        resumeButton.addColor("#ffffff", 0);
        resumeButton.x = msgBox.width / 2 - resumeButton.width / 2;
        resumeButton.y = msgBox.height - resumeButton.height*2.5;
        resumeButton.inputEnabled = true;
        setTimeout("hideBox()", 3000);
        resumeButton.events.onInputDown.add(this.hideBox,this);

        backgroundMusicText.wordWrapWidth = back * 0.8;
        backgroundMusicText.addColor("#ffffff", 0);
        backgroundMusicText.x = msgBox.width / 2 - backgroundMusicText.width / 2;
        backgroundMusicText.y = msgBox.y - 40;

        musicOnButton.wordWrapWidth = back * 0.8;
        musicOnButton.addColor("#ffffff", 0);
        musicOnButton.x = msgBox.width / 2 - musicOnButton.width - 10;
        musicOnButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOnButton.inputEnabled = true;
        musicOnButton.events.onInputDown.add(this.turnOnMusic,this);

        musicOffButton.wordWrapWidth = back * 0.8;
        musicOffButton.addColor("#ffffff", 0);
        musicOffButton.x = msgBox.width / 2 + 10;
        musicOffButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOffButton.inputEnabled = true;
        musicOffButton.events.onInputDown.add(this.turnOffMusic,this);

        dbgMsgText.wordWrapWidth = back * 0.8;
        dbgMsgText.addColor("#ffffff", 0);
        dbgMsgText.x = msgBox.width / 2 - dbgMsgText.width / 2;
        dbgMsgText.y = msgBox.y + 15;

        dbgMsgOnButton.wordWrapWidth = back * 0.8;
        dbgMsgOnButton.addColor("#ffffff", 0);
        dbgMsgOnButton.x = msgBox.width / 2 - dbgMsgOnButton.width - 10;
        dbgMsgOnButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOnButton.inputEnabled = true;
        dbgMsgOnButton.events.onInputDown.add(this.turnOnDbgMsg,this);

        dbgMsgOffButton.wordWrapWidth = back * 0.8;
        dbgMsgOffButton.addColor("#ffffff", 0);
        dbgMsgOffButton.x = msgBox.width / 2 + 10;
        dbgMsgOffButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOffButton.inputEnabled = true;
        dbgMsgOffButton.events.onInputDown.add(this.turnOffDbgMsg,this);

        bulletCollisionText.wordWrapWidth = back * 0.8;
        bulletCollisionText.x = msgBox.width / 2 - bulletCollisionText.width / 2;
        bulletCollisionText.y = msgBox.y + 70;
        bulletCollisionText.addColor("#ffffff", 0);

        bulletCollisionOnButton.wordWrapWidth = back * 0.8;
        bulletCollisionOnButton.addColor("#ffffff", 0);
        bulletCollisionOnButton.x = msgBox.width / 2 - bulletCollisionOnButton.width - 10;
        bulletCollisionOnButton.y = msgBox.y + bulletCollisionText.height + 70;
        bulletCollisionOnButton.inputEnabled = true;
        bulletCollisionOnButton.events.onInputDown.add(this.turnOnBulletsCollision,this);

        bulletCollisionOffButton.wordWrapWidth = back * 0.8;
        bulletCollisionOffButton.addColor("#ffffff", 0);
        bulletCollisionOffButton.x = msgBox.width / 2 + 10;
        bulletCollisionOffButton.y = msgBox.y + bulletCollisionText.height + 70;
        bulletCollisionOffButton.inputEnabled = true;
        bulletCollisionOffButton.events.onInputDown.add(this.turnOffBulletsCollision,this);

        m_vol_text.wordWrapWidth = back * 0.8;
        m_vol_text.addColor("#ffffff", 0);
        m_vol_text.x = msgBox.width / 3 - 90;
        m_vol_text.y = restartButton1.y - 80;

        m_volumeUp.wordWrapWidth = back * 0.8;
        m_volumeUp.addColor("#ffffff", 0);
        m_volumeUp.x = msgBox.width / 3;
        m_volumeUp.y = restartButton1.y - 60;
        m_volumeUp.inputEnabled = true;
        m_volumeUp.events.onInputDown.add(this.m_VolumeUp, this);

        m_volumeDown.wordWrapWidth = back * 0.8;
        m_volumeDown.addColor("#ffffff", 0);
        m_volumeDown.x = msgBox.width / 3 - 60;
        m_volumeDown.y = restartButton1.y - 60;
        m_volumeDown.inputEnabled = true;
        m_volumeDown.events.onInputDown.add(this.m_VolumeDown, this);

        m_volume.wordWrapWidth = back * 0.8;
        m_volume.addColor("#ffffff", 0);
        if(music.volume == 1.0) m_volume.x = msgBox.width / 3 - 50;
        else m_volume.x =  msgBox.width / 3 - 40;
        m_volume.y = restartButton1.y - 60;

        sfx_volume_text.wordWrapWidth = back * 0.8;
        sfx_volume_text.addColor("#ffffff", 0);
        sfx_volume_text.x = msgBox.width / 3 + 80;
        sfx_volume_text.y = restartButton1.y - 80;

        sfx_volumeUp.wordWrapWidth = back * 0.8;
        sfx_volumeUp.addColor("#ffffff", 0);
        sfx_volumeUp.x = 2 * msgBox.width / 3 + 50;
        sfx_volumeUp.y = restartButton1.y - 60;
        sfx_volumeUp.inputEnabled = true;
        sfx_volumeUp.events.onInputDown.add(this.sfx_volumeUp, this);

        sfx_volumeDown.wordWrapWidth = back * 0.8;
        sfx_volumeDown.addColor("#ffffff", 0);
        sfx_volumeDown.x = 2 * msgBox.width / 3 - 10;
        sfx_volumeDown.y = restartButton1.y - 60;
        sfx_volumeDown.inputEnabled = true;
        sfx_volumeDown.events.onInputDown.add(this.sfx_volumeDown, this);

        sfx_volume.wordWrapWidth = back * 0.8;
        sfx_volume.addColor("#ffffff", 0);
        if(sfx_fire.volume == 1.0) sfx_volume.x = 2 * msgBox.width / 3;
        else sfx_volume.x = 2 * msgBox.width / 3 + 10;
        sfx_volume.y = restartButton1.y - 60;

        this.msgBox = msgBox;
        settingButton.inputEnabled = true;
        settings.inputEnabled = true;
    },

    goMenu1 : function() {
        game.paused = false;
        music.stop();
        game.state.start('mainMenu');
    },

    goMenu : function() {
        this.msgBox.destroy();
        game.paused = false;
        music.stop();
        game.state.start('mainMenu');
    },
    startGame : function() {
        //this.Game.destroy();
        //this.msgBox.destroy();
        game.paused = false;
        music.stop();
        game.state.start('Game');
        minutes = 0;
        seconds = 0;
    },
    hideBox : function(){
        this.msgBox.destroy();
        settingButton.inputEnabled = false;
        settings.inputEnabled = false;
        setTimeout(function()
        {
            var resumetimer = game.add.text(game.world.centerX, game.world.centerY, 3, { font: '124px Arial', fill: '#00f' });
            resumetimer.anchor.setTo(0.5, 0.5);
            setTimeout(function(){resumetimer.destroy();}, 999);
        }, 0);
        setTimeout(function()
        {
            var resumetimer = game.add.text(game.world.centerX, game.world.centerY, 2, { font: '124px Arial', fill: '#00f' });
            resumetimer.anchor.setTo(0.5, 0.5);
            setTimeout(function(){resumetimer.destroy();}, 999);
        }, 1000);
        setTimeout(function()
        {
            var resumetimer = game.add.text(game.world.centerX, game.world.centerY, 1, { font: '124px Arial', fill: '#00f' });
            resumetimer.anchor.setTo(0.5, 0.5);
            setTimeout(function(){resumetimer.destroy();}, 999);
        }, 2000);
        setTimeout(function(){
            game.paused = false;
            settingButton.inputEnabled = true;
            settings.inputEnabled = true;
        }, 3000);
    },
    hideBox1 : function(){
        this.msgBox1.destroy();
        this.showSettingMessageBox();
    },
    real : function(){
        this.msgBox.destroy();
        settingButton.inputEnabled = false;
        settings.inputEnabled = false;
        var msgBox1 = game.add.group();
        var back1 = game.add.sprite(300,200,'settingBack1');
        var real_exit = game.add.text(310,250,'Do you want to go main menu?',{ fontSize: 19 });
        var yes = game.add.text(370,310,'yes',{ fontSize: 19 });
        var no = game.add.text(500,310,'no',{ fontSize: 19 });
        msgBox1.add(back1);
        msgBox1.add(real_exit);
        msgBox1.add(yes);
        msgBox1.add(no);
        real_exit.wordWrapWidth = back1;
        real_exit.addColor("#ffffff", 0);
        yes.wordWrapWidth = back1;
        yes.addColor("#ffffff", 0);
        no.wordWrapWidth = back1;
        no.addColor("#ffffff", 0);
        no.inputEnabled = true;
        yes.inputEnabled = true;
        yes.events.onInputDown.add(this.goMenu,this);
        no.events.onInputDown.add(this.hideBox1,this);
        this.msgBox1 = msgBox1;
    },

    turnOnMusic : function(){
        music.play();
        music_status = 'ON';
        musicText.text = musicString + music_status;
    },

    turnOffMusic : function(){
        music.stop();
        music_status = 'OFF';
        musicText.text = musicString + music_status;
    },

    turnOnDbgMsg : function(){
        debugFlag = true;
        console.log("debugFlag is now on");
    },

    turnOffDbgMsg : function(){
        debugFlag = false;
        console.log("debugFlag is now off");
    },

    turnOnBulletsCollision : function(){
        bulletsCollision = true;
        console.log("bulletsCollision is now on");
        bulletsCollision_status = 'ON';
        bulletsCollisionText.text = bulletsCollisionString + bulletsCollision_status;
    },

    turnOffBulletsCollision : function(){
        bulletsCollision = false;
        console.log("bulletsCollision is now off");
        bulletsCollision_status = 'OFF';
        bulletsCollisionText.text = bulletsCollisionString + bulletsCollision_status;
    },

    debugCollisionMessage : function(object1, object2){

        var object1Color, object2Color;

        if (object1.key.localeCompare("bullet") == 0){
            if (object2.key.localeCompare("invader") == 0){
                object1Color = "color:blue";
                object2Color = "color:red";
            }
            else if (object2.key.localeCompare("enemyBullet") == 0){
                object1Color = "color:blue";
                object2Color = "color:purple";
            }
            else{
                object1Color = "color:blue";
                object2Color = "color:green";
            }
        }
        else if (object1.key.localeCompare("ship") == 0){
            if (object2.key.localeCompare("invader") == 0){
                object1Color = "background:blue; color:white";
                object2Color = "color:red";
            }
            else if (object2.key.localeCompare("enemyBullet") == 0){
                object1Color = "background:blue; color:white";
                object2Color = "color:purple";
            }
            else{
                object1Color = "background:blue; color:white";
                object2Color = "color:green";
            }
        }
        console.log("Collision occured between %c"+object1.key+"( X:"+object1.centerX+", Y:"+object1.centerY+" )\n"+
                        "%c and %c"+object2.key+"( X:"+object2.centerX+", Y:"+object2.centerY+" )\n"+
                        "%c at ( X: "+(object1.centerX+object2.centerX)/2+"Y: "+(object1.centerY+object2.centerY)/2+" )",
                        object1Color,
                        "color:black",
                        object2Color,
                        "color:black");
        if (isShield && (object2.key.localeCompare("invader") == 0 || object2.key.localeCompare("enemyBullet") == 0)) {
            console.log("Shield block: shield will be down in "+ Math.round((player.invincibleTime - game.time.now)/1000) + "s");
        }
    },

    m_VolumeUp : function() {
        if(music.volume <= 0.9) music.volume += 0.1;
        this.showSettingMessageBox();
    },

    m_VolumeDown : function() {
        if(music.volume >= 0.1) music.volume -= 0.1;
        this.showSettingMessageBox();
    },

    sfx_volumeUp : function() {
        if(sfx_fire.volume <= 0.9) {
            sfx_fire.volume += 0.1;
            sfx_enemy_die.volume += 0.1;
            sfx_stage_clear.volume += 0.1;
            sfx_player_hit.volume += 0.1;
            sfx_get_item.volume += 0.1;
        }
        this.showSettingMessageBox();
    },

    sfx_volumeDown : function() {
        if(sfx_fire.volume >= 0.1) {
            sfx_fire.volume -= 0.1;
            sfx_enemy_die.volume -= 0.1;
            sfx_stage_clear.volume -= 0.1;
            sfx_player_hit.volume -= 0.1;
            sfx_get_item.volume -= 0.1;
        }
        this.showSettingMessageBox();
    }
}