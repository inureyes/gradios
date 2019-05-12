var Player = {
    tagList : {
        changeParameter : [
            "maxHealth", "evasion", "speed", "image", "invincibleTime", "healthUp", "isInvincible"
        ],
        changeFunction : [
            "animation"
        ],
        addFunction : [
            "always", "colideEnemy", "moving"
        ]
    },
    info : {},

    initalize : function( game ) {
        this.initalizeInfo();

        this.healthGroup = game.add.group();
        for (var i = this.info.maxHealth-1; i >= 0; i--) {
            var ship = this.healthGroup.create(game.world.width - 150 + (60 * i), 60, this.info.image);
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        this.sprite = game.add.sprite(150, 300, this.info.image);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.setPlayerSprite();
        this.sprite.setHealth(this.info.maxHealth);

        this.activeItem = null;
        this.currentResource = 0;
    },

    initalizeInfo : function(){
        this.info.image = 'ship';
        this.info.speed = 200;
        this.info.maxHealth = 3;
        this.info.evasion = 0; // 0~100까지의 숫자로 풀레이어의 총알 회피 확률을 나타냄
        this.info.invincibleTime = 0;
        this.info.isInvincible = false;
        this.info.animation = function(obj){
            obj.animations.add('up', [3, 4], 2, false);
            obj.animations.add('down', [0, 1], 2, false);
        }

        for([index, addFunction] of Object.entries(this.tagList.addFunction)){
            this.info[addFunction] = {};
        }
    },
    
    setPlayerSprite : function(){
        // Todo 아직 maxHealth가 늘어나지 않음 수정 필요
        this.sprite.loadTexture(this.info.image, 0);
        
        this.sprite.maxHealth = this.info.maxHealth;
        this.sprite.body.setSize(64,32,0,16);
        this.info.animation(this.sprite);
        this.sprite.update = () => {
            if(Player.sprite.alive){
                for( functionPriority in Player.info.always ){
                    let currentFunctionList = Player.info.always[functionPriority];
                    for( functionIndex in currentFunctionList )
                    currentFunctionList[functionIndex](Player, this);
                }

                Player.move(cursors);

                if(fireButton.isDown){
                    Bullets.fire(Player.sprite, game.time.now);
                }

                if(activeButton.justDown){
                    activeItem.activate();
                }
            }
        }
    },

    applyItems : function(myItemList){
        this.initalizeInfo();

        for( [itemIndex, itemCount] of Object.entries(myItemList)){
            let getItem = itemList[itemIndex];
            let itemAbilites = getItem.abilities.Player;

            for( [key, value] of Object.entries(itemAbilites.changeFunction) ){
                this.info[key] = value;
            }
            for( [key, value] of Object.entries(itemAbilites.addFunction) ){
                for(functionPriority in value){
                    if(!this.info[key][functionPriority]){
                        this.info[key][functionPriority] = [];
                    }
                    for(i in value[functionPriority]){
                        this.info[key][functionPriority].push(value[functionPriority][i]);
                    }
                } 
            }
            
            for( let i = 0; i < itemCount; i++){
                for( [key, value] of Object.entries(itemAbilites.changeParameter) ){
                    this.info[key] = value(this.info[key]);
                }
            }
        }
        
        this.setPlayerSprite();
    },
    
    damage : function(getDamage) {
        live = this.healthGroup.getChildAt(this.info.maxHealth-this.sprite.health);
        live.alpha = 0;
        this.sprite.damage(getDamage);
    },

    heal : function(getHeal){
        console.log
        if(this.sprite.maxHealth > this.sprite.health){
            this.sprite.heal(getHeal);
            live = this.healthGroup.getChildAt(this.info.maxHealth-this.sprite.health);
            live.alpha = 0.4;
        }
    },

    move : function(cursors) {
        this.sprite.body.velocity.setTo(0, 0);

        if(cursors.left.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }

        else if(cursors.left.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }
        else if(cursors.right.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }
        else if(cursors.right.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }

        else if (cursors.left.isDown) {
            this.sprite.body.velocity.x = -this.info.speed
        }
        else if (cursors.right.isDown) {
            this.sprite.body.velocity.x = this.info.speed
        }
        else if (cursors.up.isDown) {
            this.sprite.body.velocity.y = -this.info.speed
            this.sprite.animations.play('up');
        }
        else if (cursors.down.isDown) {
            this.sprite.body.velocity.y = this.info.speed
            this.sprite.animations.play('down');
        }

        else {  // stand still
            this.sprite.animations.stop();
            this.sprite.frame = 2;
        }
    }
}