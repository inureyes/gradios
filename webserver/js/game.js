var aliens;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var enemyBullets;
var itemGroup;
var myItemList;
var ailencreatetimer;
var ailencreatecount = 0;
var alienHealth = 1;
var livingEnemies = [];
var music;
var sfx_fire;
var sfx_enemy_die;
var sfx_stage_clear;
var sfx_player_hit;
var sfx_get_item;
var stage = 1;
var stageString = '';
var stageText;
var alienString;
var alienkill=0;
var alienkillText;
var aliensString;
var alienscount;
var settings;
var settingButton;
var debugFlag = false;
var music_status;
var bulletsCollision = true;
var bulletsCollision_status;
var seconds = 0;
var minutes = 0;
var itemchangetime;
var shiptype = 0;
var ship1button;
var ship2button;
var resumeByESC;
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
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        //bullet
        game.load.image('bullet', 'img/bullet.png');
        game.load.spritesheet('laser', 'img/blue_beam_ani.png', 900, 30);
        game.load.image('enemyBullet', 'img/enemy-bullet.png');
        //map
        game.load.image('starfield', 'img/starfield.png');
        game.load.image('lower_mountain', 'img/lower_mountain.png');
        game.load.image('upper_mountain', 'img/upper_mountain.png');
        //item
        game.load.image('heart', 'img/heart.png');
        game.load.image('superArmor', 'img/shield.png');
        game.load.image('damageUp','img/power_up.png');
        game.load.image('speedUp', 'img/speed_up.png');
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
        itemchangetime = 0;
        bulletTime = 0;
        score = 0;
        alienkill = 0;
        scoreString = '';
        firingTimer = 0;
        livingEnemies = [];
        countstage = 1;
        stage = 1;
        stageString = '';
        alienHealth = 1;

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
        Player.initalize(game);
        
        //  Our bullet group
        Bullets.initalize(game);

        // itemGroup
        itemGroup = game.add.group();
        itemGroup.enableBody = true;
        itemGroup.physicsBodyType = Phaser.Physics.ARCADE;
        myItemList = {};

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


        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(200, 'kaboom', 100, false);
        explosions.forEach(this.setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        activeButton = game.input.keyboard.addKey(Phaser.Keyboard.Q);

        var me = this;

        me.startTime = new Date();
        me.totalTime = 120;
        me.timeElapsed = 0;

        me.createTimer();

        me.gameTimer = game.time.events.loop(1000, function(){
            me.updateTimer();
        });
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

        if (Player.sprite.alive) {
            if((game.time.now > ailencreatetimer && ailencreatecount < 10*stage) || aliens.countLiving() === 0)  {
                this.createAliens();
            }

            alienscount.text = aliensString + aliens.countLiving();

            if (game.time.now > firingTimer) {
                this.enemyFires();
            }

            //  Run collision
            game.physics.arcade.overlap(Bullets.bulletGroup, aliens, this.collisionHandler, null, this);
            if (Bullets.info.collideEnemyBullet){
                game.physics.arcade.overlap(Bullets.bulletGroup, enemyBullets, this.playerBreakEnemyBullet, null, this);
            }
            game.physics.arcade.overlap(Player.sprite, aliens, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(Player.sprite, enemyBullets, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(Player.sprite, itemGroup, this.getItem, null, this);
        }
    },   

    createAliens : function() {
        let alienImage;
        let alienHealth;
        let alienSizeMultiple;
        let specialEnemyPer = Math.random()*100;
        if(specialEnemyPer < Math.floor(stage/15)){
            alienImage = 'invaderPurple';
            alienHealth = 3;
            alienSizeMultiple = 2;
        }
        else if(specialEnemyPer < Math.floor(stage/10)+3){
            alienImage = 'invaderGreen';
            alienHealth = 2.5;
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
        while(game.physics.arcade.overlap(alien, aliens) || game.physics.arcade.overlap(alien, Player.sprite)){
            alien.kill();
            movepoint_y = Math.random() * 540 + 30;
            alien = aliens.create(movepoint_x, movepoint_y, alienImage);
        }
        alien.maxHealth = (1 + 2*Math.floor(stage/5))*alienHealth;
        alien.setHealth(alien.maxHealth);
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

            
        // var tween = game.add.tween(aliens).to( { y: 500 }, 2000, Phaser.Easing.Cubic.Out, true, 0, 0, true);


        // When the tween loops it calls descend
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

    collisionHandler : function(bullet, alien) {

        if (debugFlag){
            this.debugCollisionMessage(bullet, alien);
        }
        //  When a bullet hits an alien we kill them both
        Bullets.killBullet(bullet);

        // alien.kill();
        alien.damage(Bullets.info.damage);
        if(!alien.alive) {
            this.makeRandomItem(alien.body.x, alien.body.y, -120, (Math.random()*2-1)*120, alien.key);
            alienkill++;
        }
        sfx_enemy_die.play();

        //  Increase the score
        score += 40*Player.sprite.health;
        scoreText.text = scoreString + score;
        alienkillText.text = alienString + alienkill;
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);

        if (aliens.countLiving() === 0 && ailencreatecount >= stage*10) {
            this.makeRandomItem(alien.body.x, alien.body.y, -120, (Math.random()*2-1)*120, 'invaderGreen');
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

    makeRandomItem : function(x, y, x_vel = 0, y_vel = 0, alienType){
        var itemIndex;
        if(alienType == 'invaderPurple' && uncommonDropTime == 0){
            itemIndex = dropTable.uncommon[Math.floor(Math.random()*dropTable.uncommon.length)];
            uncommonDropTime += 1;
        }
        else if(alienType == 'invaderGreen'){
            itemIndex = dropTable.common[Math.floor(Math.random()*dropTable.common.length)];
        }
        else{
            return;
        }

        itemSprite = itemGroup.create(x, y, itemList[itemIndex].name);
        itemSprite.setHealth(itemIndex);
        itemSprite.anchor.setTo(0.5, 0.5);
        itemSprite.body.velocity.x = x_vel;
        itemSprite.body.velocity.y = y_vel;

        itemSprite.body.collideWorldBounds = true;
        itemSprite.body.bounce.set(1);
        game.time.events.add(Phaser.Timer.SECOND * 10, function() {
            if(itemSprite.alive){
                itemSprite.body.collideWorldBounds = false;
            }
        }, this);
        var itemText = game.make.text(0, 30, itemList[itemIndex].name, {font: "15px Arial", fill: "#fff"});
        itemText.anchor.setTo(0.5, 0.5)
        itemSprite.addChild(itemText);

        return itemSprite;
    },

    getItem : function(player, itemSprite){
        item = itemList[itemSprite.health];
        console.log(item);
        item.applyItem(myItemList);
        itemSprite.destroy();
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

    playerBreakEnemyBullet : function(bullet, enemyBullet) {
        if(debugFlag){
            this.debugCollisionMessage(bullet, enemyBullet);
        }
        Bullets.killBullet(bullet);
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
        // console.log(Player.info.invincibleTime + " " + game.time.now);
        if (((game.time.now < Player.info.invincibleTime) && Player.info.isInvinsible == false) || !aliens.countLiving()) return;
        // console.log(1);
        game.add.audio('sfx_player_hit');
        sfx_player_hit.volume = 0.6;
        sfx_player_hit.play();
        if (Player.info.isInvinsible == false) Player.damage(1);

        object.kill();

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
        
        if (!Player.sprite.alive) {
            countstage = 1;
            seconds = 0;
            minutes = 0;
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

        Player.info.invincibleTime = game.time.now + 1000;
        // blink player
        if (Player.info.isInvinsible == false) game.add.tween(player).to( { alpha : 0.2 }, 250, Phaser.Easing.Linear.None, true, 0, 1, true);
    },

    finishGame : function() {
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
            game.physics.arcade.moveToObject(enemyBullet,Player.sprite,100 + 20 * countstage);
            firingTimer = game.time.now + 2000 / countstage;
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
        var backgroundMusicText = game.add.text(0,0, 'Music', { fontSize: 19 });
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

        resumeByESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        resumeByESC.onDown.add(this.hideBox, this);

        backgroundMusicText.wordWrapWidth = back * 0.8;
        backgroundMusicText.addColor("#ffffff", 0);
        backgroundMusicText.x = msgBox.width / 2 - backgroundMusicText.width / 2;
        backgroundMusicText.y = msgBox.y - 40;

        musicOnButton.wordWrapWidth = back * 0.8;
        musicOnButton.x = msgBox.width / 2 - musicOnButton.width - 10;
        musicOnButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOnButton.inputEnabled = true;
        musicOnButton.events.onInputDown.add(this.turnOnMusic,this);

        musicOffButton.wordWrapWidth = back * 0.8;
        musicOffButton.x = msgBox.width / 2 + 10;
        musicOffButton.y = msgBox.y + backgroundMusicText.height - 40;
        musicOffButton.inputEnabled = true;
        musicOffButton.events.onInputDown.add(this.turnOffMusic,this);
        if (music_status == "ON") {
            musicOnButton.addColor("#fff500", 0);
            musicOffButton.addColor("#ffffff", 0);
        }
        else {
            musicOnButton.addColor("#ffffff", 0);
            musicOffButton.addColor("#fff500", 0);
        }

        dbgMsgText.wordWrapWidth = back * 0.8;
        dbgMsgText.addColor("#ffffff", 0);
        dbgMsgText.x = msgBox.width / 2 - dbgMsgText.width / 2;
        dbgMsgText.y = msgBox.y + 15;

        dbgMsgOnButton.wordWrapWidth = back * 0.8;
        dbgMsgOnButton.x = msgBox.width / 2 - dbgMsgOnButton.width - 10;
        dbgMsgOnButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOnButton.inputEnabled = true;
        dbgMsgOnButton.events.onInputDown.add(this.turnOnDbgMsg,this);

        dbgMsgOffButton.wordWrapWidth = back * 0.8;
        dbgMsgOffButton.x = msgBox.width / 2 + 10;
        dbgMsgOffButton.y = msgBox.y + dbgMsgText.height + 15;
        dbgMsgOffButton.inputEnabled = true;
        dbgMsgOffButton.events.onInputDown.add(this.turnOffDbgMsg,this);
        if (debugFlag) {
            dbgMsgOnButton.addColor("#fff500", 0);
            dbgMsgOffButton.addColor("#ffffff", 0);
        }
        else {
            dbgMsgOnButton.addColor("#ffffff", 0);
            dbgMsgOffButton.addColor("#fff500", 0);
        }

        bulletCollisionText.wordWrapWidth = back * 0.8;
        bulletCollisionText.x = msgBox.width / 2 - bulletCollisionText.width / 2;
        bulletCollisionText.y = msgBox.y + 70;
        bulletCollisionText.addColor("#ffffff", 0);

        bulletCollisionOnButton.wordWrapWidth = back * 0.8;
        bulletCollisionOnButton.x = msgBox.width / 2 - bulletCollisionOnButton.width - 10;
        bulletCollisionOnButton.y = msgBox.y + bulletCollisionText.height + 70;
        bulletCollisionOnButton.inputEnabled = true;
        bulletCollisionOnButton.events.onInputDown.add(this.turnOnBulletsCollision,this);

        bulletCollisionOffButton.wordWrapWidth = back * 0.8;
        bulletCollisionOffButton.x = msgBox.width / 2 + 10;
        bulletCollisionOffButton.y = msgBox.y + bulletCollisionText.height + 70;
        bulletCollisionOffButton.inputEnabled = true;
        bulletCollisionOffButton.events.onInputDown.add(this.turnOffBulletsCollision,this);

        if (Bullets.info.collideEnemyBullet) {
            bulletCollisionOnButton.addColor("#fff500", 0);
            bulletCollisionOffButton.addColor("#ffffff", 0);
        }
        else {
            bulletCollisionOnButton.addColor("#ffffff", 0);
            bulletCollisionOffButton.addColor("#fff500", 0);
        }

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
        resumeByESC.reset();
        game.input.enabled = false;
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
            game.input.enabled = true;
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
        sfx_fire.volume = 0.5;
        sfx_enemy_die.volume = 0.5;
        sfx_stage_clear.volume = 0.5;
        sfx_player_hit.volume = 0.5;
        sfx_get_item.volume = 0.5;
        musicText.text = musicString + music_status;
        this.showSettingMessageBox();
    },

    turnOffMusic : function(){
        music.stop();
        music_status = 'OFF';
        sfx_fire.volume = 0;
        sfx_enemy_die.volume = 0;
        sfx_stage_clear.volume = 0;
        sfx_player_hit.volume = 0;
        sfx_get_item.volume = 0;
        musicText.text = musicString + music_status;
        this.showSettingMessageBox();
    },

    turnOnDbgMsg : function(){
        debugFlag = true;
        console.log("debugFlag is now on");
        this.showSettingMessageBox();
    },

    turnOffDbgMsg : function(){
        debugFlag = false;
        console.log("debugFlag is now off");
        this.showSettingMessageBox();
    },

    turnOnBulletsCollision : function(){
        Bullets.info.collideEnemyBullet = true;
        console.log("bulletsCollision is now on");
        bulletsCollision_status = 'ON';
        bulletsCollisionText.text = bulletsCollisionString + bulletsCollision_status;
        this.showSettingMessageBox();
    },

    turnOffBulletsCollision : function(){
        Bullets.info.collideEnemyBullet = false;
        console.log("bulletsCollision is now off");
        bulletsCollision_status = 'OFF';
        bulletsCollisionText.text = bulletsCollisionString + bulletsCollision_status;
        this.showSettingMessageBox();
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