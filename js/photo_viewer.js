/**
 * Created by adamcole on 10/17/15.
 *
 * photoViewer manipulates the view based on the state of the photoStore.
 * When updated with the showPhotoViewer function, photoViewer creates
 * a new photo mosaic and attaches handlers to it so that clicking on
 * one opens a thumbnail view.
 *
 * PhotoViewer is also responsible for
 * the lifecycle of the lightbox, including opening, closing, and navigation.
 *
 * @type {{showPhotoViewer}}
 */
photoViewer = function () {
    // general elements and events
    var CLASS = "class";
    var CLICK_EVENT = "click";
    var HIDE_CLASS = "hide";
    var NO_SCROLL_CLASS = "noscroll";

    // thumbnail elements
    var THUMBNAIL_CONTAINER_CLASS = "thumbnail-container";
    var THUMBNAIL_CLASS = "thumbnail";
    var INDEX_ATTR = "data-index";

    // lightbox elements
    var LIGHTBOX_ID = "lightbox-container"
    var LIGHBOX_CLOSE_ID = "lightbox-close-button";
    var LIGHTBOX_IMAGE_TITLE = "lightbox-image-title";
    var LIGHTBOX_IMAGE_ID = "lightbox-image";
    var SHOW_LIGHTBOX = "show-lightbox";

    // lightbox navigation elemets
    var LEFT_ARROW_CLASS = "lightbox-left-arrow";
    var RIGHT_ARROW_CLASS = "lightbox-right-arrow";

    // ui holds a cache of the DOM elements this object uses
    var ui = {};
    // current index of the photo on view in the lighbox
    var currImageIndex = 0;

    /**
     * cacheUIElements caches the DOM elements used by this object
     */
    var cacheUIElements = function () {
        ui.body = document.getElementsByTagName("body")[0];

        ui.thumbnailContainer = document.getElementById(THUMBNAIL_CONTAINER_CLASS);

        ui.lightboxContainer = document.getElementById(LIGHTBOX_ID);
        ui.lightboxClose = document.getElementById(LIGHBOX_CLOSE_ID);
        ui.lightboxImageTitle = document.getElementById(LIGHTBOX_IMAGE_TITLE);
        ui.lightboxImage = document.getElementById(LIGHTBOX_IMAGE_ID);

        ui.leftArrow = document.getElementById(LEFT_ARROW_CLASS);
        ui.rightArrow = document.getElementById(RIGHT_ARROW_CLASS);
    }

    /**
     * getImageSrc returns a url for the given photo's image source. It checks if the photo
     * has a large version, if not it returns the medium version
     * @param photo - photo to retrieve image source url for
     * @returns {string}
     */
    var getImageSrc = function(photo) {
        if (photo.src_large != null || photo.src_large != undefined) return photo.src_large;
        else return photo.src_medium;
    }

    /**
     * preloadImages preloads the images to the left and right of the
     * image currently on view in the lightbox to be cached by the browser
     * and make for seemingly faster loading for the user
     */
    var preloadImages = function () {
        var nextImage = currImageIndex + 1;
        if (nextImage >= photoStore.getSize()) nextImage = 0;
        var prevImage = currImageIndex - 1;
        if (prevImage < 0) prevImage = photoStore.getSize() - 1;

        img1 = new Image();
        img2 = new Image();
        img1.src = getImageSrc(photoStore.getPhoto(nextImage));
        img2.src = getImageSrc(photoStore.getPhoto(prevImage));
    }

    /**
     * showLightbox shows a lighbox view with the photo with the given index
     * @param index - index of the photo in the photoStore to show
     */
    var showLightbox = function (index) {
        ui.body.setAttribute(CLASS, NO_SCROLL_CLASS);
        ui.lightboxContainer.setAttribute(CLASS, SHOW_LIGHTBOX);
        setLightboxImage(parseInt(index));
    }

    /**
     * hideLightbox hides the lightbox view
     */
    var hideLightbox = function () {
        ui.body.className = "";
        ui.lightboxContainer.setAttribute(CLASS, HIDE_CLASS);
    }

    /**
     * setLightboxImage sets the image to be displayed in the lightbox to photo with
     * the newIndex and sets the correspoinding title
     * @param newIndex - index of the photo in the photoStore to show
     */
    var setLightboxImage = function (newIndex) {
        currImageIndex = newIndex;
        var photo = photoStore.getPhoto(currImageIndex);
        var img = document.createElement("img");
        img.src = getImageSrc(photo);
        ui.lightboxImage.innerHTML = "";
        ui.lightboxImage.appendChild(img);
        ui.lightboxImageTitle.innerHTML = photo.title;

        preloadImages();
    }

    /**
     * lightboxCloseHanlder handles the user clicking the X by hiding the
     * lightbox
     * @param e - javascript mouse event
     */
    var lightboxCloseHanlder = function (e) {
        e.stopPropagation();
        hideLightbox();
    }

    /**
     * thumbnailClickHandler handles the user clicking a thumbnail by extracting
     * the index of that image an showing the corresponding lightbox view
     * @param e - javascript mouse event
     */
    var thumbnailClickHandler = function (e) {
        e.stopPropagation();
        var thumbnail = e.target.parentNode;
        var index = thumbnail.getAttribute(INDEX_ATTR);
        showLightbox(index);
    }

    /**
     * rightArrowHandler handles the user clicking the right arrow by showing
     * the next photo
     */
    var rightArrowHandler = function () {
        var newImageIndex = currImageIndex + 1;
        if (newImageIndex >= photoStore.getSize()) newImageIndex = 0;
        setLightboxImage(newImageIndex);
    }

    /**
     * leftArrowHandler handles the user clicking the left arrow by showing
     * the previous photo
     */
    var leftArrowHandler = function () {
        var newImageIndex = currImageIndex - 1;
        if (newImageIndex < 0) newImageIndex = photoStore.getSize() - 1;
        setLightboxImage(newImageIndex);
    }

    /**
     * keyEventHanlder handles keyevents for left arrow key, right arrow key,
     * and the escape keu
     * @param e - javascript event
     */
    var keyEventHanlder = function (e) {
        // LEFT ARROW KEY
        if(e.keyCode === 37) {
            leftArrowHandler();
        }
        // RIGHT ARROW KEY
        else if(e.keyCode === 39) {
            rightArrowHandler();
        }
        // ESC KEY
        else if(e.keyCode === 27) {
            hideLightbox();
        }
    }

    /**
     * attachEventHandlers attaches event handlers for opening the lighbox to
     * a speciic image, closing the lightbox, and lightbox navigation by the arrow
     * and by the keyboard
     */
    var attachEventHandlers = function () {
        ui.lightboxClose.addEventListener(CLICK_EVENT, lightboxCloseHanlder);
        ui.leftArrow.addEventListener(CLICK_EVENT, leftArrowHandler);
        ui.rightArrow.addEventListener(CLICK_EVENT, rightArrowHandler);
        var thumbnails = document.getElementsByClassName(THUMBNAIL_CLASS);
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].addEventListener(CLICK_EVENT, thumbnailClickHandler);
        }
        document.addEventListener('keydown', keyEventHanlder);

    }

    /**
     * removeEventHandlers removes all event handlers added in attachEventHandlers
     */
    var removeEventHandlers = function() {
        if (ui.lightboxClose != undefined) ui.lightboxClose.removeEventListener(CLICK_EVENT, lightboxCloseHanlder);
        if (ui.leftArrow != undefined) ui.leftArrow.removeEventListener(CLICK_EVENT, leftArrowHandler);
        if (ui.rightArrow != undefined) ui.rightArrow.removeEventListener(CLICK_EVENT, rightArrowHandler);
        var thumbnails = document.getElementsByClassName(THUMBNAIL_CLASS);
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].removeEventListener(CLICK_EVENT, thumbnailClickHandler);
        }
        document.removeEventListener('keydown', keyEventHanlder);
    }

    /**
     * addThumbnailsToDom clears all previous thumbnails then iterates through the photos
     * in the store and adds each one to the DOM
     */
    var addThumbnailsToDom = function () {
        ui.thumbnailContainer.innerHTML = "";
        for (var i = 0; i < photoStore.getSize(); i++) {
            var photo = photoStore.getPhoto(i);
            var div = document.createElement('div');
            div.setAttribute(CLASS, THUMBNAIL_CLASS);
            div.setAttribute(INDEX_ATTR, i.toString());

            var img = document.createElement("img");
            img.src = photo.thumbnail_src;

            div.appendChild(img);
            ui.thumbnailContainer.appendChild(div);
        }
    }

    return {
        /**
         * showPhotoViewer shows the photos by caching UI elements, add the thumbnails
         * to the DOM and then attaching event handlers
         */
        showPhotoViewer: function () {
            cacheUIElements();
            addThumbnailsToDom()
            attachEventHandlers();
        },

        /**
         * hidePhotoView hides the photo view by removing the relevant event handlers
         * and clearing the thumbnail mosaic
         */
        hidePhotoView: function() {
            removeEventHandlers();
            if (ui.thumbnailContainer != undefined) ui.thumbnailContainer.innerHTML = "";
        }
    }

}();