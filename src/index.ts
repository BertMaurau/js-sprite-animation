
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
   private currentTicksPerFrame: number = 5;
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
      this.currentTicksPerFrame = options.ticksPerFrame;
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

      if (this.tickCount > this.currentTicksPerFrame) {
         // show next frame
         this.nextFrame();
      }

   };

   /**
    * Set the current frame
    * @param {number} frameIndex 
    */
   public setFrame(frameIndex: number): void {
      this.frameIndex = frameIndex;

      this.render();
   }

   /**
    * Get the next frame
    */
   public nextFrame(): void {

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

      this.render();
   }

   /**
    * Get the previous frame
    */
   public prevFrame(): void {

      this.tickCount = 0;
      this.totalFrames -= 1;

      // if the current frame index is not the first
      if (this.frameIndex > 0) {
         // go to the previous frame
         this.frameIndex -= 1;
      } else {
         this.totalLoops -= 1;
         this.frameIndex = (this.numberOfFrames - 1);
      }

      this.render();
   }

   /**
    * Toggle slow-motion by increasing ticks per frame needed
    */
   public toggleSlomo(): void {
      this.currentTicksPerFrame = (this.currentTicksPerFrame === this.ticksPerFrame) ? this.ticksPerFrame * 3 : this.ticksPerFrame; 
   }

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
   private frameDisplay: HTMLDivElement;
   private sliderObject: HTMLInputElement;
   private spriteDisplay: HTMLImageElement;
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
   // animation auto-play
   private isPlaying: Boolean = false;

   /**
    * Load the actual animation with given sprite image
    * @param {string} image path to image source 
    * @param {number} width width of the canvas
    * @param {number} height height of the convas
    */
   public load(image: HTMLImageElement, width: number, height: number, options: any): SpriteAnimation {

      // load the element for the slider
      this.sliderObject = <HTMLInputElement>document.getElementById("frameSlider");
      this.sliderObject.max = String((options.numberOfFrames - 1));
      this.sliderObject.min = '0';
      this.sliderObject.onchange = () => {

         // set the frame the the selected slider point
         this.sprite.setFrame(parseInt(this.sliderObject.value));

         // render the actual frame
         this.sprite.render();

         // update the totals visual
         this.updateFeedback();
     }​

      // load the element for the sprite display
      this.frameDisplay = <HTMLDivElement>document.getElementById("frameDisplay");
      this.spriteDisplay = <HTMLImageElement>document.getElementById("spriteDisplay");
      this.spriteDisplay.src = image.src;
      // load the element for the feedback display
      this.feedbackElement = <HTMLDivElement>document.getElementById("output");

      // load the canvas
      this.canvas = <HTMLCanvasElement>document.createElement("canvas");
      this.canvas.width = (options.renderWidth || width);
      this.canvas.height = (options.renderHeight || height);
      // add the canvas to the body
      this.frameDisplay.appendChild(this.canvas);

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
      this.sprite.update();

      /**
       * The gameloop to take care of the updates
       */
      this.gameLoop = () => {

         window.requestAnimationFrame(this.gameLoop);

         if (this.isPlaying) {
            // calculate new frame to show
            this.sprite.update();
            // render the actual frame
            this.sprite.render();

            // do other stuff here
            this.updateFeedback();
         }

      }

      // start the game loop as soon as the sprite sheet is loaded
      this.image.addEventListener("load", this.gameLoop);

      return this;
   }

   /**
    * Start the animation
    */
   public play(): void {
      this.isPlaying = true;
   }

   /**
    * Pause the animation
    */
   public pause(): void {
      this.isPlaying = false;
   }

   /**
    * Handle frame manipulation
    * @param {number} direction 
    */
   public frame(direction: number): void {
      if (direction > 0) {
         this.sprite.nextFrame();
      } else {
         this.sprite.prevFrame();
      }

      // update the totals visual
      this.updateFeedback();
   }

   /**
    * Toggle slow-motion option
    */
   public toggleSlomo(): void {
      this.sprite.toggleSlomo();
   }

   /**
    * Update the div with the information
    */
   private updateFeedback(): void {

      // get all the info
      let info = this.sprite.getAnimationInfo();

      // set the slider value
      this.sliderObject.value = info.current_frame;

      this.feedbackElement.innerHTML = `
         <small>${JSON.stringify(info)}</small>
      `;

   }

}
