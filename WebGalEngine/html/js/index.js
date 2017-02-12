import "babel-polyfill";

window.EngineUser = {};
window.EngineUser.Scenario = [];

import {scenarios} from './app/scenario.js';        // add many scenarios
for (let i of scenarios) {
    window.EngineUser.Scenario = window.EngineUser.Scenario.concat(i);
}

import {Config, Default} from './app/config.js';
[window.EngineUser.Config, window.EngineUser.Default] = [Config, Default];

window.Engine = {};
import {Vars} from './core/Vars.js';
window.Engine.Vars = new Vars();
import {Proc} from './core/Proc.js';
window.Engine.Proc = new Proc();
import {Draw} from './core/Draw.js';
window.Engine.Draw = Draw;

import {Animation} from './core/Animation.js';
window.Engine.Animation = Animation;
import {Control} from './core/Control.js';
window.Engine.Control = new Control();
import {Setting} from './core/Setting.js';
window.Engine.Setting = new Setting();
import {Audio} from './core/Audio.js';
window.Engine.Audio = Audio;

import {Init} from './core/Init.js';
window.Engine.Init = Init;

window.onload = () => {
    window.Engine.Init();
}