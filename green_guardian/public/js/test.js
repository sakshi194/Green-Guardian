document.addEventListener("DOMContentLoaded", () => {
    // Give Frappe a little time to initialize
    setTimeout(() => {
        init_hey_frappe_listener();
    }, 2000);
});


let recognition = null;
let assistant_active = false;

function init_hey_frappe_listener() {
    console.log("init_hey entered")
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported");
        return;
    }


    // recognition = new webkitSpeechRecognition();
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
        console.log("🎤 Hey Frappe listening...");
    };

    recognition.onerror = (e) => {
        console.log("Speech error", e);
    };

    recognition.onend = () => {
        console.log("Restarting listener...");
        setTimeout(() => recognition.start(), 500);
    };

    recognition.onresult = (event) => {
        let last = event.results[event.results.length - 1][0].transcript
            .toLowerCase()
            .trim();

        handle_voice_command(last);
    };

    recognition.start();
}


function handle_voice_command(command) {

    command = normalize_command(command);

    // ✅ CREATE
    if (command.includes("create")) {
        let name = command.split("create")[1]?.trim();
        if (name) {
            create_doctype_from_voice(name);
            return;
        }
    }

    // ✅ SET FIELD
    if (command.includes("set")) {
        handle_set_field(command);
        return;
    }

    // ✅ SAVE
    if (command.includes("save")) {
        handle_save_and_submit("save");
        return;
    }
    if (command.includes("submit")) {
        handle_save_and_submit("submit");
        return;
    }

    // ✅ OPEN WITH FILTER
    if (command.includes("open")) {
        handle_open_with_filter(command);
        return;
    }

    // fallback
    open_doctype_from_voice(command);
}


function handle_set_field(command) {
    // Take only part after "set"
    let cleaned = command.split("set")[1]?.trim();
    
    if (!cleaned) {
        speak("Please say what to set");
        return;
    }

    // ✅ Normalize separators
    cleaned = cleaned
        .replace(/ equals to /gi, " as ")
        .replace(/ equals /gi, " as ")
        .replace(/ to /gi, " as ")
        .replace(/ = /g, " as ");

    // Support: "order type as maintenance"
    let parts = cleaned.split(" as ");
    if (parts.length < 2) {
        speak("Please say field name and value");
        return;
    }

    let field_label = parts[0].trim();
    let value = parts.slice(1).join(" as ").trim();

    // Ensure form exists
    if (!cur_frm) {
        speak("No form is open");
        return;
    }

    let fields = get_all_fields();

    let df = fields.find(d =>
        d.label &&
        d.label.toLowerCase() === field_label.toLowerCase()
    );
    
    // ✅ Fuzzy fallback
    if (!df) {
        df = fields.find(d =>
            d.fieldname &&
            d.fieldname.toLowerCase() === field_label.replace(/\s+/g, "").toLowerCase()
        );
    }
    
    if (!df) {
        speak(`Field ${field_label} not found`);
        return;
    }
    
    let final_value = value;
    
    // ✅ Handle Select
    if (df.fieldtype === "Select") {
        final_value = resolve_select_value(df, value);
    }
    
    // ✅ Handle Date
    if (df.fieldtype === "Date") {
        let d = resolve_date_value(value);
        if (!d) {
            speak("Invalid date");
            return;
        }
        final_value = d;
    }
    set_child_or_parent_field(df, final_value);
}


function set_child_or_parent_field(df, value) {
    // ✅ Parent field
    if (!df.parent || df.parent === cur_frm.doctype) {
        cur_frm.set_value(df.fieldname, value);
        speak(`${df.label} set to ${value}`);
        return;
    }
    
    // ✅ Child table field
    let table_field = cur_frm.fields_dict[df.parent];
    if (!table_field || !table_field.grid) {
        speak(`Cannot find table ${df.parent}`);
        return;
    }

    let row = table_field.grid.get_selected_children()?.[0];

    if (!row) {
        row = cur_frm.add_child(df.parent);
        table_field.grid.refresh();
    }

    frappe.model.set_value(row.doctype, row.name, df.fieldname, value);

    speak(`${df.label} set to ${value}`);
}


function resolve_select_value(df, spoken_value) {
    if (!df.options) return spoken_value;

    let options = df.options.split("\n").map(o => o.trim()).filter(o => o);

    let normalized = spoken_value.toLowerCase();

    // exact match
    let exact = options.find(o => o.toLowerCase() === normalized);
    if (exact) return exact;

    // partial match
    let partial = options.find(o => o.toLowerCase().includes(normalized));
    if (partial) return partial;

    // fuzzy remove spaces
    let flat = normalized.replace(/\s+/g, "");
    let fuzzy = options.find(o => o.toLowerCase().replace(/\s+/g, "") === flat);
    if (fuzzy) return fuzzy;

    return spoken_value;
}


function get_all_fields() {
    let all_fields = [];

    // Parent fields
    all_fields = all_fields.concat(frappe.meta.get_docfields(cur_frm.doctype));

    // Child table fields
    frappe.meta.get_docfields(cur_frm.doctype).forEach(df => {
        if (df.fieldtype === "Table") {
            let child_meta = frappe.get_meta(df.options);
            if (child_meta && child_meta.fields) {
                child_meta.fields.forEach(cf => {
                    cf.parent = df.fieldname;   // 👈 attach table fieldname
                    all_fields.push(cf);
                });
            }
        }
    });

    return all_fields;
}

function resolve_date_value(spoken) {
    let text = spoken.toLowerCase().trim();

    // ✅ Relative dates
    if (text === "today") {
        return frappe.datetime.get_today();
    }

    if (text === "tomorrow") {
        return frappe.datetime.add_days(frappe.datetime.get_today(), 1);
    }

    if (text === "yesterday") {
        return frappe.datetime.add_days(frappe.datetime.get_today(), -1);
    }

    // ✅ ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return text;
    }

    // ✅ dd-mm-yyyy
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(text)) {
        let [d, m, y] = text.split("-");
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // ✅ Natural language date
    let parsed = new Date(spoken);

    if (!isNaN(parsed.getTime())) {
        let yyyy = parsed.getFullYear();
        let mm = String(parsed.getMonth() + 1).padStart(2, "0");
        let dd = String(parsed.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    return null;
}



function handle_save_and_submit(action = "save") {
    if (!cur_frm) {
        speak("No form open");
        return;
    }

    if (action === "submit") {
        if (cur_frm.doc.docstatus === 1) {
            speak("Document already submitted");
            return;
        }

        speak("Submitting document");

        // ✅ Auto confirm
        const original_confirm = frappe.confirm;
        frappe.confirm = function (msg, yes, no) {
            yes();
            frappe.confirm = original_confirm;
        };

        cur_frm.savesubmit().then(() => {
            speak("Document submitted successfully");
        });

        return;
    }

    // ✅ SAVE
    if (!cur_frm.is_dirty()) {
        speak("Nothing to save");
        return;
    }

    speak("Saving document");
    cur_frm.save().then(() => {
        speak("Document saved successfully");
    });
}



function handle_open_with_filter(command) {
    // Example:
    // open customer doctor with customer name sp

    let cleaned = command.replace(/\bopen\b/i, "").trim();

    let [doctype_part, filter_part] = cleaned.split(/\bwith\b/i);
    if (!doctype_part) {
        speak("Please tell me which doctype to open");
        return;
    }

    let doctype = capitalizeWords(doctype_part.trim());

    // No filter → open list
    if (!filter_part) {
        speak(`Opening ${doctype}`);
        frappe.set_route("List", doctype);
        return;
    }

    let filter_words = filter_part.trim().split(" ");
    let value = filter_words.pop();          // last word is value
    let field_label = filter_words.join(" "); // rest is field label

    resolve_field_and_open(doctype, field_label, value);
}


function resolve_field_and_open(doctype, spoken_field, value) {
    frappe.model.with_doctype(doctype, () => {
        let meta = frappe.get_meta(doctype);

        if (!meta || !meta.fields) {
            speak(`Cannot read metadata for ${doctype}`);
            return;
        }

        let normalized_spoken = spoken_field.toLowerCase().replace(/\s+/g, "");

        let field = meta.fields.find(f =>
            f.label &&
            f.label.toLowerCase().replace(/\s+/g, "") === normalized_spoken
        );

        if (!field) {
            speak(`I cannot find field ${spoken_field} in ${doctype}`);
            return;
        }

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: doctype,
                fields: ["name"],
                filters: {
                    [field.fieldname]: ["like", `%${value}%`]
                },
                limit_page_length: 5
            },
            callback(r) {
                let results = r.message || [];

                if (results.length === 1) {
                    let docname = results[0].name;
                    speak(`Opening ${doctype}`);
                    frappe.set_route("Form", doctype, docname);

                } else if (results.length > 1) {
                    speak(`Multiple ${doctype} found`);
                    frappe.set_route("List", doctype, {
                        [field.fieldname]: ["like", `%${value}%`]
                    });

                } else {
                    speak(`No ${doctype} found with ${value}`);
                }
            }
        });
    });
}




function is_probable_docname(text) {
    // Matches SO-2026-000123, DN-00045, INV-0001, etc
    return /^[A-Z]{2,}-\d{3,}-?\d*$/.test(text.toUpperCase());
}

function open_document(doctype, name) {
    frappe.db.exists(doctype, name).then(exists => {
        if (exists) {
            speak(`Opening ${doctype} ${name}`);
            frappe.set_route("Form", doctype, name);
        } else {
            speak(`${doctype} ${name} not found`);
        }
    });
}

function open_list_with_filter(doctype, keyword) {
    speak(`Searching ${doctype}`);

    let filters = {};

    if (keyword.includes("pending")) {
        filters["status"] = "Pending";
    }
    if (keyword.includes("draft")) {
        filters["docstatus"] = 0;
    }
    if (keyword.includes("submitted")) {
        filters["docstatus"] = 1;
    }

    frappe.set_route("List", doctype, filters);
}


function toggle_assistant() {
    if (!assistant_active) {
        recognition.start();
        assistant_active = true;
    } else {
        recognition.stop();
        assistant_active = false;
    }
}


function open_doctype_from_voice(spoken_name) {

    let doctype_name = spoken_name
        .trim()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    
    frappe.db.exists("DocType", doctype_name).then(exists => {
        if (exists) {
            speak(`Opening ${doctype_name}`);
            frappe.set_route("List", doctype_name);
        } else {
            speak(`Cannot find DocType named ${doctype_name}`);
        }
    });
}
function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function create_doctype_from_voice(spoken_name) {

    // Capitalize each word to match ERPNext naming
    let doctype_name = spoken_name
        .trim()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    frappe.db.exists("DocType", doctype_name).then(exists => {
        if (exists) {
            speak(`Creating ${doctype_name}`);
            frappe.set_route("Form", doctype_name, "new-" + doctype_name.replace(/\s+/g, "-"));
        } else {
            speak(`Cannot find DocType named ${doctype_name}`);
        }
    });
}




function speak(text) {
    let msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-IN";
    window.speechSynthesis.speak(msg);
}

function normalize_command(text) {
    return text
        .toLowerCase()

        // Wake words
        .replace(/hey erp|hey frappe|hey frappy|hey preppi|frappe|erp/gi, "")

        // Polite fillers
        .replace(/please|can you|could you|would you|for me|kindly/gi, "")

        // Normalize create intent
        .replace(/create new|make new|add new|new create/gi, "create")

        // Normalize open/search intent
        .replace(/show me|search for|search|find|document|the|of type/gi, "")

        // Cleanup spaces
        .replace(/\s+/g, " ")
        .trim();
}



function extract_doc_tail(text) {
    // Extract last numeric chunk (e.g. 2345)
    const match = text.match(/\d{3,}$/);
    return match ? match[0] : null;
}

function open_document_smart(doctype, spoken_text) {
    const tail = extract_doc_tail(spoken_text);

    // Case 1: Exact name spoken
    if (is_probable_docname(spoken_text)) {
        open_document(doctype, spoken_text.toUpperCase());
        return;
    }

    // Case 2: Partial number spoken → LIKE search
    if (tail) {
        search_document_by_like(doctype, tail);
        return;
    }

    // Fallback → open list
    speak(`Opening ${doctype}`);
    frappe.set_route("List", doctype);
}

function search_document_by_like(doctype, tail) {
    speak(`Searching ${doctype}`);

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: doctype,
            fields: ["name"],
            filters: [
                ["name", "like", `%${tail}%`]
            ],
            limit_page_length: 5
        },
        callback(r) {
            const results = r.message || [];

            if (results.length === 1) {
                // 🎯 Exactly one match → open it
                const docname = results[0].name;
                speak(`Opening ${doctype} ${docname}`);
                frappe.set_route("Form", doctype, docname);

            } else if (results.length > 1) {
                // 📋 Multiple matches → open filtered list
                speak(`Multiple ${doctype} found`);
                frappe.set_route("List", doctype, {
                    name: ["like", `%${tail}%`]
                });

            } else {
                speak(`No ${doctype} found with ${tail}`);
            }
        }
    });
}
