/**
 * Created by adamcole on 10/17/15.
 */
photoStore = (function() {
    var SEARCH_PREFIX = "lego";
    var photos;
    var status;

    var consturctSourceUrl  = function (photo) {
        return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
    }

    var getPhotoFromStore = function(i) {
        var photo = photos[i];
        return {
            title: photo.title,
            thumbnail_src: photo.url_q,
            src_medium: consturctSourceUrl(photo),
            src_large: photo.url_l
        }
    }

    var getGetRequestUrl = function(searchTerm) {
        var requestUrl = "https://api.flickr.com/services/rest/";
        var queryParams = {
            method: "flickr.photos.search",
            api_key: "9f3e157e2ef682ef54349c6f0d31cc9f",
            //tags: tags,
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

        getPhoto: function (i) {
            return getPhotoFromStore(i);
        },

        getSize: function () {
            return photos.length;
        }
    }

})();


