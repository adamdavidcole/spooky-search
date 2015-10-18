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
        ui.lightboxContainer = document.getElementById(LIGHTBOX_ID);
        ui.lightboxClose = document.getElementById(LIGHBOX_CLOSE_ID);
        ui.lightboxImageTitle = document.getElementById(LIGHTBOX_IMAGE_TITLE);
        ui.lightboxImage = document.getElementById(LIGHTBOX_IMAGE_ID);
        ui.leftArrow = document.getElementById(LEFT_ARROW_CLASS)
        ui.rightArrow = document.getElementById(RIGHT_ARROW_CLASS)
    }

    var showLightbox = function (i) {
        ui.body.setAttribute(CLASS, NO_SCROLL_CLASS);
        ui.lightboxContainer.className = "";
        ui.lightboxContainer.setAttribute(CLASS, SHOW_LIGHTBOX);
    }

    var hideLightbox = function (i) {
        ui.body.className = "";
        ui.lightboxContainer.setAttribute(CLASS, HIDE_CLASS);
    }

    var thumbnailClickHandler = function (e) {
        e.stopPropagation();
        var thumbnail = e.target.parentNode;
        var index = thumbnail.getAttribute(INDEX_ATTR);
        showLightbox(index);
    }

    var lightboxCloseHanlder = function (e) {
        console.log("do i get clicked");
        e.stopPropagation();
        hideLightbox();
    }

    var setLightboxImage = function (newIndex) {
        currImageIndex = newIndex;
    }

    var rightArrowHandler = function (e) {
        var newImageIndex = (currImageIndex + 1) % photoStore.getSize();
        setLightboxImage(newImageIndex);
    }

    var leftArrowHandler = function (e) {
        var newImageIndex = (currImageIndex - 1) % photoStore.getSize();
        setLightboxImage(newImageIndex);
    }

    var attachEventHandlers = function () {
        ui.lightboxClose.addEventListener(CLICK_EVENT, lightboxCloseHanlder);
        //ui.rightArrow.addEventListener(CLICK_EVENT, )
        var thumbnails = document.getElementsByClassName(THUMBNAIL_CLASS);
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].addEventListener(CLICK_EVENT, thumbnailClickHandler);
        }
    }

    var addThumbnailsToDom = function () {
        for (var i = 0; i < photoStore.getSize(); i++) {
            var photo = photoStore.getPhoto(i);
            var div = document.createElement('div');
            div.setAttribute(CLASS, THUMBNAIL_CLASS);
            div.setAttribute(INDEX_ATTR, i.toString());

            var img = document.createElement("img");
            img.src = photo.thumbnail_src;

            div.appendChild(img);
            document.getElementById(THUMBNAIL_CONTAINER_CLASS).appendChild(div);
        }
    }

    return {
        showPhotoViewer: function () {
            addThumbnailsToDom()
            cacheUIElements();
            attachEventHandlers();
        }
    }

}();