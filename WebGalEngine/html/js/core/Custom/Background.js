const TextArea = window.Engine.Draw.TextArea;

const Button = class Btn extends TextArea{
    constructor(MsgLayer) {
        super(MsgLayer);
        this.extend('borderImage', 
            (function(){
                let obj = {
                    'border-image-slice': '',
                    'border-image-width': '',
                    'border-image-outset': '',
                    'border-image-repeat': ''
                };
                let src = '';
                Object.defineProperty(obj, 'border-image-source', {
                    get: function() {return src;},
                    set: function(v) {
                        if (typeof v === 'string' && v.slice(0,3).toLowerCase() == 'url')
                            src = 'url(' + v + ')';
                        else
                            src = v;
                    },
                    enumerable: true
                });
                Object.seal(obj);
                return obj;
            })(),
            function(){
                this.div.style.borderImageSource = this.borderImage['border-image-source'];
                this.div.style.borderImageSlice = this.borderImage['border-image-slice'];
                this.div.style.borderImageWidth = this.borderImage['border-image-width'];
                this.div.style.borderImageOutset = this.borderImage['border-image-outset'];
                this.div.style.borderImageRepeat = this.borderImage['border-image-repeat'];
            });
        this.extend('hoverBorderImage',
            (function(){
                let obj = {
                    'border-image-slice': '',
                    'border-image-width': '',
                    'border-image-outset': '',
                    'border-image-repeat': ''
                };
                let src = '';
                Object.defineProperty(obj, 'border-image-source', {
                    get: function() {return src;},
                    set: function(v) {
                        if (typeof v === 'string' && v.slice(0,3).toLowerCase() == 'url')
                            src = 'url(' + v + ')';
                        else
                            src = v;
                    },
                    enumerable: true
                });
                Object.seal(obj);
                return obj;
            })(),
            function(){}
        );
        let hoverEvent = this.div.onmouseenter;
        this.div.onmouseenter = () => {
            hoverEvent.call(this);
            let tBorderImage = this.borderImage;
            this.borderImage = this.hoverBorderImage;
            let leaveEvent = this.div.onmouseleave;
            this.div.onmouseleave = () => {
                leaveEvent.call(this);
                this.borderImage = tBorderImage;
                this.update();
            }
            this.update();
        }
    }
}


const Background = class Bgd {
    constructor () {
        this.layer = new window.Engine.Draw.MessageLayer();
        this.areas = [];

        this.name = new window.Engine.Draw.TextArea(this.layer);
        this.text = new window.Engine.Draw.TextArea(this.layer);


    }
