let gifs = [];
let mp3s = [];
let captions = [];
let autoplayEnabled = false;

document.getElementById('autoplayCheckbox').addEventListener('change', function(event) {
    autoplayEnabled = event.target.checked;
});

document.getElementById('zipUpload').addEventListener('change', function(event) {
    let file = event.target.files[0];
    let jsZip = new JSZip();

    jsZip.loadAsync(file).then(function(zip) {
        gifs = [];
        mp3s = [];
        captions = [];

        Object.keys(zip.files).forEach(function(filename) {
            let file = zip.files[filename];
            if (!file.dir) {
                if (filename.startsWith("gifs/") && filename.endsWith(".gif")) {
                    file.async('blob').then(function(blob) {
                        gifs.push(new File([blob], filename));
                    });
                } else if (filename.startsWith("audio/") && filename.endsWith(".mp3")) {
                    file.async('blob').then(function(blob) {
                        mp3s.push(new File([blob], filename));
                    });
                } else if (filename === "captions.txt") {
                    file.async('string').then(function(content) {
                        captions = content.split('\n');
                    });
                }
            }
        });
    });
});

document.getElementById('generateButton').addEventListener('click', generateMedia);

function generateMedia() {
    if (gifs.length && mp3s.length && captions.length) {
        let randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        let randomMp3 = mp3s[Math.floor(Math.random() * mp3s.length)];
        let randomCaption = captions[Math.floor(Math.random() * captions.length)];

        let gifUrl = URL.createObjectURL(randomGif);
        let mp3Url = URL.createObjectURL(randomMp3);

        let gifDisplay = document.getElementById('gifDisplay');
        let mp3Display = document.getElementById('mp3Display');
        
        gifDisplay.src = gifUrl;
        mp3Display.src = mp3Url;
        mp3Display.play();
        mp3Display.loop = !autoplayEnabled;

        document.getElementById('captionDisplay').innerText = randomCaption;
        document.getElementById('displayArea').classList.remove('hidden');

        if (autoplayEnabled) {
            mp3Display.onended = generateMedia;
        } else {
            mp3Display.onended = null;
        }
    } else {
        alert("Please upload a ZIP file with the required contents.");
    }
}

