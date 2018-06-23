interface SpriteOptions {

   width: number;
   height: number;
   image: HTMLImageElement;
   ticksPerFrame: number;
   numberOfFrames: number;

}

class Sprite {

   private context: CanvasRenderingContext2D;
   private width: number;
   private height: number;
   private image: HTMLImageElement;

   private frameIndex: number = 0;
   private tickCount: number = 0;
   private ticksPerFrame: number = 5;
   private numberOfFrames: number = 1;

   constructor(context: CanvasRenderingContext2D, options: SpriteOptions) {

      // setters
      this.context = context;
      this.width = options.width;
      this.height = options.height;
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
      this.context.clearRect(0, 0, this.width, this.height);

      // Draw the animation
      this.context.drawImage(
         // Source image object (Sprite sheet)
         this.image,
         // Source x (Frame index times frame width)
         (this.frameIndex * (this.width / this.numberOfFrames)),
         // Source y (0)
         0,
         // Source width (Frame width)
         (this.width / this.numberOfFrames),
         // Source height (Frame height)
         this.height,
         // Destination x (0)
         0,
         // Destination y (0)
         0,
         // Destination width (Frame width)
         (this.width / this.numberOfFrames),
         // Destination height (Frame height)
         this.height);
   };


   /**
    * Update to the current frame
    */
   public update(): void {

      this.tickCount += 1;

      console.log(`Tick: ${this.tickCount} | PerFrame: ${this.ticksPerFrame}`)

      if (this.tickCount > this.ticksPerFrame) {

         this.tickCount = 0;

         // if the current frame index is in range
         if (this.frameIndex < (this.numberOfFrames - 1)) {
            // go to the next frame
            this.frameIndex += 1;
            console.log('Next frame..')
         } else {
            this.frameIndex = 0;
            console.log('First frame..')

         }

      }

   };


}

class SpriteAnimation {

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
   public load(image: HTMLImageElement, width: number, height: number, ticksPerFrame: number, numberOfFrames: number): SpriteAnimation {

      // load the canvas
      this.canvas = <HTMLCanvasElement>document.createElement("canvas");
      this.canvas.width = width;
      this.canvas.height = height;
      // add the canvas to the body
      document.body.appendChild(this.canvas);

      // set the images for future access
      this.image = image;

      // declare a new sprite
      let spriteOptions: SpriteOptions = {
         width: width,
         height: height,
         image: image,
         ticksPerFrame: ticksPerFrame,
         numberOfFrames: numberOfFrames,
      }
      this.sprite = new Sprite(this.canvas.getContext("2d"), spriteOptions);

      /**
       * The gameloop to take care of the updates
       */
      var self = this;

      self.gameLoop = () => {

         window.requestAnimationFrame(self.gameLoop);

         this.sprite.update();
         this.sprite.render();
      }

      // start the game loop as soon as the sprite sheet is loaded
      this.image.addEventListener("load", this.gameLoop);

      return this;
   }

   /**
    * Render the sprite
    */
   public render(): void {
      this.sprite.render();
   }

}
