
// Copyright (c) 2018 Bert Maurau
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Code inspired by William Malone (www.williammalone.com)
// From the original JS tutorial.
// Converted to TypeScript with small tweaks and globalization.

/**
 * The passable configuration for the Sprite itself
 */
interface SpriteOptions {
   width: number;
   renderWidth: number;
   height: number;
   renderHeight: number;
   image: HTMLImageElement;
   ticksPerFrame: number;
   numberOfFrames: number;
}

/**
 * The actual Sprite object
 */
class Sprite {

   // basics
   private context: CanvasRenderingContext2D;
   private width: number;
   private renderWidth: number;
   private height: number;
   private renderHeight: number;
   private image: HTMLImageElement;

   // animation properties
   private totalTicks: number = 0;
   private totalFrames: number = 0;
   private totalLoops: number = 0;
   private frameIndex: number = 0;
   private tickCount: number = 0;
   private ticksPerFrame: number = 5;
   private numberOfFrames: number = 1;

   /**
    * Constructor
    * @param {CanvasRenderingContext2D} context 
    * @param {SpriteOptions} options 
    */
   constructor(context: CanvasRenderingContext2D, options: SpriteOptions) {

      // setters
      this.context = context;
      this.width = options.width;
      this.renderWidth = options.renderWidth;
      this.height = options.height;
      this.renderHeight = options.renderHeight;
      this.ticksPerFrame = options.ticksPerFrame;
      this.numberOfFrames = options.numberOfFrames;

      // set the image
      this.image = options.image;

   }

   /**
    * Render the actual image
    */
   public render(): void {

      // clear the canvas
      this.context.clearRect(0, 0, this.renderWidth, this.renderHeight);

      // Draw the animation
      this.context.drawImage(

         this.image,                                              // Source image object (Sprite sheet)
         (this.frameIndex * (this.width / this.numberOfFrames)),  // Source x (Frame index times frame width)
         0,                                                       // Source y (0)
         (this.width / this.numberOfFrames),                      // Source width (Frame width)
         this.height,                                             // Source height (Frame height)
         0,                                                       // Destination x (0)
         0,                                                       // Destination y (0)
         (this.renderWidth),                                      // Destination width (Frame width)
         this.renderHeight);                                      // Destination height (Frame height)
   };

   /**
    * Update to the current frame
    */
   public update(): void {

      this.tickCount += 1;
      this.totalTicks += 1;

      if (this.tickCount > this.ticksPerFrame) {

         this.tickCount = 0;
         this.totalFrames += 1;

         // if the current frame index is in range
         if (this.frameIndex < (this.numberOfFrames - 1)) {
            // go to the next frame
            this.frameIndex += 1;
         } else {
            this.totalLoops += 1;
            this.frameIndex = 0;
         }

      }

   };

   /**
    * Return the basic information
    */
   public getAnimationInfo(): any {
      return {
         total_ticks: this.totalTicks,
         total_frames: this.totalFrames,
         total_loops: this.totalLoops,
         current_tick: this.tickCount,
         current_frame: this.frameIndex,
         sprite_width: this.width,
         sprite_height: this.height,
         sprite_frames: this.numberOfFrames,
         sprite_ticks_per_frame: this.ticksPerFrame,
         render_width: this.renderWidth,
         render_height: this.renderHeight,
         ticks_per_frame: this.ticksPerFrame,
      }
   }
}

/**
 * Main SpriteAnimation class
 */
class SpriteAnimation {

   // the div that holds the info
   private feedbackElement: HTMLDivElement;
   // the image object
   private image: HTMLImageElement;
   // the canvas used for rendering the sprite
   private canvas: HTMLCanvasElement;
   // the actual sprite object that will be rendered
   private sprite: Sprite;
   // the global FPS value
   private fps: number = 60;
   // the gameloop
   private gameLoop;

   /**
    * Load the actual animation with given sprite image
    * @param {string} image path to image source 
    * @param {number} width width of the canvas
    * @param {number} height height of the convas
    */
   public load(image: HTMLImageElement, width: number, height: number, options: any): SpriteAnimation {


      // load the element for the display
      this.feedbackElement = <HTMLDivElement>document.createElement("feedback");
      document.body.appendChild(this.feedbackElement);

      // load the canvas
      this.canvas = <HTMLCanvasElement>document.createElement("canvas");
      this.canvas.width = (options.renderWidth || width);
      this.canvas.height = (options.renderHeight || height);
      // add the canvas to the body
      document.body.appendChild(this.canvas);

      // set the images for future access
      this.image = image;

      // declare a new sprite
      let spriteOptions: SpriteOptions = {
         width: width,
         renderWidth: options.renderWidth,
         height: height,
         renderHeight: options.renderHeight,
         image: image,
         ticksPerFrame: options.ticksPerFrame,
         numberOfFrames: options.numberOfFrames,
      }
      this.sprite = new Sprite(this.canvas.getContext("2d"), spriteOptions);

      /**
       * The gameloop to take care of the updates
       */
      this.gameLoop = () => {

         window.requestAnimationFrame(this.gameLoop);

         // calculate new frame to show
         this.sprite.update();
         // render the actual frame
         this.sprite.render();

         // do other stuff here
         this.updateFeedback();
      }

      // start the game loop as soon as the sprite sheet is loaded
      this.image.addEventListener("load", this.gameLoop);

      return this;
   }

   /**
    * Update the div with the information
    */
   private updateFeedback(): void {

      let info = this.sprite.getAnimationInfo();
      this.feedbackElement.innerHTML = `
         <pre>${JSON.stringify(info, undefined, 2)}</pre> 
      `;

   }

}
