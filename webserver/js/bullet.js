var Bullets = {
    tagList : {
        changeParameter : [
            "damage", "speed", "fireRate", "fireAtOnce",
            "penetration", "image", "fireSound",
            "outOfBoundsKill", "collideEnemyBullet",
            "checkWorldBounds", "maxBulletCount"
        ],
        changeFunction : [
            "animation"
        ],
        addFunction : [
            "beforeFire", "firing", "afterFire", "hitEnemy", "always"
        ],
    },
    info : {},
    
    initalize : function( game ){
        this.bulletTime = 0;
        this.currentShotCount = 0;

        this.initalizeInfo();
        
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 1);
        this.setBulletGroup();
    },

    initalizeInfo : function(){
        this.info.image = 'bullet';
        this.info.damage = 1;
        this.info.fireRate = 0.5;
        this.info.penetration = 1;
        this.info.maxBulletCount = 100;
        this.info.speed = 6;
        this.info.fireAtOnce = 1;
        this.info.collideEnemyBullet = true;
        this.info.outOfBoundsKill = true;
        this.info.checkWorldBounds = true;
        this.info.initValue = {
            position : {x : 20, y : 0},
            velocity : {x : this.info.speed*100, y : 0}
        }
        
        this.info.fireSound = game.add.audio('sfx_fire');
        this.info.fireSound.volume = 0.2;
        
        this.info.animation = null;
        
        for([index, addFunction] of Object.entries(this.tagList.addFunction)){
            this.info[addFunction] = {};
        }
    },
    
    setBulletGroup : function(){
        this.bulletGroup.removeAll(true, true, false);
        this.bulletGroup.createMultiple(this.info.maxBulletCount, this.info.image, 100);
        this.bulletGroup.setAll('outOfBoundsKill', this.info.outOfBoundsKill);
        this.bulletGroup.setAll('checkWorldBounds', this.info.checkWorldBounds);
        Bullets.bulletGroup.forEach((x, y) => {x.penetration = y;}, this, false, this.info.penetration);
        return this.bulletGroup;
    },

    //todo : itemFormat.js에 맟춰 수정하기
    applyItems : function(myItemList){
        this.initalizeInfo();

        for( [itemIndex, itemCount] of Object.entries(myItemList)){
            let getItem = itemList[itemIndex];
            let itemAbilites = getItem.abilities.Bullets;

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
        
        this.setBulletGroup();
    },

    fire : function(player, currentTime){
        if (currentTime > this.bulletTime) {
            for(this.currentShotCount = 0; this.currentShotCount < this.info.fireAtOnce; this.currentShotCount++){
                bullet = this.bulletGroup.getFirstExists(false);

                for( functionPriority in Bullets.info.beforeFire ){
                    let currentFunctionList = Bullets.info.beforeFire[functionPriority];
                    for( functionIndex in currentFunctionList )
                    currentFunctionList[functionIndex](this, bullet);
                }
                
                if (bullet) {
                    this.info.fireSound.play();
                    bullet.reset(
                        player.x + this.info.initValue.position.x,
                        player.y + this.info.initValue.position.y
                    );
                    bullet.anchor.setTo(0, 0.5);
                    
                    if(this.info.animation != null){
                        var animationName = this.info.animation(bullet);
                        bullet.play(animationName, 120, false, true);
                    }
    
                    //  And fire it
                    bullet.body.velocity.x = this.info.initValue.velocity.x;
                    bullet.body.velocity.y = this.info.initValue.velocity.y;

                    var BM = this.info.bulletMovement;
                    bullet.update = function(){
                        for( functionPriority in Bullets.info.firing ){
                            let currentFunctionList = Bullets.info.firing[functionPriority];
                            for( functionIndex in currentFunctionList )
                            currentFunctionList[functionIndex](Bullets, this);
                        }
                    }
                    this.bulletTime = currentTime + this.info.fireRate*1000;
                }
            }
        }
    },

    killBullet : function(bullet){
        if(bullet.penetration > 0){
            bullet.penetration--;
            if(bullet.penetration == 0){
                bullet.penetration = this.info.penetration;
                bullet.kill();
            }
        }
    }
}