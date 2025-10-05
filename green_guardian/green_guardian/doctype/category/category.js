// Copyright (c) 2025, Sakshi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Category", {

    type(frm) {
        if(frm.doc.type){
            let formatted_link = "/" + frm.doc.type.replace(/\s+/g, "_");
            frm.set_value("link", formatted_link);
        }
        else {
            frm.set_value("link", "");
        
        
        
        }
    }
});
