var canvas = this.__canvas = new fabric.Canvas('cv');
fabric.Object.prototype.transparentCorners = false;
canvas.hoverCursor = 'arrow';

var radius = 200;
var x = 0;
var y = 0;
var xOffset = 0;
var yOffset = 0;
var flashlightImage = 0;
var backgroundImage = 0;

function draw() {
    canvas.setWidth($('#wrapper').width());
    canvas.setHeight($('#wrapper').height());
    canvas.calcOffset();
    canvas.renderAll();
}

var addImageButton = document.getElementById('addImage');
addImageButton.addEventListener('click', handleAddImage, false);

function setOffsets(url) {
    var img = new Image();
    img.src = images[backgroundImage][1];
    console.log('->', img.width);
    xOffset = img.width / 2;
    yOffset = img.height / 2;
}

//make this not two prompts
function handleAddImage(e) {
    var name = prompt('Image name: ');
    var url = prompt('Image url: ');
    if (name && url) images.push([name, url]);
}

function setLargeImage(url) {
    canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas), {
        // Needed to position backgroundImage at top left corner
        originX: 'left',
        originY: 'top'
    });
    setOffsets(url);
}

function setFlashlightImage(url) {
    fabric.Image.fromURL(url, function (img) {
        img.scale(1).set({
            left: 0,
            top: 0,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            clipTo: function (ctx) {
                ctx.arc(x - xOffset, y - yOffset, radius, 0, Math.PI * 2, true);
            }
        });
        canvas.add(img).setActiveObject(img);
        setLargeImage(images[1][1]);
    });
}

// thumbnails?
// ability to delete images?
// other shapes like squares
// sets of demo images built in
// remove images

var imageSet = [
    ['fun', [
        ['Mountains', 'http://i.imgur.com/6ExMglc.jpg'],
        ['Flocka', 'http://dmjuice.com/wp-content/uploads/2014/04/waka.jpg'],
        ['Nick', 'https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-xpf1/t31.0-8/10636403_10153455635518465_4958444602555247243_o.jpg']
    ]],
    ['130', [
        ['1929', 'http://i.imgur.com/kZIxe1M.jpg'],
        ['1962', 'http://i.imgur.com/hGn3zZY.jpg'],
        ['2003', 'http://i.imgur.com/sMnwUl5.jpg'],
        ['2010', 'http://i.imgur.com/OpH6k13.jpg']
    ]],
    ['142', [
        ['1962', 'http://i.imgur.com/VupvBdX.jpg'],
        ['2003', 'http://i.imgur.com/IoRDdeq.jpg'],
        ['2010', 'http://i.imgur.com/5P5LMoZ.jpg']
    ]],
    ['143', [
        ['1962', 'http://i.imgur.com/IzscS6I.jpg'],
        ['2003', 'http://i.imgur.com/ss6dPpx.jpg'],
        ['2010', 'http://i.imgur.com/2EAi185.jpg']
    ]]
];

var images = imageSet[3][1];

//Need to think about what happens when images are different sizes
setFlashlightImage(images[flashlightImage][1]);
draw();

canvas.on('mouse:move', function (options) {
    var p = canvas.getPointer(options.e);
    x = p.x;
    y = p.y;
    //console.log(p.x + " " + p.y + " " + canvas._offset.left + " " + canvas._offset.top);
    draw();
});

$(canvas.wrapperEl).on('mousewheel', function (e) {
    var target = canvas.findTarget(e);
    var delta = e.originalEvent.wheelDelta;

    if (!(delta < 0 && radius < 10)) {
        // radius += delta/5;
        radius = Math.max(radius + delta / 5, 10);
    }

    draw();
    return false;
});

$(document).keydown(function (e) {
    console.log('clicked');
    switch (e.which) {
        case 37:
            // left                  // flashlight back
        case 65:
            // a
            flashlightImage = (flashlightImage + images.length - 1) % images.length;
            setFlashlightImage(images[flashlightImage][1]);
            break;

        case 39:
            // right                // flashlight forward
        case 68:
            // d
            flashlightImage = (flashlightImage + 1) % images.length;
            setFlashlightImage(images[flashlightImage][1]);
            break;

        case 38:
            // up             // background forward
        case 87:
            // w
            backgroundImage = (backgroundImage + 1) % images.length;
            setLargeImage(images[backgroundImage][1]);
            break;

        case 40:
            // down            // background forward
        case 83:
            // s
            backgroundImage = (backgroundImage - 1 + images.length) % images.length;
            setLargeImage(images[backgroundImage][1]);
            break;

        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});



var menu = document.getElementById('menuImagesLI');
menu.addEventListener('mouseover', updateMenu, false);

function updateMenu() {
    var noOfImages = images.length;
    for (var i = 0; i < noOfImages; i++) {
        // add image to menu
        if ($('#' + images[i][0] + '_X_').length == 0) {
            //console.log("adding image: ", i);
            $('#menuImages').append('<li id="' + images[i][0] + '_X_">' + images[i][0] + '</li>');
            var imageElement = document.getElementById(images[i][0] + '_X_');
            imageElement.addEventListener('click', function () {
                var s = this.id.substring(0, this.id.length - 3);
                //console.log(s);
                for (var i = 0; i < images.length; i++) {
                    if (s == images[i][0]) {
                        setLargeImage(images[i][1]);
                        backgroundImage = i;
                        return;
                    }
                }
            },
            false);
        }
    }
}
