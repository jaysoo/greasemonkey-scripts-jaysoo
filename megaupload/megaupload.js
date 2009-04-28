function process() {
    var img = document.getElementById('subject');
    var canvas = document.createElement("canvas");

    canvas.height = img.height;
    canvas.width = img.width;
    canvas.getContext('2d').drawImage(img, 0, 0);

    var data = canvas.getContext('2d').getImageData(0, 0, img.width, img.height);


    console.log(data);
}
