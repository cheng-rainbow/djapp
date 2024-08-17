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


