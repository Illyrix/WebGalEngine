const MessageLayer = class MsgLayer {
    constructor () {
        let self = this;

        this.TextAreas = [];

        Object.defineProperty(this, 'div', {enumerable: false, configurable: true, writable: true});

        this.div = document.createElement('div');
        document.getElementById("divContainer").appendChild(this.div);
        this.div.style.position = "absolute";      // 修改为绝对定位
        this.div.style.backgroundPosition = "top left";
        this.div.style.backgroundAttachment = "fixed";
        this.div.style.backgroundRepeat = "no-repeat";
        this.div.style.overflow = "hidden";
        this.div.onmouseenter = () => {
            let tBgColor = self.bgcolor; self._bgcolor = self.hoverBgColor;
            let tBgImage = self.bgimage; self.bgimage = self.hoverBgImage;
            self.div.onmouseleave = () => {
                self._bgcolor = tBgColor;
                self.bgimage = tBgImage;
            };
        };
        // 只有左右键单击的事件监听, 中键滚轮是全局的
        this.div.onclick = e => {
            if (e.button == 0 && window.Engine.Control.lClickEnabled)      // 左键摁下
                self.onLClick(e);
                // 如果要屏蔽其他元素对单击事件的处理, 阻止事件冒泡即可:
                /*
                self.onLClick = function(e){
                    //do something
                    e.stopPropagation();
                }
                */
        };
        this.div.oncontextmenu = e => {
            if (e.button == 2 && window.Engine.Control.rClickEnabled)      // 右键摁下
                self.onRClick(e);
            return true;
        };

        this.top = window.EngineUser.Default.MessageLayerTop;
        this.left = window.EngineUser.Default.MessageLayerLeft;
        this.bottom = window.EngineUser.Default.MessageLayerBottom;
        this.right = window.EngineUser.Default.MessageLayerRight;
        this.width = window.EngineUser.Default.MessageLayerWidth;
        this.height = window.EngineUser.Default.MessageLayerHeight;

        // 自动左右居中
        this.autoMargin = window.EngineUser.Default.MessageLayerAutoMargin;

        // 这里的alpha会影响上面的TextAreas,若要字的显示不受影响
        // 请使用bgcolor=rgba(255,255,255,0.5)
        // 或者带有透明度的图片作为背景
        this.alpha = window.EngineUser.Default.MessageLayerAlpha;
        this.zIndex = window.EngineUser.Default.MessageLayerZIndex;
        this.bgimage = window.EngineUser.Default.MessageLayerBgImage;
        this.bgcolor = window.EngineUser.Default.MessageLayerBgColor;
        this.visible = window.EngineUser.Default.MessageLayerVisible;

        this.hoverBgColor = window.EngineUser.Default.MessageLayerBgColor;
        this.hoverBgImage = window.EngineUser.Default.MessageLayerBgIm;
        this.onLClick = window.EngineUser.Default.MessageLayerOnLeftClick;
        this.onRClick = window.EngineUser.Default.MessageLayerOnRightClick;

        this.updates = {};          // 在 update 需要调用的回调 (property: function...)

        Object.defineProperty(this, 'self', {enumerable: false, configurable: true, writable: true});
        this.self = this;
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
                    if (['alpha', 'bgimage'].indexOf(key) != -1) {
                        if (key == 'alpha') {
                            if (value > 1) value = 1;
                            if (value < 0) value = 0;
                            target.alpha = value;
                            target.update();
                        }
                        if (key == 'bgimage') {
                            if (typeof value == "string" && value.search(/url\(.*\)/i) == -1)
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
            }
        });
        window.Engine.Draw.MessageLayers.push(proxy);
        return proxy;
    }

    update () {
        let self = this.self || this;
        self.div.style.left = (typeof self.left == "number")?(self.left+"px"):self.left;
        self.div.style.right = (typeof self.right == "number")?(self.right+"px"):self.right;
        self.div.style.top = (typeof self.top == "number")?(self.top+"px"):self.top;
        self.div.style.bottom = (typeof self.bottom == "number")?(self.bottom+"px"):self.bottom;
        self.div.style.backgroundColor = (self.bgcolor)?self.bgcolor:"";
        self.div.style.backgroundImage = (self.bgimage)?self.bgimage:"";
        self.div.style.width = (typeof self.width == "number")?(self.width+"px"):self.width;
        self.div.style.height = (typeof self.height == "number")?(self.height+"px"):self.height;
        self.div.style.zIndex = (self.zIndex)?self.zIndex:"";
        self.div.style.display = (self.visible)?"block":"none";
        self.div.style.opacity = self.alpha;
        // 设置autoMargin的时候会自动无视left和right的设定值
        if (self.autoMargin && self.width) {
            let pNwidth = self.div.parentNode.offsetWidth;
            let margin = (pNwidth - parseInt(self.width))/2;
            self.div.style.left = margin + "px";
            self.div.style.right = "auto";
        }
        for (let i in self.updates) {
            self.updates[i].call(self);
        }

        self.TextAreas.map(i => {i.update();});
    }

    anime (animation, param, interrupt = true, callable) {
        let time = param.time || 0;
        let newParam = {Layer: this};
        Object.assign(newParam, param);
        animation(newParam);

        if (!interrupt)
            window.Engine.Control.wait(time, callable);
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
}

export {MessageLayer};