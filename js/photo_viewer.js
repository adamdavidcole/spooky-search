/**
 * Created by adamcole on 10/17/15.
 */
photoViewer = function () {
    var CLASS = "class";
    var CLICK_EVENT = "click";
    var THUMBNAIL_CONTAINER_CLASS = "thumbnail-container";
    var THUMBNAIL_CLASS = "thumbnail";
    var INDEX_ATTR = "data-index";

    var LIGHTBOX_ID = "lightbox-container"
    var LIGHBOX_CLOSE_ID = "lightbox-close-button";
    var LIGHTBOX_IMAGE_TITLE = "lightbox-image-title";
    var LIGHTBOX_IMAGE_ID = "lightbox-image";
    var HIDE_CLASS = "hide";
    var SHOW_LIGHTBOX = "show-lightbox";
    var NO_SCROLL_CLASS = "noscroll";

    var LEFT_ARROW_CLASS = "lightbox-left-arrow";
    var RIGHT_ARROW_CLASS = "lightbox-right-arrow";

    var ui = {};
    var currImageIndex = 0;

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

    var getImageSrc = function(photo) {
        if (photo.src_large != null || photo.src_large != undefined) return photo.src_large;
        else return photo.src_medium;
    }

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

    var showLightbox = function (index) {
        ui.body.setAttribute(CLASS, NO_SCROLL_CLASS);
        ui.lightboxContainer.className = "";
        ui.lightboxContainer.setAttribute(CLASS, SHOW_LIGHTBOX);
        setLightboxImage(parseInt(index));
    }

    var hideLightbox = function (i) {
        ui.body.className = "";
        ui.lightboxContainer.setAttribute(CLASS, HIDE_CLASS);
    }


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

    var lightboxCloseHanlder = function (e) {
        e.stopPropagation();
        hideLightbox();
    }

    var thumbnailClickHandler = function (e) {
        e.stopPropagation();
        var thumbnail = e.target.parentNode;
        var index = thumbnail.getAttribute(INDEX_ATTR);
        showLightbox(index);
    }

    var rightArrowHandler = function () {
        var newImageIndex = currImageIndex + 1;
        if (newImageIndex >= photoStore.getSize()) newImageIndex = 0;
        setLightboxImage(newImageIndex);
    }

    var leftArrowHandler = function () {
        var newImageIndex = currImageIndex - 1;
        if (newImageIndex < 0) newImageIndex = photoStore.getSize() - 1;
        setLightboxImage(newImageIndex);
    }

    var attachEventHandlers = function () {
        ui.lightboxClose.addEventListener(CLICK_EVENT, lightboxCloseHanlder);
        ui.leftArrow.addEventListener(CLICK_EVENT, leftArrowHandler);
        ui.rightArrow.addEventListener(CLICK_EVENT, rightArrowHandler);
        var thumbnails = document.getElementsByClassName(THUMBNAIL_CLASS);
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].addEventListener(CLICK_EVENT, thumbnailClickHandler);
        }
        document.addEventListener('keydown', function(event) {
            if(event.keyCode === 37) {
                leftArrowHandler();
            }
            else if(event.keyCode === 39) {
                rightArrowHandler();
            }
            else if(event.keyCode === 27) {
                hideLightbox();
            }
        });
    }

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
        showPhotoViewer: function () {
            cacheUIElements();
            addThumbnailsToDom()
            attachEventHandlers();
        },

        clearPhotoViewer: function () {
            ui.thumbnailContainer.innerHTML = "";

        }
    }

}();