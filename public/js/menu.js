var easyStart;

var mainMenu = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('startButton', 'img/startbutton.png');
        game.load.image('controls', 'img/controls.png');       
        game.load.image('controlkey', 'img/controlkey.png');
    },

    create : function() {
    	var image = game.add.image(0,0,'Wall_paper');
        game.stage.background = image;
        game.add.button(350,270,'startButton', this.startGame, this);
        game.add.button(390,330,'controls', this.ViewControls, this);
        easyStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    update : function() {
        if (easyStart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        this.state.start('Game');
    },

    ViewControls : function() {
       game.add.button(250,330,'controlkey', this.ViewControls, this);
    },

}
