/**
 * Created by adamcole on 10/17/15.
 */
photoViewer = function () {
    var CLASS = "class";
    var THUMBNAIL_CONTAINER_CLASS = "thumbnail-container";
    var THUMBNAIL_CLASS = "thumbnail";
    var INDEX_ATTR = "data-index";

    var LIGHTBOX_ID = "lightbox-container"
    var LIGHBOX_CLOSE_ID = "lightbox-close-button";
    var HIDE_CLASS = "hide";
    var NO_SCROLL_CLASS = "noscroll";


    var ui = {};

    var cacheUIElements = function () {
        ui.body = document.getElementsByTagName("body")[0];
        ui.lightboxContainer = document.getElementById(LIGHTBOX_ID);
        ui.lightboxClose = document.getElementById(LIGHBOX_CLOSE_ID);
        console.log(ui.lightboxClose);
    }

    var showLightbox = function (i) {
        ui.body.setAttribute(CLASS, NO_SCROLL_CLASS);
        ui.lightboxContainer.className = "";
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

    var attachEventHandlers = function () {
        ui.lightboxClose.addEventListener("click", lightboxCloseHanlder);
        var thumbnails = document.getElementsByClassName(THUMBNAIL_CLASS);
        for (var i = 0; i < thumbnails.length; i++) {
            thumbnails[i].addEventListener("click", thumbnailClickHandler);
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