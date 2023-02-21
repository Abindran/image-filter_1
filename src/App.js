import React, {useEffect, useRef, useState} from "react";
import canvasToImage from 'canvas-to-image';



function App() {

    const [context,setContext] = useState(null);
    const [originalImage,setOriginalImage] = useState(null);
    const [imageHeight,setImageHeight] = useState(null);
    const [imageWidth,setImageWidth] = useState(null);


    const canvas = useRef(null);


    const image = new Image();
    image.onload = function (){
        setImageHeight(image.height);
        setImageWidth(image.width);
        canvas.current.height = image.height;
        canvas.current.width = image.width;
        context.drawImage(image, 0, 0);
    }

    const applyFilter = (filterType) => {
        if(!imageHeight || !imageWidth) {
            return alert("Please upload an image first!");
        }

        const image = context.getImageData(0, 0, imageWidth, imageHeight);
        const imgData = image.data;

        for(let i = 0; i < imgData.length; i += 4) {
            const red = imgData[i];
            const green = imgData[i + 1];
            const blue = imgData[i + 2];

            const grayValue = (red + green + blue) / 3;
            const data = filters[filterType](grayValue);
            imgData[i] = data[0];
            imgData[i + 1] = data[1];
            imgData[i + 2] = data[2];
        }

        context.putImageData(image, 0, 0);
    }

    const filters = {
        applyGrayscale: (gray) => {
            return [gray, gray, gray];
        },
        applyMonotone: (gray) => {
            return [gray - 40, gray - 40, gray + 80];
        },
        applyDuotone: (gray) => {
            const diff = Math.round((128/100) * gray);
            return [gray + diff, gray, 255 - diff];
        },
    }
    const resetFilter = () => {
        if(!image || !context || !originalImage) {
            return alert('There is nothing to reset');
        }

        image.src = originalImage;
        context.drawImage(image, 0, 0);

    }

    const onUpload = (event) => {
        image.src = URL.createObjectURL(event.target.files[0]);
        setOriginalImage(URL.createObjectURL(event.target.files[0]));
    }

    //TODO: Add the jpg download option
    const handleDownload = async () => {
        if(!imageHeight || !imageWidth){
            return alert("Please upload an image first!");
        }

        canvasToImage(canvas.current);
    }

    useEffect(()=>{
        canvas.current.focus();
        setContext(canvas.current.getContext('2d'));
    },[context])


    return (
      <div>
          <h1 className="lg:text-5xl m-auto w-max p-10 font-bold b-2 text-4xl">
              Image Filter
          </h1>

          <div className="mb-8 ml-8 flex justify-center">
            <label htmlFor="image font-bold">Upload the image</label>
            <input className="pl-2 bg-[#1e2839] border-solid border-r-amber-50" type="file" accept="image/jpeg, image/png, image/jpg" name="image" id="image" onChange={onUpload}/>
          </div>

          <div className="mb-4 lg:grid lg:gap-4 lg:flex lg:justify-center">
            <canvas className="lg:mb-0 mb-3 shadow-lg shadow-gray-700  border-2 border-blue-900 w-[100%] h-auto lg:w-[600px] " ref={canvas} ></canvas>
              <div className="lg:flex-col lg:justify-between flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="flex flex-col gap-2 md:flex-row">
                    <button className="shadow-lg shadow-gray-700 p-6 cursor-pointer hover:scale-110 ease-in duration-300" onClick={() => applyFilter("applyGrayscale")}>Grayscale</button>
                    <button className="shadow-lg shadow-gray-700 p-6 cursor-pointer hover:scale-110 ease-in duration-300" onClick={() => applyFilter("applyMonotone")}>Blue Monotone</button>
                    <button className="shadow-lg shadow-gray-700 p-6 cursor-pointer hover:scale-110 ease-in duration-300" onClick={() => applyFilter("applyDuotone")}>Orange Blue</button>
                </div>
                <div className="lg:flex-row lg:justify-end  lg:w-[100%] flex flex-col gap-2 md:flex-row">
                    <button className="shadow-lg shadow-gray-700 p-6 cursor-pointer hover:scale-110 ease-in duration-300" onClick={resetFilter}>Reset</button>
                    <button className="flex justify-center items-center gap-2 shadow-lg shadow-gray-700 p-6 cursor-pointer hover:scale-110 ease-in duration-300" onClick={handleDownload}>Download</button>
                </div>
              </div>
          </div>
      </div>
    );
}

export default App;
