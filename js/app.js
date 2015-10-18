/**
 * Created by adamcole on 10/17/15.
 *
 * app initializes the photo viewing application by loading photos into the
 * photoStore and showing the photoViewer
 */
app = (function() {
    // term to search for on initial page load
    var INITIAL_SEARCH_TERM = "pumpkin";

    // html elements
    var THUMBNAIL_CONTAINER_ID = "thumbnail-container";
    var LOADING_ID = "loading-view";
    var INPUT_TAG = "input";

    // events
    var KEYDOWN_EVENT = "keydown";
    var ENTER_KEY_CODE = 13;

    // ui holds a cache of the DOM elements this object uses
    var ui = {};

    /**
     * searchSubmitHandler gets the value of the input box and initiates a new search
     * which will load in new images
     */
    var searchSubmitHandler = function() {
        var value = ui.searchInput.value.trim();
        console.log(value);
        if (value !== null && value !== undefined && value !== "") {
            loadViewer(value);
        }
    }

    /**
     * hideLoadingView hides the loading gif
     */
    var hideLoadingView = function () {
        ui.loadingView.setAttribute("class", "hide");
    }

    /**
     * showLoadingView shows the loading gif
     */
    var showLoadingView = function () {
        ui.loadingView.className = "";
    }

    /**
     * cacheUIElements caches the DOM elements used by this object
     */
    var cacheUIElements = function () {
        ui.thumbnailContainer = document.getElementById(THUMBNAIL_CONTAINER_ID);
        ui.searchInput = document.getElementsByTagName(INPUT_TAG)[0];
        ui.loadingView = document.getElementById(LOADING_ID);
    }

    /**
     * attachEventHandlers attaches an event handler for when the enter key is pressed
     */
    var attachEventHandlers = function () {
        document.addEventListener(KEYDOWN_EVENT, function(event) {
            if(event.keyCode == ENTER_KEY_CODE) {
                searchSubmitHandler();
            }
        });
    }

    /**
     * loadViewer loads new images into the photoViewer with the new search term
     * @param searchTerm - search term sent to photoStore to populate photoViewer
     */
    var loadViewer = function(searchTerm) {
        showLoadingView();
        ui.thumbnailContainer.innerHTML = "";
        photoStore.loadPhotoStore(searchTerm, function () {
            hideLoadingView();
            photoViewer.showPhotoViewer();
        });
    }

    return {
        /**
         * initiate initiates the app by caching UI elements, attaching event handlers
         * and loading the photo viewer with the initial search term
         */
        initiate: function () {
            cacheUIElements();
            attachEventHandlers();
            loadViewer(INITIAL_SEARCH_TERM);
        }
    }
})();

/**
 * initiate the app once the DOM has finished loading
 */
document.addEventListener("DOMContentLoaded", function(event) {
    app.initiate();
});