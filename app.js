const canvas = document.getElementById("signature-pad");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color-picker");
const strokeWidthInput = document.getElementById("stroke-width");
const clearBtn = document.getElementById("clear-btn");
const saveBtn = document.getElementById("save-btn");

let drawing = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
	const ratio = window.devicePixelRatio || 1;
	canvas.width = canvas.offsetWidth * ratio;
	canvas.height = canvas.offsetHeight * ratio;
	ctx.scale(ratio, ratio);
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.strokeStyle = colorPicker.value;
	ctx.lineWidth = strokeWidthInput.value;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getXY(e) {
	if (e.touches) {
		const rect = canvas.getBoundingClientRect();
		return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
	}

	else {
		return [e.offsetX, e.offsetY];
	}
}

function startDrawing(e) {
	e.preventDefault();
	drawing = true;
	[lastX, lastY] = getXY(e);
}

function stopDrawing(e) {
	e.preventDefault();
	drawing = false;
}

function draw(e) {
	e.preventDefault();
	if (!drawing) return;
	const [x, y] = getXY(e);
	ctx.beginPath();
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(x, y);
	ctx.stroke();
	[lastX, lastY] = [x, y];
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchmove", draw);

colorPicker.addEventListener("change", () => {
	ctx.strokeStyle = colorPicker.value;
});

strokeWidthInput.addEventListener("input", () => {
	ctx.lineWidth = strokeWidthInput.value;
});

clearBtn.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener("click", () => {
	const dataURL = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = dataURL;
	link.download = "digital-signature.png";
	link.click();
});
