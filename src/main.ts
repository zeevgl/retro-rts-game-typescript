import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <canvas
      id="gameScreen"
      width="1"
      height="1"
      style="border: 1px solid #d3d3d3"
    >
      Your browser does not support the HTML5 canvas tag.
    </canvas>
`;

window.initGame();
