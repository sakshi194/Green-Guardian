function speak(text) {
    let msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-IN";
    speechSynthesis.speak(msg);
}

function normalize_command(text) {
    return text.toLowerCase()
        .replace(/hey frappe|frappe|erp/gi, "")
        .replace(/please|kindly/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}
