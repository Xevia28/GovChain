document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('menuIcon').addEventListener('click', function () {
        document.getElementById('linkswrapper').classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

});
