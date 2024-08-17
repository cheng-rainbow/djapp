
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


