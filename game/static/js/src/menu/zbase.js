
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


