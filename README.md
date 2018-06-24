# Basic Sprite Animator

## Demo

Here: [animator](https://bertmaurau.be/projects/sprite-animator/)

## Example

Same as the src/index.html

```js

// define a new image that holds our sprite
const image = new Image();
//image.src = "./assets/images/megaman-jump.png";
//image.src = "./assets/images/rotating-coin.png";
image.src = "./assets/images/capguy-walk.png";

// init a new app with given image
let app = new SpriteAnimation();

// configuration
let optionsCapguy = {
   ticksPerFrame: 4,    // how long each frame should be visible
   numberOfFrames: 8,   // total number of frames in your sprite
   renderWidth: 147,    // the render width (result width)
   renderHeight: 325,   // the render height (result height)
}

// 1- The Image object
// 2- The sprite full image width
// 3- The sprite full image height
// 4- The options
app.load(image, 1472, 325, optionsCapguy);


// ..
// functions
// app.play();
// app.frame(direction +/- 1);
// app.pause();
// app,toggleSlomo();

```

## Run

1. Clone Repo  
2. Run `npm install`  
3. Run `npm run build`  
4. Open your browser to the /dist folder.  
5. Enjoy your animated sprite.  


