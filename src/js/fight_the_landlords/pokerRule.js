// 游戏规则
// 判断出的是什么类型的牌
// 单牌（single）、对子（pair）、三张（triplet）、炸弹（boom）
// 三带一（twa)、三带二（twp）、飞机带单（sota）、飞机带对（sotp）
// 顺子（straight）、连对（sop）、三连对（sot）
// 王炸（rocket）、四带二单（fbta）、四带二对（fptp）
/*
    一人17张，地主20，顺子最多12
    1：单牌
    2：对子、王炸
    3：三张
    4：三带一、炸弹
    5：顺子、三带二
---------------------------------------------
         顺子（单，双，三） 飞机（单、对）
    6：顺子、连对、三连对、四带二
    7：顺子
    8：顺子、连对、飞机带单、四带二对
    9：顺子、三连对
    10：顺子、连对、飞机带对（减-4 %3==0）
    11：顺子、飞机带单
    12：顺子、连对、三连对
    13：无
    14：连对、飞机带单（减-2 %3==0）
    15：三连对
    16：连对、飞机带对
    17：飞机带单
*/
/*
    {
        一次:
        二次:
        三次:
        四次:
    }
    function 判断连续(){
        if(arr[0]-arr[arr.length-1]==arr.length-1){
            return 连续
        }
    }
    大于 5 时
    1. 一个方法判断一个里面一次的有i个重复两次的 j 个，三次的 k 个
    2. 一个方法判断顺子
    3. 重复两次的有 m 个
    if(j==0&&k==0){
        判断连续
        return 顺子
    }else if(j*2==len){
        判断连续(m)
        return 连对
    }else if(k*3==len){
        判断连续(n)
        return 三连对
    }else {
        if(k==0 || 判断连续(k)==false){
            错误
        }
        if(2*i+k*3==len){
            return 飞机带单
        }
        else if(2*j+k*3==len){
            return 飞机带双
        }else{
            return 错误
        }
    }
*/

// 判断是不是连续
function isseries(arr) {
    if (arr[0] - arr[arr.length - 1] == arr.length - 1) {
        return true;
    } else {
        return false;
    }
}

// 重复数函数
function CountList(){
    this.one = []; // 只出现一次
    this.two = []; // 重复两次
    this.three = []; // 重复三次
    this.four = []; // 重复四次
}

// 计算重复数
function count(cards) {
    const arr = [new Set(cards)];
    const countList = new CountList();
    arr.forEach(item=>{
        const count = arr.lastIndex(item)-arr.indexOf(item)+1;
        if(count==1){
            countList.one.push(item);
        }else if(count==2){
            countList.two.push(item);
        }else if(count==3){
            countList.three.push(item);
        }else{
            countList.four.push(item);
        }
    });
    return countList;
}

// 确定牌型
function cardType(card) {
    const len = card.length;
    if (len < 1) {
        return false;
    }
    let type = null;
    // 转换成数字型数组
    let countList = count(card);
    window.console.log(countList);

    // 以 5 为界限分开来
    if (len <= 5) {
        if (len == 1) { // 单牌
            type = 'single';
        } else if (len == 2) {
            if (card[0].point == card[1].point) {
                type = 'pair'; // 对子
            } else if (card[0].point == 15 && card[1].point == 14) {
                type = 'rocket'; // 王炸
            } else {
                type = 'err';
            }
        } else if (len == 3) {
            if (card[0].point == card[1].point && card[1].point == card[2].point) {
                type = 'triple'; // 三张
            } else {
                type = 'err';
            }
        } else if (len == 4) {
            if (card[1].point == card[2].point) {
                if ((card[0].point == card[1].point || card[1].point == card[3].point)
                    && card[0].point != card[3].point) {
                    type = 'twa'; // 三带一
                } else if (card[0] == card[1] && card[1] == card[3]) {
                    type = 'boom'; // 炸弹
                } else {
                    type = 'err';
                }
            } else {
                type = 'err';
            }
        } else {
            if (isseries(card)) {
                type = 'straight';
            } else {
                type = 'err';
            }
        }
    } else {
        // 
    }


    return type;
}

export default cardType;