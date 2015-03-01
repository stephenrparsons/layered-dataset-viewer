$(window).load(function () {
    var canvas = this.__canvas = new fabric.Canvas('cv');
    fabric.Object.prototype.transparentCorners = false;
    canvas.hoverCursor = 'arrow';

    var radius = 50;
    var x = 0;
    var y = 0;
    var xOffset = 0;
    var yOffset = 0;
    var flashlightImage = 1;
    var backgroundImage = 0;
    var imageSetIndex = 1;
    var circle = true;

    function draw() {
        canvas.setWidth($('#wrapper').width());
        canvas.setHeight($('#wrapper').height());
        canvas.calcOffset();
        canvas.renderAll();
        $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
        $('#backgroundText').text('Background: ' + images[backgroundImage][0]);
    }

    var addImageButton = document.getElementById('addImage');
    addImageButton.addEventListener('click', handleAddImage, false);

    // could be used to handle window resize event
    $(window).resize(function() {
        setLargeImage(images[backgroundImage][1]);
        setFlashlightImage(images[flashlightImage][1]);
        canvas.clear();
        draw();
    });

    function getImageWidth(url) {
        var img = new Image();
        img.src = images[backgroundImage][1];
        return img.width;
    }

    function getImageHeight(url) {
        var img = new Image();
        img.src = images[backgroundImage][1];
        return img.height;
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
            originY: 'top',
            left: ($('#wrapper').width() - getImageWidth(images[backgroundImage][1]))/2,
        });
        xOffset = $('#wrapper').width()/2;
        yOffset = getImageHeight(url)/2;
        draw();
    }

    function setFlashlightImage(url) {
        fabric.Image.fromURL(url, function (img) {
            img.scale(1).set({
                left: ($('#wrapper').width() - getImageWidth(images[flashlightImage][1]))/2,
                top: 0,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true,
                clipTo: function (ctx) {
                    if(circle === true)
                        ctx.arc(x - xOffset, y - yOffset, radius, 0, Math.PI * 2, true);
                    else
                        ctx.rect(x - xOffset - radius, y - yOffset - radius, 2*radius, 2*radius);
                }
            });
            canvas.add(img).setActiveObject(img);
            setLargeImage(images[backgroundImage][1]);
        });
        canvas.clear();
        draw();
    }

    // make it a library for embed
    // center on window resize
    // ability to delete images?
    // sets of demo images built in, cycle through them

    var imageSet = [
        ['130', [
            ['1929', 'http://i.imgur.com/kZIxe1M.jpg'],
            ['1962', 'http://i.imgur.com/hGn3zZY.jpg'],
            ['2003', 'http://i.imgur.com/sMnwUl5.jpg'],
            ['2010', 'http://i.imgur.com/OpH6k13.jpg']
        ]],
        ['143', [
            ['1962', 'http://i.imgur.com/IzscS6I.jpg'],
            ['2003', 'http://i.imgur.com/ss6dPpx.jpg'],
            ['2010', 'http://i.imgur.com/2EAi185.jpg']
        ]],
        ['eye', [
            ['manual', 'http://i.imgur.com/yYEh4pH.jpg'],
            ['training', 'http://i.imgur.com/I7kydTB.jpg']
        ]],
        ['spine', [
            ['before', 'http://i.imgur.com/HmuYoTQ.jpg'],
            ['after', 'http://i.imgur.com/EXmkZIo.jpg']
        ]],
        ['brain', [
            ['A', 'http://i.imgur.com/ZXtiAvu.jpg'],
            ['C', 'http://i.imgur.com/i4e2o28.jpg'],
            ['B', 'http://i.imgur.com/FMaaBJ8.jpg']
        ]],
        ['helen', [
            ['a', 'http://i.imgur.com/VoEbsZU.jpg'],
            ['b', 'http://i.imgur.com/WXTwlqD.jpg'],
            ['c', 'http://i.imgur.com/tDecIgE.jpg'],
            ['d', 'http://i.imgur.com/IRcqoyw.jpg'],
            ['e', 'http://i.imgur.com/Wzx7zBP.jpg'],
            ['f', 'http://i.imgur.com/1qXcTUQ.jpg'],
            ['g', 'http://i.imgur.com/xIKH6Fu.jpg'],
            ['h', 'http://i.imgur.com/61lbDD3.jpg'],
            ['i', 'http://i.imgur.com/kDIsPlR.jpg'],
            ['j', 'http://i.imgur.com/i4zGiQX.jpg'],
            ['k', 'http://i.imgur.com/fjfLnPc.jpg'],
            ['l', 'http://i.imgur.com/kwJEBkL.jpg'],
            ['m', 'http://i.imgur.com/EN56NOc.jpg']
        ]]
    ];

    var images = imageSet[imageSetIndex][1];

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


    $(canvas.wrapperEl).on('click', function() {
        flashlightImage = (flashlightImage + 1) % images.length;
        setFlashlightImage(images[flashlightImage][1]);
        $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
        draw();
    });

    $(document).keydown(function (e) {
        switch (e.which) {
        case 37:
            // left                  // flashlight back
        case 65:
            // a
            flashlightImage = (flashlightImage + images.length - 1) % images.length;
            setFlashlightImage(images[flashlightImage][1]);
            $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
            break;

        case 39:
            // right                // flashlight forward
        case 68:
            // d
            flashlightImage = (flashlightImage + 1) % images.length;
            setFlashlightImage(images[flashlightImage][1]);
            $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
            break;

        case 38:
            // up             // background forward
        case 87:
            // w
            backgroundImage = (backgroundImage + 1) % images.length;
            setLargeImage(images[backgroundImage][1]);
            $('#backgroundText').text('Background: ' + images[backgroundImage][0]);
            break;

        case 40:
            // down            // background forward
        case 83:
            // s
            backgroundImage = (backgroundImage - 1 + images.length) % images.length;
            setLargeImage(images[backgroundImage][1]);
            $('#backgroundText').text('Background: ' + images[backgroundImage][0]);
            break;

        case 88:              // x
            canvas.clear();
            imageSetIndex = (imageSetIndex + 1) % imageSet.length;
            images = imageSet[imageSetIndex][1];
            $("#menuImages").empty();
            backgroundImage = 0;
            flashlightImage = 1;
            $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
            $('#backgroundText').text('Background: ' + images[backgroundImage][0]);
            setFlashlightImage(images[flashlightImage][1]);
            setLargeImage(images[backgroundImage][1]);
            break;

        case 90:              // z
            canvas.clear();
            imageSetIndex = (imageSetIndex + imageSet.length - 1) % imageSet.length;
            images = imageSet[imageSetIndex][1];
            $("#menuImages").empty();
            backgroundImage = 0;
            flashlightImage = 1;
            $('#flashlightText').text('Flashlight: ' + images[flashlightImage][0]);
            $('#backgroundText').text('Background: ' + images[backgroundImage][0]);
            setFlashlightImage(images[flashlightImage][1]);
            setLargeImage(images[backgroundImage][1]);
            break;

        case 69:
            // e               //circle/square toggle
            circle = !circle;
            draw();
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
                }, false);
            }
        }
    }
});
