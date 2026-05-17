function open_doctype_from_voice(spoken_name) {
    let doctype = capitalizeWords(spoken_name);

    frappe.db.exists("DocType", doctype).then(exists => {
        if (exists) frappe.set_route("List", doctype);
        else speak(`Cannot find ${doctype}`);
    });
}
