function create_voice_panel() {
    if (document.getElementById("voice-panel")) return;

    let panel = document.createElement("div");
    panel.id = "voice-panel";
    panel.innerHTML = `
        <div id="voice-status"></div>
        <div id="voice-text"></div>
    `;

    Object.assign(panel.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "280px",
        background: "#111827",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        zIndex: 9999,
        fontSize: "13px"
    });

    document.body.appendChild(panel);
}

function update_voice_panel(text, status = "") {
    let panel = document.getElementById("voice-panel");
    if (!panel) return;

    panel.querySelector("#voice-status").innerText = status;
    panel.querySelector("#voice-text").innerText = text;
}
