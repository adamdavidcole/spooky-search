/**
 * Created by adamcole on 10/17/15.
 */
document.addEventListener("DOMContentLoaded", function(event) {
    photoStore.loadPhotoStore(function () {
        photoViewer.showPhotoViewer();
    });
});