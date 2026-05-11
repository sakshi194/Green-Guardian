function handle_voice_command(command) {
    command = normalize_command(command);
    update_voice_panel(command, "🧠 Interpreting");

    if (command.includes("create")) {
        create_doctype_from_voice(command.split("create")[1]);
        return;
    }

    if (command.includes("set") || command.includes("change") ) {
        handle_set_field(command);
        return;
    }

    if (command.includes("save")) {
        handle_save_and_submit("save");
        return;
    }

    if (command.includes("submit")) {
        handle_save_and_submit("submit");
        return;
    }

    if (command.includes("open")) {
        handle_open_with_filter(command);
        return;
    }

    open_doctype_from_voice(command);
}
