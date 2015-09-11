# vanilla-slideshow

vanilla.slideshow is a simple module that makes it easy to display your image or browse your galleries.

## Requirements

* [vanilla](https://github.com/xylphid/vanilla)

## Installation

Include [vanilla](https://github.com/xylphid/vanilla) and `vanilla.slideshow.min.js` script :
```html
<script src="vanilla.min.js" type="text/javascript" charset="utf-8" />
<script src="vanilla.slideshow.min.js" type="text/javascript" charset="utf-8" />
```

Include the modal requirements and `vanilla.slideshow.css` default style :
```html
<link rel="stylesheet" href="vanilla.slideshow.css" type="text/css" media="screen" />
```

## Usage

### Method 1 : Single image with automatic load

The simplest approach is to add `data-slideshow` attribute to your links and use the `href` attribute to specify what to open in the modal.
Open an existing DOM element by ID :
```html
<a href="path/to/image" data-slideshow><img src="path/to/image/thumbnail" /></a>
```

### Method 2 : Attaching to link

You can manually open a modal by calling the `.slideshow()` method on the element:
```html
<a href="path/to/image" id="expand-image"><img src="path/to/image/thumbnail" /></a>
```

```js
$('#expand-image').slideshow();
```

You can also invoke `.slideshow()` directly on links:
```html
<div id="example-1" class="example">
    <a href="image1.jpg"><img src="thumbs/image1.jpg" /></a>
    <a href="image2.jpg"><img src="thumbs/image2.jpg" /></a>
    <a href="image3.jpg"><img src="thumbs/image3.jpg" /></a>
    <a href="image4.jpg"><img src="thumbs/image4.jpg" /></a>
</div>
```

```js
$('#example-1 > a').on('click', function(event) {
    event.preventDefault();
    vanilla(this).slideshow();
});
```

### Method 3 : Attaching slideshow to a link collection

If you have a gallery and want to play your slideshow, just use `vanilla.slideshow()` :
```html
<div class="gallery">
    <a href="path/to/image1" rel="slideshow:open" data-target="slideshow"><img src="path/to/image/thumbnail1" /></a>
    <a href="path/to/image2" rel="slideshow:open" data-target="slideshow"><img src="path/to/image/thumbnail2" /></a>
</div>
```

```js
vanilla.slideshow( '.gallery > a' );
```

When the slideshow is active, you can use `swipe` or `keyboard` arrows to navigate.

## Closing

Because there can be only one slideshow active at a single time, there's no need to select which slideshow to close:
```js
vanilla.slideshow.close();
```

## Options

These are the supported options and their default values:
```js
vanilla.slideshow.defaults = {
    autostart: false,           // Automatically play the slideshow
    opacity: 0.75,              // Overlay opacity
    overlay: '#000',            // Overlay color
    scaling: 'fitmax',          // Slide style display [fit, fitmax, fill]
    showSpinner: true,          // Show spinner on loading
    slideDelay:5000,            // Slide time on screen
    zIndex: 1,                  // Overlay z-index
}
```

# License (MIT)

jQuery Modal is distributed under the [MIT License](Learn more at http://opensource.org/licenses/mit-license.php):

    Copyright (c) 2015 Anthony PERIQUET

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.