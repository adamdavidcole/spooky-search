/**
 * Created by adamcole on 10/17/15.
 */

app = (function() {
    var THUMBNAIL_CONTAINER_CLASS = "thumbnail-container";
    var LOADING_ID = "loading-view";

    var ui = {};

    var cacheUIElements = function () {
        ui.thumbnailContainer = document.getElementById(THUMBNAIL_CONTAINER_CLASS);
        ui.searchInput = document.getElementsByTagName("input")[0];
        ui.loadingView = document.getElementById(LOADING_ID);
    }

    var searchSubmitHandler = function() {
        var value = ui.searchInput.value.trim();
        console.log(value);
        if (value !== null && value !== undefined && value !== "") {
            loadViewer(value);
        }
    }

    var attachEventHandlers = function () {
        document.addEventListener('keydown', function(event) {
            if(event.keyCode == 13) {
                searchSubmitHandler();
            }
        });
    }

    var loadViewer = function(searchTerm) {
        showLoadingView();
        ui.thumbnailContainer.innerHTML = "";
        photoStore.loadPhotoStore(searchTerm, function () {
            hideLoadingView();
            photoViewer.showPhotoViewer();
        });
    }

    var hideLoadingView = function () {
        ui.loadingView.setAttribute("class", "hide");
    }

    var showLoadingView = function () {
        ui.loadingView.className = "";
    }

    return {
        initiate: function () {
            cacheUIElements();
            attachEventHandlers();
            loadViewer("tapir");
        }
    }
})();


document.addEventListener("DOMContentLoaded", function(event) {
    app.initiate();
});