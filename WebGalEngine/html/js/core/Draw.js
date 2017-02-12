import {MessageLayer} from './Layer/MessageLayer.js';
import {TextArea} from './Layer/TextArea.js';
import {PictureLayer} from './Layer/PictureLayer.js';

let Draw = {};

Object.defineProperty(Draw, "MessageLayer", {enumerable: false, configurable: true, writable: true});   // 防止MessageLayer属性被遍历
Object.defineProperty(Draw, "PictureLayer", {enumerable: false, configurable: true, writable: true});   // 防止PictureLayer属性被遍历
Object.defineProperty(Draw, "TextArea", {enumerable: false, configurable: true, writable: true});   // 防止TextArea属性被遍历

Draw.MessageLayers = [];
Draw.PictureLayers = [];
Draw.MessageLayer = MessageLayer;
Draw.TextArea = TextArea;
Draw.PictureLayer = PictureLayer;

export{Draw};