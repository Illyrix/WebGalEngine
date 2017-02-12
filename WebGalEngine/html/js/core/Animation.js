let Animation = {};

Animation.fideIn = ({Layer, time, direction = "left", distance = EngineUser.Default.AnimationFideInDistance}) => {
    const steps =  EngineUser.Default.AnimationFideInSteps;   // 动画的补间个数
    let i = 0;
    Layer.alpha = 0.0;
    Layer.visible = true;
    switch(direction.toLowerCase()){
        case "left":
            if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                let left = parseInt(Layer.div.style.left.slice(0, -2));
                left = left - distance;
                Layer.div.style.left = left + "px";
                let inter = setInterval(() => {
                    Layer._alpha = Layer.div.style.opacity = Layer._alpha + parseFloat(1/steps);
                    Layer.div.style.left = left+distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                let tmpRight = Layer.right = Layer.right + distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.right = tmpRight-distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else{                                                          // 通过left控制位置
                let tmpLeft = Layer.left = Layer.left - distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.left = tmpLeft+distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
                }
            break;
        case "right":
            if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                let left = parseInt(Layer.div.style.left.slice(0, -2));
                left = left + distance;
                Layer.div.style.left = left + "px";
                let inter = setInterval(() => {
                    Layer._alpha = Layer.div.style.opacity = Layer._alpha + parseFloat(1/steps);
                    Layer.div.style.left = left-distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                let tmpRight = Layer.right = Layer.right - distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.right = tmpRight+distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else{                                                          // 通过left控制位置
                let tmpLeft = Layer.left = Layer.left + distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.left = tmpLeft-distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }
            break;
        case "down":
            if (Layer.top === undefined || Layer.top === "") {
                let tmpBottom = Layer.bottom = Layer.bottom + distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.bottom = tmpBottom-distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else{
                let tmpTop = Layer.top = Layer.top - distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.top = tmpTop+distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }
            break;
        case "up":
            if (Layer.top === undefined || Layer.top === "") {
                let tmpBottom = Layer.bottom = Layer.bottom - distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.bottom = tmpBottom+distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }else{
                let tmpTop = Layer.top = Layer.top + distance;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha + parseFloat(1/steps);
                    Layer.top = tmpTop-distance/steps*i;
                    i++;
                    if (i>=steps) clearInterval(inter);
                }, time/steps);
            }
            break;
        default:
            throw new Error("Error direction input: "+direction);
    }
}

Animation.fideOut = ({Layer, time, direction = "left", distance = EngineUser.Default.AnimationFideInDistance}) => {
    let steps =  EngineUser.Default.AnimationFideInSteps;   // 动画的补间个数
    let i = 0;
    switch(direction.toLowerCase()){
        case "left":
            if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                let left = parseInt(Layer.div.style.left.slice(0, -2));
                let inter = setInterval(() => {
                Layer._alpha = Layer.div.style.opacity = Layer._alpha - parseFloat(1/steps);
                Layer.div.style.left = left-distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                i++;
                if (i>=steps) {
                    Layer.visible = false;
                    clearInterval(inter);
                }
            }, time/steps);
            }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                let tmpRight = Layer.right;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.right = tmpRight+distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }else{                                                          // 通过left控制位置
                let tmpLeft = Layer.left;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.left = tmpLeft-distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
                }
            break;
        case "right":
            if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                let left = parseInt(Layer.div.style.left.slice(0, -2));
                let inter = setInterval(() => {
                    Layer._alpha = Layer.div.style.opacity = Layer._alpha - parseFloat(1/steps);
                    Layer.div.style.left = left+distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                let tmpRight = Layer.right;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.right = tmpRight+distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }else{                                                          // 通过left控制位置
                let tmpLeft = Layer.left;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.left = tmpLeft+distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }
            break;
        case "down":
            if (Layer.top === undefined || Layer.top === "") {
                let tmpBottom = Layer.bottom;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.bottom = tmpBottom-distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }else{
                let tmpTop = Layer.top;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.top = tmpTop+distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }
            break;
        case "up":
            if (Layer.top === undefined || Layer.top === "") {
                let tmpBottom = Layer.bottom;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.bottom = tmpBottom+distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }else{
                let tmpTop = Layer.top;
                let inter = setInterval(() => {
                    Layer.alpha = Layer.alpha - parseFloat(1/steps);
                    Layer.top = tmpTop-distance/steps*i;
                    i++;
                    if (i>=steps) {
                        Layer.visible = false;
                        clearInterval(inter);
                    }
                }, time/steps);
            }
            break;
        default:
            throw new Error("Error direction input: "+direction);
    }
}

Animation.hide = ({Layer}) => {
    Layer.visible = false;
}

Animation.show = ({Layer}) => {
    Layer.visible = true;
}

export {Animation};