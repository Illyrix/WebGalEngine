class Proc {
    constructor () {
        // scenarios: 存储分析后的Scenario:{[label:"xx", ]index:5[, func:callable]}
        // labels: {"Label1":5, "Label4":88}
        // read: 存储每个 scenario 是否已读
        // callStack: 调用栈,call之后需要返回
        // pc: 执行到哪一步
        this.scenarios = [];
        this.labels = [];
        this.read = [];
        this.callStack = [];
        this.pc = 0;
        // 从 window.EngineUser.Scenario 读入场景
        for (let i in window.EngineUser.Scenario) {
            let t = window.EngineUser.Scenario[i];
            if (typeof(t) == "object" && t.label != undefined) {
                this.scenarios[i] = {label:t.label, index:i};     // func什么都不做
                if (this.labels[t.label] == undefined)       // 避免重复的label
                    this.labels[t.label] = i;
                else
                    throw new SyntaxError("Label:\""+t.label+"\" is duplicated");
            }else {
                this.scenarios[i] = {index:i, func:t};
            }
        }
    }

    goto (label, setRead = false) {
        if (this.labels[label] == undefined)
            throw new SyntaxError("The label:\""+label+"\" cannot found");
        let dest = this.labels[label];
        // 将跳转范围内的文本标记为已读
        if (setRead && (dest > this.pc))
            for (let i = this.pc; i < dest; i++)
                this.read[i] = true;
        this.pc = dest;
    }

    call (label, setRead) {
        this.callStack.push(this.pc);
        this.goto(label, setRead);
    }

    back () {
        if (this.callStack.length == 0) {
            throw new Error("Call's nums donot match back's");
            return;
        }
        this.pc = this.callStack.pop();
    }

    next () {
        if (this.scenarios[this.pc] == undefined)
            return true;    
        if (window.Engine.Control.recordRead)
            this.read[this.pc] = true;
        if (this.scenarios[this.pc].func != undefined)    // 表示这是函数不是label
            // 调用对应function
            this.scenarios[this.pc].func();
        else{
            this.pc ++;
            return this.next();
        }
        this.pc ++;
        return false;
    }
}

export {Proc};