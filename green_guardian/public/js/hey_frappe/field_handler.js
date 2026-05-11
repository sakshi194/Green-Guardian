function handle_set_field(command) {
    let cleaned = command.split("set")[1] || command.split("change")[1];
    if (!cleaned || !cur_frm) return;

    cleaned = cleaned.replace(/ equals | to | = /gi, " as ");
    let parts = cleaned.split(" as ");

    let field_label = parts[0].trim();
    let value = parts.slice(1).join(" as ").trim();

    let fields = get_all_fields();

    let df = fields.find(d => d.label?.toLowerCase() === field_label.toLowerCase());
    if (!df) return speak(`Field ${field_label} not found`);

    let final_value = value;

    if (df.fieldtype === "Select") final_value = resolve_select_value(df, value);
    if (df.fieldtype === "Date") final_value = resolve_date_value(value);

    set_child_or_parent_field(df, final_value);
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
