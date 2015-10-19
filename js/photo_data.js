/**
 * Created by adamcole on 10/17/15.
 *
 * photoStore stores the photos currently on view in the photoViewer. Photos
 * are stored in an array of photo objects returned from an API call to
 * flickr's search endpoint.
 *
 * @type {{loadPhotoStore, getPhoto, getSize}}
 */
photoStore = (function() {
    // prefix to attach to every search term
    var SEARCH_PREFIX = "spooky";
    // array of photo object
    var photos;
    // status of api call
    var status;

    /**
     * consturctSourceUrl takes a flickr photo objet and returns a url to an image file
     * @param photo -  flickr photo objet returned from the search api
     * @returns {string} - url to corresponding image file
     */
    var consturctSourceUrl  = function (photo) {
        return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
    }

    /**
     * getPhotoFromStore returns an object representing a photo with the following structure
     *  {
     *      title:         String // title of the photo
     *      thumbnail_src: String // source url for a 150 x 150 pixel thumbnail of the image
     *      src_medium:    String // source url for a medium resolution (500px) of the image
     *      src_large:     String // source url for a medium resolution (1024px) of the image (note. not always availible)
     *  }
     * @param i - index of the photo to return
     * @returns {{title: (*|string), thumbnail_src: *, src_medium: string, src_large: *}}
     */
    var getPhotoFromStore = function(i) {
        var photo = photos[i];
        return {
            title: photo.title,
            thumbnail_src: photo.url_q,
            src_medium: consturctSourceUrl(photo),
            src_large: photo.url_l
        }
    }

    /**
     * getGetRequestUrl returns the url string used in the XmlHttp GET Request. Url string
     * contains the search term concatenated with the prefix "spooky"
     * @param searchTerm - search term used to search for relevant images
     * @returns {string} - the url used in the GET request
     */
    var getGetRequestUrl = function(searchTerm) {
        var requestUrl = "https://api.flickr.com/services/rest/";
        var queryParams = {
            method: "flickr.photos.search",
            api_key: "9f3e157e2ef682ef54349c6f0d31cc9f",
            text: SEARCH_PREFIX + " " + searchTerm,
            sort: "relevance",
            safe_search: "1",
            content_type: "1",
            extras: "url_q, url_l",
            format: "json",
            nojsoncallback: "1",
            per_page: "200"
        };

        // encode query params
        var encodedQueryPairs = [];
        for (var key in queryParams)
            encodedQueryPairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key]));
        var query = encodedQueryPairs.join("&");

        // construct full url
        var url = requestUrl + "?" + query;

        return url;
    }

    return {
        /**
         * loadPhotoStore loads the photo store with photo objects based on the search
         * term by initiating an XMLHttpRequest to the flickr search api
         * @param searchTerm - search term used in flickr search query
         * @param callback - callback to call once the requests succeedes
         */
        loadPhotoStore: function (searchTerm, callback) {
            var url = getGetRequestUrl(searchTerm);
            var xmlRequest = new XMLHttpRequest();
            // compatible with IE7+, Firefox, Chrome, Opera, Safari
            xmlRequest.onreadystatechange = function () {
                if (xmlRequest.readyState === 4 && xmlRequest.status === 200) {
                    var data = JSON.parse(xmlRequest.responseText);
                    status = data.stat;
                    photos = data.photos.photo;
                    callback();
                }
            }
            xmlRequest.open("GET", url, true);
            xmlRequest.send();
        },

        /**
         * getPhoto returns the ith photo in the photoStore
         * @param i - index of the photo to return
         * @returns {{title, thumbnail_src, src_medium, src_large}|{title: (*|string), thumbnail_src: *, src_medium: string, src_large: *}}
         */
        getPhoto: function (i) {
            return getPhotoFromStore(i);
        },

        /**
         * getSize returns the number of photos in the photo store
         * @returns {number}
         */
        getSize: function () {
            return photos.length;
        }
    }
})();