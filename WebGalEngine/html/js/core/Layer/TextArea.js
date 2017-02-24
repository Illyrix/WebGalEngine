const TextArea = class txtArea {
    constructor (MessageLayer) {
        let self = this;

        Object.defineProperty(this, 'div', {enumerable: false, configurable: true, writable: true});
        this.div = document.createElement('div');
        MessageLayer.div.appendChild(this.div);

        this.div.style.position = "absolute";      // 修改为绝对定位
        this.div.style.backgroundPosition = "top left";
        this.div.style.backgroundAttachment = "fixed";
        this.div.style.backgroundRepeat = "no-repeat";
        this.div.style.overflow = "hidden";
        this.div.onmouseenter = function() {
            var tFont = self.font; self.font = self.hoverFont;
            var tBorder = self.border; self.border = self.hoverBorder;
            var tBorderRadius = self.borderRadius;
            self.borderRadius = self.hoverBorderRadius;
            var tBgColor = self.bgcolor; self.bgcolor = self.hoverBgColor;
            var tBgImage = self.bgimage; self.bgimage = self.hoverBgImage;
            self.div.onmouseleave = function () {
                self.font = tFont;
                self.border = tBorder;
                self.borderRadius = tBorderRadius;
                self.bgcolor = tBgColor;
                self.bgimage = tBgImage;
                self.update();
            };
            self.update();
        };
        this.text = EngineUser.Default.TextAreaText;

        const protectHandler = {
            get: (target, key, receiver) => Reflect.get(target, key, receiver),
            set: (target, key, value, receiver) => {
                if (typeof value != "string") {
                    throw new Error(`Cannot set attribute ${key} of font as not a string`);
                }
                Reflect.set(target, key, value, receiver);
                self.update();
                return true;
            },
            isExtensible: () => false
        };

        let font = Object.assign({}, window.EngineUser.Default.TextAreaFont);
        // 阻止修改font属性(但可以修改其值)
        Object.seal(font);
        this.font = new Proxy(font, protectHandler);
        // 查阅text-shadow(阴影)和-webkit-text-stroke(描边)相关资料

        let border = Object.assign({}, window.EngineUser.Default.TextAreaBorder);
        Object.seal(border);
        this.border = new Proxy(border, protectHandler);

        this.color = window.EngineUser.Default.TextAreaColor;
        this.top = window.EngineUser.Default.TextAreaTop;
        this.left = window.EngineUser.Default.TextAreaLeft;
        this.bottom = window.EngineUser.Default.TextAreaBottom;
        this.right = window.EngineUser.Default.TextAreaRight;
        this.width = window.EngineUser.Default.TextAreaWidth;
        this.height = window.EngineUser.Default.TextAreaHeight;
        // 删除某个位置设定即设置为"" eg: this.top = "";

        this.borderRadius = window.EngineUser.Default.TextAreaBorderRadius;


        // 自动居中
        this.autoMargin = window.EngineUser.Default.TextAreaAutoMargin;

        this.bgcolor = window.EngineUser.Default.TextAreaBgColor;
        this.bgimage = window.EngineUser.Default.TextAreaBgImage;

        // 自定义:hover效果的css代码
        let hoverFont = Object.assign({}, window.EngineUser.Default.TextAreaFont);
        Object.seal(hoverFont);
        let hoverBorder = Object.assign({}, window.EngineUser.Default.TextAreaBorder);
        Object.seal(hoverBorder);
        this.hoverFont = new Proxy(hoverFont, protectHandler);
        this.hoverBorder = new Proxy(hoverBorder, protectHandler);
        this.hoverBorderRadius = window.EngineUser.Default.TextAreaBorderRadius;
        this.hoverBgColor = window.EngineUser.Default.TextAreaBgColor;
        this.hoverBgImage = window.EngineUser.Default.TextAreaBgImage;

        // 不执行一个字一个字显示的动画
        this.noAnime = window.EngineUser.Default.TextAreaNoAnime;

        this.onLClick = window.EngineUser.Default.TextAreaOnLeftClick;
        this.onRClick = window.EngineUser.Default.TextAreaOnRightClick;
        // 只有左右键单击的事件监听, 中键滚轮是全局的
        this.div.onclick = e => {
            if (e.button == 0 && window.Engine.Control.lClickEnabled)      // 左键摁下
                self.onLClick(e);
        };
        this.div.oncontextmenu = e => {
            if (e.button == 2 && window.Engine.Control.rClickEnabled)      // 右键摁下
                self.onRClick(e);
            return true;
        };

        // 显示在区域内的字符串.用于动画的中间过程
        this.strShown = "";
        Object.defineProperty(this, 'stopDraw', {enumerable: false, configurable: true, writable: true});
        this.stopDraw  = {};      // 用于中断绘制动画, 外部只能设置为 true

        this.updates = {};          // 在 update 需要调用的回调 (property: function...)

        Object.defineProperty(this, 'self', {enumerable: false, configurable: true, writable: true});
        this.self =  this;
        let proxy = new Proxy(this, {
            get: function (target, key) {
                if (key[0] !== undefined && key[0] == "_") {
                    return target[key.slice(1)];
                }
                return target[key];
            },
            set: function (target, key, value) {
                if (key[0] !== undefined && key[0] == "_") {
                    target[key.slice(1)] = value;
                } else {
                    if (['stopDraw', 'bgimage', 'text'].indexOf(key) != -1) {
                        if (key == 'text') {
                            target[key] = value;
                            target.show();
                        }
                        if (key == 'stopDraw') {
                            if (value)
                                for (let i  in target.stopDraw) {
                                    target.stopDraw[i] = true;
                                }
                            target.update();
                        }
                        if (key == 'bgimage') {
                            if (typeof value == "string" && value.toLowerCase().slice(0, 3) == 'url')
                                target.bgimage = "url(" + value +")";
                            else
                                target.bgimage = value;
                            target.update();
                        }
                    } else {
                        target[key] = value;
                        target.update();
                    }
                }
                return true;
            },
            deleteProperty: function(target, property) {
                if (target.updates[property] != undefined) {
                    Reflect.deleteProperty(target.updates, property);
                }
                return Reflect.deleteProperty(target, property);
            }
        });
        MessageLayer.TextAreas.push(proxy);
        return proxy;
    }

    // 一般来说外部调用的 this 是 Proxy, 不是原来的对象
    update () {
        let self = this.self || this;
        self.div.innerHTML = self.strShown;     // 注意这里不是self.text
        self.div.style.left = (typeof self.left == "number")?(self.left+"px"):self.left;
        self.div.style.right = (typeof self.right == "number")?(self.right+"px"):self.right;
        self.div.style.top = (typeof self.top == "number")?(self.top+"px"):self.top;
        self.div.style.bottom = (typeof self.bottom == "number")?(self.bottom+"px"):self.bottom;
        self.div.style.width = (typeof self.width == "number")?(self.width+"px"):self.width;
        self.div.style.height = (typeof self.height == "number")?(self.height+"px"):self.height;
        self.div.style.color = self.color;
        self.div.style.borderWidth = self.border["border-width"];
        self.div.style.borderStyle = self.border["border-style"];
        self.div.style.borderColor = self.border["border-color"];
        self.div.style.borderRadius = (typeof self.borderRadius == "number")?(self.borderRadius+"px"):self.borderRadius;
        self.div.style.backgroundColor = (self.bgcolor)?self.bgcolor:"";
        self.div.style.backgroundImage = (self.bgimage)?self.bgimage:"";
        self.div.style.fontFamily = self.font["font-family"];
        self.div.style.fontSize = self.font["font-size"];
        self.div.style.fontWeight = self.font["font-weight"];
        self.div.style.lineHeight = self.font["line-height"];
        self.div.style.textShadow = self.font["text-shadow"];
        self.div.style.WebkitTextStroke = self.font["-webkit-text-stroke"];
        self.div.style.WebkitTextFillColor = self.color;
        // 设置autoMargin的时候会自动无视left和right的设定值
        if (self.autoMargin && self.width) {
            var pNwidth = self.div.parentNode.offsetWidth;
            var margin = (pNwidth - parseInt(self.width))/2;
            self.div.style.left = margin + "px";
            self.div.style.right = "auto";
        }
        for (let i in self.updates) {
            self.updates[i].call(self);
        }
    }

    show (text = this.text, time = window.Engine.Setting.readTxtSpd, interrupt = true, callable) {
        let self = this.self || this;
        if (self.noAnime) {
            self.strShown = text;
            return;
        }
        self.text = text;
        for (let i  in self.stopDraw) {
            self.stopDraw[i] = true;
        }
        self.update();
        for (let i = 0; i <= Object.keys(self.stopDraw).length; i++) {
            if (self.stopDraw[i] === undefined) {
                self.stopDraw[i] = false;
                var stopInt = i;
                break;
            }
        }
        if (stopInt === undefined) throw new Error("Insert index to stopDraw failed")
        let count = 0;
        let cpyText = self.text;    // 复制一份text以防止text在动画未完成时修改
        (function interval() {
            if (self.stopDraw[stopInt]) {
                delete self.stopDraw[stopInt];
                if (Object.keys(self.stopDraw).length == 0)
                    self.strShown = self.text;
                self.update();
                if (typeof callable == "function") callable.call(self.self);                         // callable 在动画被中断的时候执行么?
                return;
            }else{
                if (count == cpyText.length) {
                    delete self.stopDraw[stopInt];
                    if (typeof callable == "function") callable.call(self.self);
                    return;
                }
                self.strShown = cpyText.slice(0, count+1);
                self.update();
                count++;
                if (!interrupt)
                    Engine.Control.wait(time);
                setTimeout(function(){interval();}, time);
            }
        }())
    }

    // 扩展此对象
    // 属性名, 值, update的回调
    extend (prop, value, update) {
        let self = this.self || this;
        if (prop in self) {
            self[prop] = value;
        } else {
            Object.defineProperty(self, prop, {enumerable: true, configurable: true, writable: true})
            self[prop] = value;
            self.updates[prop] = update;
        }
    }

    // 此函数将会清除该TextArea上的文字和设定回默认样式(不清除位置设定).
    clear () {
        let self = this.self || this;
        for (let i in EngineUser.Default.TextAreaFont)
            self.font[i] = EngineUser.Default.TextAreaFont[i];
        self.text = EngineUser.Default.TextAreaText;         
        self.update();
    }

}

export {TextArea};