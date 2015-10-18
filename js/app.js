/**
 * Created by adamcole on 10/17/15.
 */
document.addEventListener("DOMContentLoaded", function(event) {
    var callback = function() {
        for (var i = 0; i < photoStore.getSize(); i++) {
            var photo = photoStore.getPhoto(i);
            var div = document.createElement('div');
            div.setAttribute("class", "thumbnail");
            div.setAttribute("index", i.toString());

            var img = document.createElement("img");
            img.src = photo.thumbnail_src;

            div.appendChild(img);
            document.getElementById("thumbnail-container").appendChild(div);
        }
    }
    photoStore.loadPhotoStore(callback);
});