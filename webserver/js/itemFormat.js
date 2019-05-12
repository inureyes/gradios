// Create an object type UserException
class UndefinedTypeError {
    constructor(message) {
        this.message = message;
        this.name = "UndefinedTypeError";
    }

    toString() { return this.name + ': "' + this.message + '"'; }
}

itemAbilityTags = {
    "Player" : {
        "changeParameter" : [
            "maxHealth", "evasion", "speed", "image", "invincibleTime", "isInvincible", "healthUp", "activeItemOn"
        ],
        "changeFunction" : [
            "animation"
        ],
        "addFunction" : [
            "always", "colideEnemy", "moving"
        ]
    },
    
    "Bullets" : {
        "changeParameter" : [
            "damage", "speed", "fireRate", "fireAtOnce", "activeItemOn",
            "penetration", "image", "fireSound",
            "outOfBoundsKill", "collideEnemyBullet",
            "checkWorldBounds", "maxBulletCount"
        ],
        "changeFunction" : [
            "animation"
        ],
        "addFunction" : [
            "beforeFire", "firing", "afterFire", "hitEnemy", "always"
        ]
    },
    "active" : {
        "changeParameter" : [],
        "changeFunction" : [],
        "addFunction" : ["active"]
    }
}

itemList = [];
dropTable = {};
uncommonDropTime = 0;

class item {
    constructor(name, rarity) {
        this.name = name;
        this.rarity = rarity;
        this.abilities = {
            "Bullets" : {
                "changeParameter" : {},
                "changeFunction" : {},
                "addFunction" : {}
            },
            "Player" : {
                "changeParameter" : {},
                "changeFunction" : {},
                "addFunction" : {}
            },
            "active" : {
                "changeParameter" : {},
                "changeFunction" : {},
                "addFunction" : {}
            }
        };

        this.addToItemList();
    }

    addToItemList(){
        if(!dropTable[this.rarity]) dropTable[this.rarity] = []
        dropTable[this.rarity].push(itemList.length);
        this.itemNumber = itemList.length;
        itemList.push(this);
    }

    addAbility(appliedObj, type, tag, value, priority = 5) {
        if(!itemAbilityTags[appliedObj][type].includes(tag)) throw new UndefinedTypeError("undefined ability type!");

        if(type == "addFunction"){
            if(!this.abilities[appliedObj][type][tag]) this.abilities[appliedObj][type][tag] = {};
            if(!this.abilities[appliedObj][type][tag][priority]) this.abilities[appliedObj][type][tag][priority] = [];

            this.abilities[appliedObj][type][tag][priority].push(value);
        }
        else{
            this.abilities[appliedObj][type][tag] = value;
        }
    }

    applyItem(myItemList){
        if(this.isActiveItem) Player.activeItem = this;
        else if(!myItemList[this.itemNumber]) myItemList[this.itemNumber] = 1;
        else myItemList[this.itemNumber] += 1;
        Bullets.applyItems(myItemList);
        Player.applyItems(myItemList);
    }

    removeItem(myItemList){
        if(this.isActiveItem) Player.activeItem = null;
        else if(myItemList[this.itemNumber] == 1) delete myItemList[this.itemNumber];
        else if(myItemList[this.itemNumber] > 1) myItemList[this.itemNumber] -= 1;
        Bullets.applyItems(myItemList);
        Player.applyItems(myItemList);
    }
    
    makeActive = function(isActiveItem, duration, requireResource){
        if(this.isActiveItem) return;
        this.isActiveItem = isActiveItem;
        this.duration = duration;
        this.requireResource = requireResource;
        this.isActvate = false;

        this.addAbility("Bullets", "changeParameter", "activeItemOn", x => false);
        this.addAbility("Player", "changeParameter", "activeItemOn", x => false);
    
        this.activate = function(){
            if(!this.isActiveItem || requireResource != Player.currentResource) return;
            Player.currentResource = 0;
            if(this.duration == 0){
                for(tag in this.info.active.addFunction){
                    for(priority in this.info.active.addFunction[tag]){
                        for(func in this.info.active.addFunction[tag][prioirty]){
                            //todo

                        }
                    }
                }
            }
            else{
                this.isActivate = true;
                game.time.events.add(Phaser.Timer.SECOND * this.duration, function() {
                    this.isActivate = false;
                }, this);

                ;
            }
        }
    }
}

// 웹브라우저 콘솔에서 게임을 실행시킨 후 Bullets.addItem(laser_item);
// 를 입력하면 공격이 레이저로 바뀝니다.
// make laser item
let laser_item = new item("laser-bullet", "uncommon");

laser_item.addAbility("Bullets", "changeParameter", "damage", x => x/3);
laser_item.addAbility("Bullets", "changeParameter", "fireRate", x => x*3);
laser_item.addAbility("Bullets", "changeParameter", "image", x => 'laser');
laser_item.addAbility("Bullets", "changeParameter", "penetration", x => 0);
laser_item.addAbility("Bullets", "changeFunction", "animation", obj => {
    obj.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});
laser_item.addAbility("Bullets", "addFunction", "firing", (bulletObj, currentBullet) => {
    currentBullet.body.velocity.x = Player.sprite.body.velocity.x;
    currentBullet.body.velocity.y = Player.sprite.body.velocity.y;
});

// make pierce item
let pierce_item = new item("addPenetration", "common");

pierce_item.addAbility("Bullets", "changeParameter", "penetration", x => {
    if(x > 0) return x+1;
    else return x;
});

// make double bullet fire item
let addBullet_item = new item("addBullet", "common");

addBullet_item.addAbility("Bullets", "changeParameter", "fireAtOnce", x => x+1);
addBullet_item.addAbility("Bullets", "addFunction", "beforeFire", (bulletObj, currentBullet) => {
    bulletObj.info.initValue.position.x = 20;
    bulletObj.info.initValue.position.y = (bulletObj.currentShotCount - (bulletObj.info.fireAtOnce-1)/2)*20;
});

// make bullet tracking item
let tracking_item = new item("tracking", "uncommon");

tracking_item.addAbility("Bullets", "addFunction", "firing", (bulletObj, currentBullet) => {
    let enemy = aliens.getClosestTo({x:currentBullet.x - aliens.x,y:currentBullet.y-30});
    // console.log(enemy);
    let trackingPerformance = 0.03;
    let x = currentBullet.body.velocity.x+(enemy.body.x-currentBullet.x)*trackingPerformance;
    let y = currentBullet.body.velocity.y+(enemy.body.y-currentBullet.y)*trackingPerformance;

    let currentBulletSpeed = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );
    let expectedBulletSpeed = bulletObj.info.bulletSpeed*100;

    if( currentBulletSpeed > expectedBulletSpeed ){
        let reduceAmount = expectedBulletSpeed/currentBulletSpeed;
        x = x*reduceAmount;
        y = y*reduceAmount;
    }
    currentBullet.body.velocity.x = x;
    currentBullet.body.velocity.y = y;
}, 2);

tracking_item.addAbility("Bullets", "addFunction", "firing", (bulletObj, currentBullet) => {
    let x = currentBullet.body.velocity.x;
    let y = currentBullet.body.velocity.y;
    if(x == 0){
        if(y > 0) currentBullet.rotation = Math.PI/2;
        else currentBullet.rotation = -Math.PI/2;
    }
    else currentBullet.rotation = Math.atan(y/x);
}, 3);


let fireRateUp_item = new item("fireRateUp", "common");
fireRateUp_item.addAbility("Bullets", "changeParameter", "fireRate", x => x-0.1);

let playerSpeedUp_item = new item("speedUp", "common");
playerSpeedUp_item.addAbility("Player", "changeParameter", "speed", x => x+10);

let superArmer_item = new item("superArmor", "common");
superArmer_item.addAbility("Player", "changeParameter", "invincibleTime", x => game.time.now + 5000);
superArmer_item.addAbility("Player", "changeParameter", "image", x =>{
    game.time.events.add(Phaser.Timer.SECOND * 5, function() {
        Player.sprite.loadTexture('ship', 0);
        superArmer_item.removeItem(myItemList);
    }, this);
    return 'armerShip';
});
superArmer_item.addAbility("Player", "changeParameter", "isInvincible", x => {
    x = true;
    setTimeout(() => {
        x = false;
    }, 5000)
})

let damageUP_item = new item("damageUp", "common");
damageUP_item.addAbility("Bullets", "changeParameter", "damage", x => x+1);

let Heart_item = new item("heart", "common");
Heart_item.addAbility("Player", "changeParameter", "healthUp", x => {
    Player.heal(1);
    Heart_item.removeItem(myItemList);
});

let GLP_800_item = new item("GLP-800", "uncommon");
GLP_800_item.makeActive();



// var Shotgun_item = new item("Shotgun", "uncommon");