function init() {
    var img = document.getElementById('subject');
    var canvas = document.createElement("canvas");
    var h = img.height;
    var w = img.width;

    canvas.height = h * 2;
    canvas.width = w * 2;

    var ctx = canvas.getContext('2d');

    ctx.translate(w/2, h/2);
    ctx.rotate(toRadians(-20));
    ctx.drawImage(img, 0, 0);

    document.body.appendChild(canvas);

}


function toRadians(d) {
    return Math.PI * d / 180;
}

