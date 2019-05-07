var easyStart;
var start_sound;
var start_music;

var mainMenu = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('gradius' , 'img/gradius.png');
        game.load.image('startButton', 'img/startbutton.png');
        game.load.image('controls', 'img/controls.png');
        game.load.image('controlkey', 'img/controlkey-1.png');
        game.load.image('backButton', 'img/backButton.png');
        game.load.image('exit' , 'img/exit.png');
        mainMenu.load.audio('start_sound', 'audio/start_sound.mp3')
    },

    create : function() {
    	var image = game.add.image(0,0,'Wall_paper');
        var image1 = game.add.image(30,20,'gradius');
        game.stage.background = image;
        game.add.button(game.world.centerX-220,280,'startButton', this.startGame, this);
        game.add.button(game.world.centerX+20,280,'controls', this.ViewControls, this);
        game.add.button(game.world.centerX-85,380,'exit', this.exit, this);
        easyStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        if (!start_music) start_music = game.add.audio('start_sound');
        start_music.play();
    },


    update : function() {
        if (music) music.pauseOnBlur = false;
        if (easyStart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        if(music) music.stop();
        start_music.stop();
        this.state.start('Game');
    },

    ViewControls : function() {
        var image2 = game.add.image(0,360,'controlkey');
        var image3 = game.add.button(805,360,'backButton');
        image3.inputEnabled = true;
        image3.events.onInputDown.add(function(){image2.destroy();image3.destroy();});
    },

    exit : function(){
      window.open('about:blank', '_self').close();
    }
}
