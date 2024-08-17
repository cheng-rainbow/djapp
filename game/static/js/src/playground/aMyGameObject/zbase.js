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




