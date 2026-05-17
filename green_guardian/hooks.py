app_name = "green_guardian"
app_title = "Green Guardian"
app_publisher = "Sakshi"
app_description = "Green Guardian"
app_email = "potesakshi194@gmail.com"
app_license = "mit"

fixtures = [
    {"doctype": "Web Page"},
    {"doctype": "Web Template"},
    {"doctype": "Web Form"},
    {"doctype": "Website Settings"},
    {"doctype": "Product"},
    {"doctype": "Catalogue"},
    {"doctype": "Category"},
]



app_include_js = [
    "/assets/green_guardian/js/hey_frappe.js"
]


# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "green_guardian",
# 		"logo": "/assets/green_guardian/logo.png",
# 		"title": "Green Guardian",
# 		"route": "/green_guardian",
# 		"has_permission": "green_guardian.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/green_guardian/css/green_guardian.css"
# app_include_js = "/assets/green_guardian/js/green_guardian.js"

# include js, css files in header of web template
# web_include_css = "/assets/green_guardian/css/green_guardian.css"
# web_include_js = "/assets/green_guardian/js/green_guardian.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "green_guardian/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "green_guardian/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "green_guardian.utils.jinja_methods",
# 	"filters": "green_guardian.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "green_guardian.install.before_install"
# after_install = "green_guardian.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "green_guardian.uninstall.before_uninstall"
# after_uninstall = "green_guardian.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "green_guardian.utils.before_app_install"
# after_app_install = "green_guardian.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "green_guardian.utils.before_app_uninstall"
# after_app_uninstall = "green_guardian.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "green_guardian.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"green_guardian.tasks.all"
# 	],
# 	"daily": [
# 		"green_guardian.tasks.daily"
# 	],
# 	"hourly": [
# 		"green_guardian.tasks.hourly"
# 	],
# 	"weekly": [
# 		"green_guardian.tasks.weekly"
# 	],
# 	"monthly": [
# 		"green_guardian.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "green_guardian.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "green_guardian.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "green_guardian.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["green_guardian.utils.before_request"]
# after_request = ["green_guardian.utils.after_request"]

# Job Events
# ----------
# before_job = ["green_guardian.utils.before_job"]
# after_job = ["green_guardian.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"green_guardian.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

