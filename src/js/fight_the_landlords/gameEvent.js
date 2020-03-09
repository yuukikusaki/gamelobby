import {candeal} from './pokerRule'

// 按钮类
class Button {
    constructor(vm,that) {
        this.name = null;
        // 记录图片位置和长宽
        this.x = null;
        this.y = null;
        this.w = null;
        this.h = null;
        this.vm = vm;
        this.that = that;
    }

    // 设置图片位置
    setPosition(name, positon) {
        this.name = name;
        this.x = positon[0];
        this.y = positon[1];
        this.w = positon[2];
        this.h = positon[3];
    }

    // 获取图片位置
    getPositionX() {
        let positon = {
            x1: this.x,
            x2: this.x + this.w,
        };
        return positon;
    }


    // 1. 点击之后把数据返回给游戏主类
    // 2. 游戏主类把这些信息发送给服务器
    // 3. 如果是卡牌，则改变位置

}

// startBtn 按钮
class StartBtn extends Button {
    constructor(vm,that) {
        super(vm,that);
    }

    onClick() {
        this.vm.$socket.emit('onready');
    }
}

// 抢地主 按钮
class ScoreBtn extends Button{
    constructor(vm,that,score){
        super(vm,that);
        this.score = score;
    }
    onClick(){
        this.vm.$socket.emit('next',this.score);
    }
}

// 不出 按钮
class PassBtn extends Button {
    constructor(vm,that) {
        super(vm,that);
        this.canClick = false;
    }

    reClick(flag){
        this.canClick = flag;
    }
    onClick(deck) {
        if(this.canClick){
            return;
        }
        deck.map(card => {
            if (card.getChecked()) {
                card.isChecked = false;
                card.y += 20;
            }
        });
        this.that.drawFunc();
        // socket
        this.vm.$socket.emit('next',[]);
    }
}

// 提示 按钮
class TipBtn extends Button{

}

// 出牌 按钮
class PlayBtn extends Button {
    constructor(vm,that) {
        super(vm,that);
    }
    onClick(deck){
        // 先放入出牌列表
        let dealList = [];
        deck.map(c =>{
            if(c.getChecked()){
                dealList.push(c);
            }
        });
        let typeRank = candeal(dealList,this.that.oTR);
        window.console.log('next');
        if(typeRank==false){
            return;
        }
        window.console.log('next');
        // 删除牌组中的卡牌
        this.that.deck = deck.filter(c=>!c.getChecked());
        this.that.setDeal(dealList);
        this.that.drawFunc();
        if(this.that.deck.length==0){
            typeRank = 'win';
        }
        const dealinfo={typeRank,dealList};
        window.console.log('next');
        this.vm.$socket.emit('next',dealinfo);
    }

}

// 卡牌类
class PokerEvent {
    constructor(name,point) {
        this.name = name
        // 记录图片位置和长宽
        this.x = null;
        this.y = null;
        this.width = null;
        this.height = null;
        this.isLast = false;
        this.point = point;
        this.isChecked = false;
    }

    // 设置图片位置
    setPosition(positon) {
        this.x = positon[0];
        this.y = positon[1];
        this.width = positon[2];
        this.height = positon[3];
    }

    // 获取图片 X 坐标
    getPositionX() {
        // 最后一张是完整返回，给最后一张加个指针
        // 别的都是自己的起始到下一个起始
        // 因此返回自己的x就行
        let positon = null;
        if (this.isLast) {
            positon = {
                x1: this.x,
                x2: this.x + 105,
            };
            return positon
        } else {
            positon = {
                x1: this.x,
                x2: this.x + this.width
            }
            return positon;
        }
    }

    // 标记为最后一张图片
    setLast(flag) {
        this.isLast = flag;
    }

    getChecked() {
        return this.isChecked;
    }

    // 改变位置
    changePosition(x){
        this.x = x;
    }

    // 点击事件
    onClick() {
        if (this.isChecked) {
            this.isChecked = false;
            this.y += 20;
        } else {
            this.isChecked = true;
            this.y -= 20;
        }
        // 1. 点击之后把数据返回给游戏主类
        // 2. 游戏主类把这些信息发送给服务器
        // 3. 如果是卡牌，则改变位置
    }
}

export { ScoreBtn, StartBtn,TipBtn, PassBtn,PlayBtn, PokerEvent }