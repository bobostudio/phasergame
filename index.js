const Phaser = require('phaser');
function preload (){
    this.load.image('hero', './assets/hero.png');
    this.load.image('floor','./assets/floor.png');
    this.load.image('enemy','assets/enemy.png');
    this.load.spritesheet('hero_attack', 
        'assets/hero_attack.png',
        { frameWidth: 82, frameHeight: 54 }
    );
    this.load.spritesheet('hero_walk', 
        'assets/hero_walk.png',
        { frameWidth: 82, frameHeight: 54 }
    );
    this.load.spritesheet('burst', 
        'assets/burst.png',
        { frameWidth: 163, frameHeight: 165 }
    );
}
var platforms;
var player;
var enemy;
var cursors;
var score = 0;
var scoreText;

function genFloor(platforms){
    for (let index = 0; index < config.width+32; index= index+32) {
        platforms.create(index, config.height-20, 'floor')
    }
}
function attackEnemy(player, enemy){
    //this.physics.pause();
    enemy.setTint(0xff0000);
    enemy.anims.play('burst');
    score += 10;
    scoreText.setText('Score: ' + score);
    setTimeout(()=>{
        enemy.disableBody(true,true);
    },100)    
}
function create (){
    cursors =this.input.keyboard.createCursorKeys();
    platforms = this.physics.add.staticGroup();
    enemy = this.physics.add.staticGroup();
    genFloor(platforms)
    player = this.physics.add.sprite(100, config.height-60, 'hero');
    enemy.create(260,config.height-83, 'enemy');
    enemy.create(400,config.height-83, 'enemy');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    
    this.anims.create({
        key:'idle',
        frames: this.anims.generateFrameNumbers('hero_attack',{start:0,end:1}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key:'attack',
        frames: this.anims.generateFrameNumbers('hero_attack',{start:2,end:8}),
        frameRate: 20,
        repeat: -1
    })
    this.anims.create({
        key:'walk',
        frames: this.anims.generateFrameNumbers('hero_walk',{start:0,end:7}),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key:'burst',
        frames: this.anims.generateFrameNumbers('burst',{start:2,end:3}),
        frameRate: 20,
        repeat: 1
    })

    scoreText = this.add.text(20, 0, 'score: 0', { fontSize: '40px', fill: '#fff' });
    
    this.physics.add.collider(player, enemy, attackEnemy, null, this);
}
function update ()
{
    
    if (cursors.space.isDown){
        player.anims.play('attack', true);
    }
    else if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('walk', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('walk', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('idle');
    }
}
let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 300,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {
                y:300
            },
            debug: false
        }
    },
    scene:{
        preload:preload,
        create:create,
        update: update
    }
}
const game  = new Phaser.Game(config);

