var easyRestart;
var ending_sound;
var ending_music;

var Ending = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('restartButton', 'img/restartbutton.png');
        game.load.image('menuButton', 'img/menubutton.png');
        Ending.load.audio('ending_sound', 'audio/ending_sound.mp3')
    },

    create : function() {
        var image = game.add.image(0,0,'Wall_paper');
        game.stage.background = image;
        game.add.button(game.world.centerX-110,320,'restartButton', this.startGame, this);
        game.add.button(game.world.centerX-110,420,'menuButton', this.goMenu, this);
        if(!ending_music) ending_music = game.add.audio('ending_sound');
        ending_music.play();
        youDied = game.add.text(game.world.centerX + 10, 100, "YOU DIED", { font: '124px Arial', fill: '#f00'}); 
        totalScore = game.add.text(game.world.centerX, 237, score, { font: '124px Arial', fill: '#00f' });
        youDied.anchor.setTo(0.5);
        totalScore.anchor.setTo(0.5);

        easyRestart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    },

    update : function() {
        if (easyRestart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        game.state.start('Game');
    },

    goMenu : function() {
        game.state.start('mainMenu');
    },

}
