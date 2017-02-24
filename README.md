A Gal Engine based on CEF. You can do any awesome thing by using javascript in your scenario(e.g. send  an AJAX request, or use WebGL to perform a water surface, even embed [live2d](http://www.live2d.com) (WebGL version) in your character).  
## Requirement
  * npm
  * Visual Studio 2015 (or higher)
  * Windows 8 and higher is recommended.

## File Path  
Some primary paths:  
`WebGalEngine.sln` Project solution file.  
`docs/` Documents path.  
`WebGalEngine/EngineObject.cs` Implements object `EngineObject` in C#.  
`WebGalEngine/html/` Assets of index.html.  
`WebGalEngine/html/index.html` Main html which browser opens.  
`WebGalEngine/html/css/` Css file of index.html.  
`WebGalEngine/html/js/` Main implement of game engine logic in javascript.  
`WebGalEngine/html/js/app/` Work directory for developer. Include `config.js` and `scenario.js`.  
`WebGalEngine/html/js/core/` Engine core directory.

## Usage
1. Open `WebGalEngine.sln` with Visual Studio  
2. Install [CEFSharp](https://github.com/cefsharp/CefSharp) by using NuGet.  
