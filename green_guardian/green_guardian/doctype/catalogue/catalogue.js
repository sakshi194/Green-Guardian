// Copyright (c) 2025, Sakshi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Catalogue", {
    refresh(frm) {
	},

    attach(frm) {
        // When the 'image' field value changes
        if (frm.doc.attach) {
            frm.set_value("image_path", frm.doc.attach);
        } else {
            frm.set_value("image_path", "");
        }
    }
});
