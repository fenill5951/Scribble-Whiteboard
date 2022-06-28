let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorElem = document.querySelectorAll(".pencil-color");
let pencilSizeElem = document.querySelector(".pencil-size");
let eraserSizeElem = document.querySelector(".eraser-size");
let downloadElem = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");


let pencilcolor = "red";
let erasercolor = "white";
let pencilsize = pencilSizeElem.value;
let erasersize = eraserSizeElem.value;

let undoRedoTracker = []; //Data
let track = 0;

let canvastool = canvas.getContext("2d");
canvastool.strokeStyle = pencilcolor;
canvastool.lineWidth = pencilsize;

let mousedownFlag = false;

canvas.addEventListener("mousedown", (e) => {
    mousedownFlag = true;
    let point = {
        x: e.clientX,
        y: e.clientY,
        identifier: "mousedown",
        color: canvastool.strokeStyle,
        width: canvastool.lineWidth
      };
      undoStack.push(point);
      console.log(undoStack);
    let data = {
        x: e.clientX,
        y: e.clientY,
    };
    // beginpath(cordinateObj);
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    if (mousedownFlag) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color:eraserflag?erasercolor:pencilcolor,
            width:eraserflag?erasersize:pencilsize
        };
        let point = {
            x: e.clientX,
            y: e.clientY ,
            identifier: "mousemove",
            color: canvastool.strokeStyle,
            width: canvastool.lineWidth
          };

          undoStack.push(point);
          socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mousedownFlag = false;

    // track++;
    // if (track < undoRedoTracker.length) {
    //     undoRedoTracker.length = track;
    // }
    // //     consoleundoRedoTracker.push(document.getElementById('canvas').toDataURL());
    // let url = canvas.toDataURL();
    // undoRedoTracker.push(url);
    // track = undoRedoTracker.length - 1;
    // console.log(track);
})

// undo.addEventListener("click", (e) => {
//     // console.log(undoRedoTracker);
//     console.log("track = ", track);

//     if (track > 0) {
//         track--;
//         console.log(track);

//         let data = {
//             trackValue: track,
//             undoRedoTracker
//         }
//         undoRedoCanvas(data);
//     }
// })

undo.addEventListener("click", (e) => {
    undoMaker();
})

redo.addEventListener("click", (e) => {
    redoMaker();
})

// redo.addEventListener("click",(e)=>{
//     console.log(undoRedoTracker);
//     console.log(track);
//     if(track<undoRedoTracker.length-1) track++;
//     let data = {
//         trackValue: track,
//         undoRedoTracker
//     }
//     undoRedoCanvas(data);

// })

// function undoRedoCanvas(trackObj) {
//     track = trackObj.trackValue;
//     undoRedoTracker = trackObj.undoRedoTracker;


//     let url = undoRedoTracker[track];
//     //     ifconsole.log(url);
//     let img = new Image(); // new image reference element
//     img.src = url;
//     img.onload = (e) => {
//         console.log("Image loaded")
//         canvastool.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
// }

function beginpath(cordinateObj) {
    canvastool.beginPath();
    canvastool.moveTo(cordinateObj.x, cordinateObj.y);
}

function drawpath(cordinateObj) {
    canvastool.strokeStyle = cordinateObj.color;
canvastool.lineWidth = cordinateObj.width;
    canvastool.lineTo(cordinateObj.x, cordinateObj.y);
    canvastool.stroke();
}

eraserSizeElem.addEventListener("change", (e) => {
    erasersize = eraserSizeElem.value;
    canvastool.lineWidth = erasersize;
})

pencilSizeElem.addEventListener("change", (e) => {
    pencilsize = pencilSizeElem.value;
    canvastool.lineWidth = pencilsize;
})

pencilColorElem.forEach((colorElement) => {
    colorElement.addEventListener("click", (e) => {
        pencilcolor = colorElement.classList[0];
        canvastool.strokeStyle = pencilcolor;
        pencil_Container.style.display = "none";
        pencilflag = !pencilflag;
    })

})

eraser.addEventListener("click", (e) => {
    if (eraserflag) {
        canvastool.strokeStyle = erasercolor;
        canvastool.lineWidth = erasersize;
    } else {
        canvastool.strokeStyle = pencilcolor;
        canvastool.lineWidth = pencilsize;
    }
})

downloadElem.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = "image.jpg";
    anchorElement.click();
})


//new undo redo concept

let undoStack = [];
let redoStack = [];
function undoMaker() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    // redraw();
    socket.emit("undo", undoStack);
    socket.emit("redo", redoStack);
    return true;
  }
  return false;
}

// **********************redo Stack
function redoMaker() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    // redraw();
    socket.emit("undo", undoStack);
    socket.emit("redo", redoStack);
    return true;
  }
  return false;
}


function redraw() {
    canvastool.clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < undoStack.length; i++) {
      let { x, y, identifier, color, width } = undoStack[i];
      canvastool.strokeStyle = color;
      canvastool.lineWidth = width;
      if (identifier == "mousedown") {
        canvastool.beginPath();
        canvastool.moveTo(x, y);
      } else if (identifier == "mousemove") {
        canvastool.lineTo(x, y);
        canvastool.stroke();
      }
    }
  }


socket.on("beginPath", (data) => {
    // data -> data from server
    beginpath(data);
})
socket.on("drawStroke", (data) => {
    drawpath(data);
})

socket.on("undo", (data)=>{
    undoStack=data;
    redraw();
})

socket.on("redo", (data)=>{
    redoStack=data;
    redraw();
})