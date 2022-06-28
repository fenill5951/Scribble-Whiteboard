let tool_Container = document.querySelector(".tools-container");
let option_Container = document.querySelector(".options-container");
let eraser_Container = document.querySelector(".eraser-tool-container");
let pencil_Container = document.querySelector(".pencil-tool");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let pencilflag = false;
let eraserflag = false;
let optionsFlag = true;
option_Container.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;
    if (optionsFlag) {
        tool_Container.style.display = "flex";
    } else {
        tool_Container.style.display = "none";
        pencil_Container.style.display = "none";
        eraser_Container.style.display = "none";
        pencilflag=false;
        eraserflag=false;
    }

})

pencil.addEventListener("click", (e) => {
    pencilflag = !pencilflag;
    if (pencilflag) {
        pencil_Container.style.display = "block";
    } else {
        pencil_Container.style.display = "none";
    }
})

eraser.addEventListener("click", (e) => {
    eraserflag = !eraserflag;
    if (eraserflag) {
        eraser_Container.style.display = "flex";
    } else {
        eraser_Container.style.display = "none";
    }
})

sticky.addEventListener("click", (e) => {
    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-container");
    stickyContainer.innerHTML = `<div class="header">
    <div class="minimize"></div>
    <div class="remove"></div>
</div>
<div class="note-cont">
    <textarea></textarea>
</div>`;
    document.body.appendChild(stickyContainer);
    let minimize=stickyContainer.querySelector(".minimize");
    let remove=stickyContainer.querySelector(".remove");
    minimize.addEventListener("click", (e) => {
        let noteContainer=stickyContainer.querySelector(".note-cont");
        let display=getComputedStyle(noteContainer).getPropertyValue("display");
        if(display === "none") 
        {
            noteContainer.style.display="block";
        }
        else{
            noteContainer.style.display="none";
        }

    })
    remove.addEventListener("click", (e) =>{
        stickyContainer.remove();
    })
    stickyContainer.onmousedown = function (event) {
        dragAndDrop(stickyContainer, event);
    };

    stickyContainer.ondragstart = function () {
        return false;
    };
})


function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}