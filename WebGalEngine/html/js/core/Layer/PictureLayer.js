const PictureLayer = class PicLayer {
    constructor() {
        const PROTECTED_PROPERTIES = ["image", "canvas", "context"];
            for (let i in PROTECTED_PROPERTIES)
                Object.defineProperty(this, PROTECTED_PROPERTIES[i], {enumerable: false, configurable: true, writable: true});

        // 每个图像一层canvas
        this.src = window.EngineUser.Default.PictureLayerSrc;
        this.image = new Image();

        this.canvas = document.createElement("canvas");
        this.canvas.height = document.getElementById("canvasContainer").offsetHeight;
        this.canvas.width = document.getElementById("canvasContainer").offsetWidth;
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = window.EngineUser.Default.PictureLayerZIndex;
        document.getElementById("canvasContainer").appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        this.visible = window.EngineUser.Default.PictureLayerVisible;
        this.alpha = window.EngineUser.Default.PictureLayerAlpha;

        // 对图像进行矩形裁剪
        this.clip = window.EngineUser.Default.PictureLayerClip;
        Object.seal(this.clip);
        /**************************** 弃用 **********************
        // 缩放, 大于1是放大;小于1是缩小
        this.scale = EngineUser.Default.PictureLayerScale;
        *********************************************************/
        this.width = window.EngineUser.Default.PictureLayerWidth;
        this.height = window.EngineUser.Default.PictureLayerHeight;
        // 上下翻转
        //this.reversVertical = EngineUser.Default.PictureLayerReversVertical;
        //this.reversHorizontal = EngineUser.Default.PictureLayerReversHorizontal;
        // 在画布层的遮罩顺序, zIndex值较大者会覆盖住较小者
        /*
         * 此处的zIndex和MessageLayer中的zIndex相互影响!
         * 这里默认值为0, MessageLayer的默认值是1000
         */
        this.zIndex = window.EngineUser.Default.PictureLayerZIndex;
        this.top = window.EngineUser.Default.PictureLayerTop;
        this.left = window.EngineUser.Default.PictureLayerLeft;
        // 画布永远是分辨率的长宽,充满整个屏幕, top,left这些属性设置的是图片填充的位置
        
        this.updates = [];          // 在 update 需要调用的回调 (property: function...)

        Object.defineProperty(this, 'self', {enumerable: false, configurable: true, writable: true});
        this.self =  new Proxy(this, {
            get: function (target, key) {
                if (key[0] !== undefined && key[0] == "_") {
                    return target[key.slice(1)];
                }
                return target[key];
            },
            // 每隔16ms自动刷新
            // 兼容 _alpha 的写法
            set: function (target, key, value) {
                if (key[0] !== undefined && key[0] == "_") {
                    target[key.slice(1)] = value;
                } else {
                    if (['alpha'].indexOf(key) != -1) {
                        if (key == 'alpha') {
                            if (value > 1) value = 1;
                            if (value < 0) value = 0;
                            target.alpha = value;
                        }
                    } else {
                        target[key] = value;
                    }
                }
                return true;
            }
        });
        window.Engine.Draw.PictureLayers.push(this.self);
        return this.self;
    }

    // 一般来说会根据canvas的渲染频率(60Hz)进行update
    // 所以不需要 setter 和 getter(在更新之后下一帧的时候就会把更新后的渲染)
    update () {
        // 清空画布
        this.canvas.style.zIndex = this.zIndex;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.opacity = this.alpha;
        if (! this.visible) this.canvas.style.opacity = 0.0;
        this.image.src = this.src;
        this.context.drawImage(this.image, 
            this.clip.enable?this.clip.left:0,
            this.clip.enable?this.clip.top:0,
            this.clip.enable?this.clip.width:this.image.width,
            this.clip.enable?this.clip.height:this.image.height,
            this.left,
            this.top,
            this.width?this.width:this.image.width,
            this.height?this.height:this.image.height);
        for (let i in this.updates) {
            this.updates[i].call(this);
        }
    }

    // 清除画布上的图片和设定的位置,src等参数.
    clear () {
        this.clip = Object.assign({}, EngineUser.Default.PictureLayerClip);
        Object.seal(this.clip);
        this.width = EngineUser.Default.PictureLayerWidth;
        this.height = EngineUser.Default.PictureLayerHeight;
        this.zIndex = EngineUser.Default.PictureLayerZIndex;
        this.top = EngineUser.Default.PictureLayerTop;
        this.left = EngineUser.Default.PictureLayerLeft;
        this.src = EngineUser.Default.PictureLayerSrc;
    }

    anime (animation, param, interrupt = true, callable) {
        let time = param.time || 0;
        let newParam = {Layer: this.self};
        Object.assign(newParam, param);
        animation(newParam);

        if (!interrupt)
            window.Engine.Control.wait(time, callable);
    }

    // 扩展此对象
    // 属性名, 值, update的回调
    extend (prop, value, update) {
        if (prop in this) {
            this[prop] = value;
        } else {
            Object.defineProperty(this, prop, {enumerable: true, configurable: true, writable: true})
            this[prop] = value;
            this.updates[prop] = update;
        }
    }
}

export {PictureLayer};