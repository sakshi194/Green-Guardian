document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        load_hey_frappe();
    }, 2000);
});

function load_hey_frappe() {
    load_script("/assets/green_guardian/js/hey_frappe/voice_ui.js");
    load_script("/assets/green_guardian/js/hey_frappe/utils.js");
    load_script("/assets/green_guardian/js/hey_frappe/field_handler.js");
    load_script("/assets/green_guardian/js/hey_frappe/open_handler.js");
    load_script("/assets/green_guardian/js/hey_frappe/command_router.js");
    load_script("/assets/green_guardian/js/hey_frappe/voice_engine.js");
}

function load_script(src) {
    let s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
}
