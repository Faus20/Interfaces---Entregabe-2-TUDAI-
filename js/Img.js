class Img {
   
    constructor(width, height, ctx, canvas) {
       this.img = new Image();
       this.canvas = canvas
       this.width = width;
       this.height = height; 
       this.ctx = ctx;
       this.img_src_tmp = null;
       this.e = null;
      }

      /* Metodos para dibujar la imagen */ 
      drawImage(e){
        this.e = e;// guardo el evento que tiene la direccion de la imagen. 
        this.img.onload = () => this.draw();// Una vez que se carga la imagen llamo al metodo para dibujarla.
        this.img.src = URL.createObjectURL(e.target.files[0]);// Obtengo la url de la imagen que elegi.
        this.img_src_tmp = URL.createObjectURL(e.target.files[0]);// Guardo la url de la imagen.
      }
      
      draw(){
          this.ctx.drawImage(this.img, 0,0, this.width, this.height)// dibujo la imagen en el canvas
      }

      /* Metodo para resetear la imagen */ 
      resetImage(){
        if(this.img_src_tmp != null){// Si tengo una url tmp.
          this.img.onload = () => this.drawImage(this.e);// Una vez que se carga la imagen llamo al metodo para dibujarla.
          this.img.src = this.img_src_tmp;// La url es la de la imagen original que se guardo cuando se subio. 
        }
      }

      /* Metodo para borrar la url temporal de la imagen */
      deleteSrcImgTemp(){
        this.img_src_tmp = null;// Vacio la url tmp de la imagen.
      }


    /**********************************************************************************************************
     * ------------------------------------------ FILTROS --------------------------------------------------- *
     * *******************************************************************************************************/   
    
    /************************** Metodo para dibujar el NEGATIVO de una imagen *********************************
      [A cada pixel de la imagen le asigno su color complementario (osea el diametralmente opuesto). Para 
      hacer esto, al valor maximo que puede tomar cada pixel (255) se le resta el valor de cada pixel rgb]
    **********************************************************************************************************/
      negative() {  
        let i = this.ctx.getImageData(0,0, this.width, this.height);// Obtengo los datos de todos los pixel.
        
        /* Recorro cada pixel de la imagen y le asigno su nuevo valor */
        for (let pixel = 0; pixel < i.data.length; pixel += 4) {
          i.data[pixel] = 255 - i.data[pixel];// A 255 le resto el valor R (red) del pixel.
          i.data[pixel + 1] = 255 -  i.data[pixel + 1];// A 255 le resto el valor G (green) del pixel.
          i.data[pixel + 2] = 255 -  i.data[pixel + 2] ;// A 255 le resto el valor B (blue) del pixel.
        }
        this.ctx.putImageData(i, 0, 0);// se dibuja la imagen modificada
    }

    /***************************** Metodo para dibujar en SEPIA una imagen ************************************
        [Para lograr esto, una vez calculada la luminosidad se modifica ligeramente el valor de cada pixel 
           para obtener los tonos de sepia. Para no pasarme de 255(ya que es el maximo), uso Math.min 
                     para escoger el mínimo entre el valor calculado del pixel y 255]
    **********************************************************************************************************/
      sepia() {
        let i = this.ctx.getImageData(0,0, this.width, this.height);// Obtengo los datos de todos los pixel.
        
        /* Recorro cada pixel de la imagen y le asigno su nuevo valor */
        for (let pixel = 0; pixel < i.data.length; pixel += 4) {

          let luminosidad = .3 *  i.data[pixel] + .6 *  i.data[pixel + 1] + .1 *  i.data[pixel + 2];
          i.data[pixel] = Math.min(luminosidad + 40, 255); // Elijo el minimo y seteo el valor R (red).
          i.data[pixel + 1] = Math.min(luminosidad + 15, 255); // Elijo el minimo y seteo el valor G (green).
          i.data[pixel + 2] = luminosidad; // El valor B (blue) es el de la luminosidad
        }

        this.ctx.putImageData(i, 0, 0);// se dibuja la imagen modificada
    }

    /******************************** Metodo para BINARIZAR una imagen ****************************************
        [Para lograr esto, obtengo el promedio de la suma de los valores rgb de cada pixel, si el resultado
                   es mas de 127 el pixel pasa a ser blanco, y si es menos pasa a ser negro]
    **********************************************************************************************************/
      binarization(){
        let i = this.ctx.getImageData(0,0, this.width, this.height);// Obtengo los datos de todos los pixel.
  
        /* Recorro cada pixel de la imagen y le asigno su nuevo valor */
        for (let pixel = 0; pixel < i.data.length; pixel += 4) {
          let newValue = 0;
          if(Math.floor((i.data[pixel] + i.data[pixel + 1] + i.data[pixel+2])/3 > 127) ) {
            newValue = 255;
          }
          i.data[pixel] = newValue; 
          i.data[pixel + 1] = newValue; 
          i.data[pixel + 2] = newValue;
         }

         this.ctx.putImageData(i, 0, 0);// se dibuja la imagen modificada
    }

    /************************* Metodo para agregar o quitar BRILLO a una imagen *******************************
            [Para lograr esto, cada vez que se llama al metodo brigthness, al valor de cada pixel rgb 
                                 se le suma o resta un cierto valor de brillo]
    **********************************************************************************************************/
      brigthness(brigthness){
        let i = this.ctx.getImageData(0,0, this.width, this.height);// Obtengo los datos de todos los pixel.
  
        /* Recorro cada pixel de la imagen y le asigno su nuevo valor */
        for (let pixel = 0; pixel < i.data.length; pixel += 4) {
          if(brigthness === "more"){// si se apreto el boton mas brillo, le sumo 10 al valor de cada pixel
            i.data[pixel] = Math.min(i.data[pixel] + 10, 255);
            i.data[pixel + 1] = Math.min(i.data[pixel + 1] + 10, 255);
            i.data[pixel + 2] = Math.min(i.data[pixel + 2] + 10, 255);
          } else {// si se apreto el boton menos brillo, le resto 10 al valor de cada pixel
            i.data[pixel] = Math.max(i.data[pixel] - 10, 0);
            i.data[pixel + 1] = Math.max(i.data[pixel + 1] - 10, 0);
            i.data[pixel + 2] = Math.max(i.data[pixel + 2] - 10, 0);
          }
         }

         this.ctx.putImageData(i, 0, 0);// se dibuja la imagen modificada
    }

    /**************************** Metodo para SATURAR el color de una imagen **********************************
        [Para lograr esto, cada vez que se llama el metodo, recorro todos los pixeles y les asigno 
                                 su nuevo valor, calculando su color saturado]
        Fuente: https://www.qoncious.com/questions/changing-saturation-image-html5-canvas-using-javascript
    **********************************************************************************************************/
      saturation(){
        let i = this.ctx.getImageData(0,0, this.width, this.height);// Obtengo los datos de todos los pixel.
          
        let sv = 2; // valor de la saturacion que se le suma cada vez que se llama al metodo

        const luR = 0.3086; // luminicencia de rojo
        const luG = 0.6094; // luminicencia de verde
        const luB = 0.0820; // luminicencia de azul

        let az = (1 - sv)*luR + sv;
        let bz = (1 - sv)*luG;
        let cz = (1 - sv)*luB;
        let dz = (1 - sv)*luR;
        let ez = (1 - sv)*luG + sv;
        let fz = (1 - sv)*luB;
        let gz = (1 - sv)*luR;
        let hz = (1 - sv)*luG;
        let iz = (1 - sv)*luB + sv;
        
        /* Recorro cada pixel de la imagen y le asigno su nuevo valor */
        for (let pixel = 0; pixel < i.data.length; pixel += 4) {
          // guardo los valores de los pixel rojo, verde, azul
          let red =  i.data[pixel];
          let green =  i.data[pixel +1];
          let blue =  i.data[pixel + 2];
        
          // asigno los nuevos valores con los colores saturados
          i.data[pixel] = (az*red + bz*green + cz*blue);
          i.data[pixel + 1] = (dz*red + ez*green + fz*blue);
          i.data[pixel + 2] = (gz*red + hz*green + iz*blue);
        }

        this.ctx.putImageData(i, 0, 0);// se dibuja la imagen modificada
    }

    /*********************** Metodos para aplicar el BLUR y el BORDE a una imagen *****************************
            [Para lograr esto se usa un Kernel distinto para cada uno, cada filtro llama al metodo
               donde se le aplica el mismo a la imagen, dependiendo cual sea el Kernel que se usa]
                   Fuente: https://openlayers.org/en/latest/examples/image-filter.html
    **********************************************************************************************************/
    /* Metodo BLUR, llama al aplicar filtro con el Kernel para el blur y con el booleano en true */
    blur(){
      this.applyFilter(this.getKernel()["blur"], true)
    }

    /* Metodo BORDER, llama al aplicar filtro con el Kernel para el bordeado y con el booleano en false*/
    border(){
      this.applyFilter(this.getKernel()["border"], false)
    }
    
    /* Metodo para obtener los Kernel */ 
    getKernel(){
      return {  
        blur: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
        border: [-1/1,-1/1,-1/1,-1/1,8/1,-1/1,-1/1,-1/1,-1/1],
      };
    }
    
    /* Metodo para aplicar el filtro a la imagen */ 
    applyFilter(kernel, boolean){
      
      const size = Math.sqrt(kernel.length);// constante para guardar el tamaño del kernel.
      const half = Math.floor(size / 2);// contante para guardar la mitad del tamaño del kernel.

      //Obtengo los datos de los pixeles de la imagen
      let i = this.ctx.getImageData(0, 0, this.width, this.height);

      //Creo un image data que va a contener los datos de los pixeles con el filtro aplicado
      let output = this.ctx.createImageData(this.width, this.height);
      let outputData = output.data;

      //Recorro todos los pixeles y voy calculando el valor que tendra cada pixel
      for (let pixelY = 0; pixelY < this.height; ++pixelY) {
        let pixelsAbove = pixelY * this.width;
        for (let pixelX = 0; pixelX < this.width; ++pixelX) {
          let r = 0;
          let  g = 0;
          let  b = 0;
          let  a = 0;
          for (let kernelY = 0; kernelY < size; ++kernelY) {
            for (let kernelX = 0; kernelX < size; ++kernelX) {
              let weight = kernel[kernelY * size + kernelX];
              let neighborY = Math.min(
                this.height - 1,
                Math.max(0, pixelY + kernelY - half)
              );
              let neighborX = Math.min(
                this.width - 1,
                Math.max(0, pixelX + kernelX - half)
              );
              let inputIndex = (neighborY * this.width + neighborX) * 4;
              r += i.data[inputIndex] * weight;// obtengo el valor del pixel R
              g += i.data[inputIndex + 1] * weight;// obtengo el valor del pixel G
              b += i.data[inputIndex + 2] * weight;// obtengo el valor del pixel B
              a += i.data[inputIndex + 3] * weight;// obtengo el valor del pixel A
            }
          }
          let outputIndex = (pixelsAbove + pixelX) * 4;
          outputData[outputIndex] = r; // asigno el valor al pixel R (rojo) 
          outputData[outputIndex + 1] = g;// asigno el valor al pixel B (blue) 
          outputData[outputIndex + 2] = b;// asigno el valor al pixel G (green) 
          // Si el booleano con el que se llamo al metodo es true, uso el valor de obtuve, sino se usa 255.
          outputData[outputIndex + 3] = boolean ? a : 255;// asigno el valor al pixel A (alpha)
        }
      }
      this.ctx.putImageData(output, 0, 0);// se dibuja la imagen modificada
    }
}