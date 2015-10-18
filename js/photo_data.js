/**
 * Created by adamcole on 10/17/15.
 */
photoStore = (function() {
    var photos;
    var status;

    var consturctSourceUrl  = function (photo) {
        return "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
    }

    var getPhotoFromStore = function(i) {
        var photo = photos[i];
        return {
            thumbnail_src: photo.url_q,
            src: consturctSourceUrl(photo),
            title: photo.title
        }
    }

    var getGetRequestUrl = function(searchTags) {
        // parse comma separated search tags
        var tagsArr = searchTags.split(",");
        var tags = "";
        for (var i = 0; i < tagsArr.length; i++) {
            console.log(i);
            if (i > 0) {
                console.log("here?");
                tags += "+";
            }
            tags += tagsArr[i].trim();
        }

        var requestUrl = "https://api.flickr.com/services/rest/";
        var queryParams = {
            method: "flickr.photos.search",
            api_key: "9f3e157e2ef682ef54349c6f0d31cc9f",
            tags: searchTags,
            sort: "relevance",
            safe_search: "1",
            content_type: "1",
            extras: "url_q",
            format: "json",
            nojsoncallback: "1"
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
        loadPhotoStore: function (callback) {
            var url = getGetRequestUrl("baby penguins");
            var xmlRequest = new XMLHttpRequest();
            // compatible with IE7+, Firefox, Chrome, Opera, Safari
            xmlRequest.onreadystatechange = function () {
                if (xmlRequest.readyState == 4 && xmlRequest.status == 200) {
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


