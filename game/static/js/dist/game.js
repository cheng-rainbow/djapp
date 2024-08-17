
class MyGameMenu {
	constructor(root) {
		this.root = root;   
		this.$menu = $(`
				<div class="my-game-menu">
					<div class="my-game-menu-field">

						<div class="my-game-menu-field-item my-game-menu-field-item-single">
							单人模式
						</div>
                        <br>
						<div class="my-game-menu-field-item my-game-menu-field-item-multi">
							多人模式
						</div>
                        <br>
						<div class="my-game-menu-field-item my-game-menu-field-item-settings">
							设置
						</div>
					</div>
				</div>

				`);


		this.root.$mygame.append(this.$menu);
        this.$single = this.$menu.find('.my-game-menu-field-item-single');
        this.$multi = this.$menu.find('.my-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.my-game-menu-field-item-settings');
        
        this.start();
	}

    start() {
        this.add_listening_events();
    }
    
    add_listening_events() {
        let outer = this;

        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();
        });

        this.$multi.click(function(){
            console.log("click multi");
        })

        this.$settings.click(function(){
            console.log("click settings");
        })
    }

    show() {    // 显示menu界面
        this.$menu.show();
    }

    hide() {    // 关闭menu界面
        this.$menu.hide();
    }

}


let MY_GAME_OBJECT = [];


class MyGameObject {
    constructor() {
        MY_GAME_OBJECT.push(this);
        
        this.has_called_start = false;
        this.timedelta = 0;
    }

    start() {

    }
    
    update() {

    }

    on_destroy(){

    }

    destroy() {
        this.on_destroy();

        for (let i = 0; i < MY_GAME_OBJECT.length; i ++)
            if (MY_GAME_OBJECT[i] == this) {
                MY_GAME_OBJECT.splice(i, 1);
                break;
            }
    }
}

let last_timestamp;
const MY_GAME_ANIMATION = function(timestamp) {
   for (let i = 0; i < MY_GAME_OBJECT.length; i ++ ){
        let obj = MY_GAME_OBJECT[i];
        if (obj.has_called_start == false) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
   } 
    last_timestamp = timestamp;

    requestAnimationFrame(MY_GAME_ANIMATION);
} 


requestAnimationFrame(MY_GAME_ANIMATION)





class GameMap extends MyGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }
    
    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}

class Player extends MyGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.x = x;
        this.y = y;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.02;
        this.f = 0.9;
        
        this.cur_skill = null;
    }


    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    is_attacked(angle, damage) {
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;

    }

    add_listening_events() {
       let outer = this;
       this.playground.game_map.$canvas.on("contextmenu", function(e) {
               return false;
       });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                    this.cur_skill = null;
                }
            }
        })

        $(window).keydown(function(e) {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        })
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.radius * 0.3;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let speed = this.playground.width * 0.35;
        let color = "orange";
        let move_length = this.playground.height;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color,speed, move_length, this.playground.height * 0.01 );
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update() {
        if (this.damage_speed > this.eps) {
            this.vx = 0, this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.f;

           
        } else {

            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let move = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * move;
                this.y += this.vy * move;
                this.move_length -= move;
            }
        }

        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}


class FireBall extends MyGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.damage = damage;
        this.move_length = move_length;
        this.eps = 0.1;

    }
    
    start() {

    }


    update() {
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.destroy();
            return false;
        }
        
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        
        // 碰撞检测
        for (let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if (player !== this.player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 -x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }
    
    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}




class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="my-game-playground"></div>
        `);

//        this.hide();
        this.root.$mygame.append(this.$playground);

        this.start();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        
        this.game_map = new GameMap(this);
        
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height/2, this.height * 0.05, "white",this.height * 0.20, true));
        

        for (let i = 0; i < 6; i ++) {
            this.players.push(new Player(this, this.width / 3, this.height/2, this.height * 0.05,     "blue",this.height * 0.20, false));
        }
    }


    start() {
        
    }


    hide() {
        this.$playground.hide();
    }

    show() {
        this.$playground.show();
    }


}


export class MyGame {
    constructor(id) {
        this.id = id;
        this.$mygame = $('#' + id);
//        this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }

    start() {

    }

}


