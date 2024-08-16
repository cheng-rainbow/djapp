
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



class MyGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div>游戏界面</div>
        `);

        this.hide();
        this.root.$mygame.append(this.$playground);

        this.start();
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


class MyGame {
    constructor(id) {
        this.id = id;
        this.$mygame = $('#' + id);
        this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }

    start() {

    }

}


