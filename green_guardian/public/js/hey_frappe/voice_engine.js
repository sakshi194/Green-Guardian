let recognition = null;
let assistant_active = false;

function init_hey_frappe_listener() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
        update_voice_panel("Listening…", "🎤 Ready");
    };

    recognition.onend = () => {
        setTimeout(() => recognition.start(), 500);
    };

    recognition.onresult = (event) => {
        let last = event.results[event.results.length - 1][0].transcript
            .toLowerCase()
            .trim();

        update_voice_panel(last, "👂 Heard");
        handle_voice_command(last);
    };

    recognition.start();
}

$(document).ready(() => {
    create_voice_panel();
    init_hey_frappe_listener();
});
