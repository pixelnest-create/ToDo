let tasks = [];
let groups = [];
let events = [];
let g_default = ["All Tasks"]
let delete_target = null;
let rename_target = null;
let rename_target_type = "group";
let delete_target_type = "group";
let editing_event = null;
let event_period = "upcoming";
let current_view = "list";
let selected_group_id = null;
let group_assign_task = null;
let displayed_month = new Date();
let picker_month = new Date();
let active_date_value = null;
let active_date_display = null;
let active_date_task = null;
let memos = [];
let selected_memo_id = null;
let current_user = null;
let auth_mode = "signin";

const auth_screen = document.getElementById("auth_screen");
const app_shell = document.getElementById("app_shell");
const auth_form = document.getElementById("auth_form");
const auth_username = document.getElementById("auth_username");
const auth_password = document.getElementById("auth_password");
const auth_confirm_password = document.getElementById("auth_confirm_password");
const auth_confirm_wrap = document.getElementById("auth_confirm_wrap");
const auth_username_status = document.getElementById("auth_username_status");
const auth_error = document.getElementById("auth_error");
const auth_submit = document.getElementById("auth_submit");
const auth_title = document.getElementById("auth_title");
const auth_hint = document.getElementById("auth_hint");
const auth_signin_tab = document.getElementById("auth_signin_tab");
const auth_signup_tab = document.getElementById("auth_signup_tab");
const signed_in_username = document.getElementById("signed_in_username");
const signout_btn = document.getElementById("signout_btn");
const account_menu_btn = document.getElementById("account_menu_btn");
const account_menu = document.getElementById("account_menu");
const account_settings_box = document.getElementById("account_settings_box");
const username_form = document.getElementById("username_form");
const password_form = document.getElementById("password_form");
const delete_account_form = document.getElementById("delete_account_form");
const account_settings_scroll_area = document.getElementById("account_settings_scroll_area");
const account_settings_scrollbar = document.getElementById("account_settings_scrollbar");
const account_settings_scroll_thumb = document.getElementById("account_settings_scroll_thumb");

function user_storage_key(key, username = current_user) {
	return `todo_user_${encodeURIComponent(String(username).toLowerCase())}_${key}`;
}

function get_user_data(key) {
	return current_user ? localStorage.getItem(user_storage_key(key)) : null;
}

function set_user_data(key, value) {
	if (current_user) localStorage.setItem(user_storage_key(key), value);
}

function migrate_legacy_data(username) {
	const marker = "todo_legacy_data_migrated";
	if (localStorage.getItem(marker)) return;
	for (const key of ["tasks", "groups", "events", "memos", "journal_entries"]) {
		const old_value = localStorage.getItem(key);
		const destination = user_storage_key(key, username);
		if (old_value !== null && localStorage.getItem(destination) === null) localStorage.setItem(destination, old_value);
	}
	localStorage.setItem(marker, "true");
}

const new_btn = document.getElementById('new_btn');
const new_menu = document.getElementById('new_menu');

const nt_btn = document.getElementById('nt_btn');
const nt_window = document.getElementById('nt_box');
const nt_input = document.getElementById('nt_input');
const nt_error = document.getElementById('nt_error');
const nt_create = document.getElementById('ntcreate_btn');
const nt_cancel = document.getElementById('ntcancel_btn');
const show_box = document.getElementById('tasks_box');
const task_scroll_area = document.getElementById('task_scroll_area');
const task_scrollbar = document.getElementById('task_scrollbar');
const task_scroll_thumb = document.getElementById('task_scroll_thumb');
const left_box = document.getElementById('left_box');
const events_sidebar = document.getElementById('events_sidebar');
const favorites_sidebar = document.getElementById('favorites_sidebar');
const favorite_events_list = document.getElementById('favorite_events_list');
const recent_events_list = document.getElementById('recent_events_list');
const events_btn = document.getElementById('events_btn');
const memo_btn = document.getElementById('memo_btn');
const events_box = document.getElementById('events_box');
const event_timeline = document.getElementById('event_timeline');
const view_all_events_btn = document.getElementById('view_all_events_btn');
const upcoming_events_btn = document.getElementById('upcoming_events_btn');
const past_events_btn = document.getElementById('past_events_btn');
const memo_box = document.getElementById('memo_box');
const memo_sidebar_box = document.getElementById('memos_sidebar');
const memo_list = document.getElementById('memo_list');
const memo_new_btn = document.getElementById('memo_new_btn');
const memo_delete_btn = document.getElementById('memo_delete_btn');
const memo_title_input = document.getElementById('memo_title_input');
const memo_content_input = document.getElementById('memo_content_input');
const memo_body_scroll_area = document.getElementById('memo_body_scroll_area');
const memo_scrollbar = document.getElementById('memo_scrollbar');
const memo_scroll_thumb = document.getElementById('memo_scroll_thumb');
const memo_updated_label = document.getElementById('memo_updated_label');
const memo_empty_state = document.getElementById('memo_empty_state');
const memo_editor = document.querySelector('.memo_editor');
const due_input = document.getElementById('due_input');
const due_display = document.getElementById('due_display');
const due_picker_btn = document.getElementById('due_picker_btn');

const calendar_btn = document.getElementById('calendar_btn');
const list_btn = document.getElementById('list_btn');
const calendar_box = document.getElementById('calendar_box');
const calendar_header = document.getElementById('calendar_header');
const main_title = document.getElementById('main_title');
const events_period_switch = document.querySelector('.events_period_switch');
const month_title = document.getElementById('month_title');
const mpre_btn = document.getElementById('mpre_btn');
const mnext_btn = document.getElementById('mnext_btn');
const calendar_grid = document.getElementById('calendar_grid');

const ng_btn = document.getElementById('ng_btn');
const ng_window = document.getElementById('ng_box');
const ng_input = document.getElementById('ng_input');
const ng_error = document.getElementById('ng_error');
const ng_cancel = document.getElementById('ngcancel_btn');
const ng_create = document.getElementById('ngcreate_btn');

const new_event_btn = document.getElementById('new_event_btn');
const event_box = document.getElementById('event_box');
const event_name_input = document.getElementById('event_name_input');
const event_type_input = document.getElementById('event_type_input');
const event_custom_type_input = document.getElementById('event_custom_type_input');
const event_cancel_btn = document.getElementById('event_cancel_btn');
const event_date_input = document.getElementById('event_date_input');
const event_date_display = document.getElementById('event_date_display');
const event_date_picker_btn = document.getElementById('event_date_picker_btn');
const event_start_input = document.getElementById('event_start_input');
const event_end_input = document.getElementById('event_end_input');
const event_notes_input = document.getElementById('event_notes_input');
const event_error = document.getElementById('event_error');
const event_add_btn = document.getElementById('event_add_btn');

const date_picker_box = document.getElementById('date_picker_box');
const date_picker_month = document.getElementById('date_picker_month');
const date_picker_grid = document.getElementById('date_picker_grid');
const date_picker_prev = document.getElementById('date_picker_prev');
const date_picker_next = document.getElementById('date_picker_next');
const date_picker_clear = document.getElementById('date_picker_clear');
const date_picker_cancel = document.getElementById('date_picker_cancel');
const date_picker_today = document.getElementById('date_picker_today');

const group_list = document.getElementById('group_list');
const groups_new_btn = document.getElementById('groups_new_btn');
const tasks_empty_state = document.getElementById('tasks_empty_state');
const empty_add_task_btn = document.getElementById('empty_add_task_btn');
const group_assign_box = document.getElementById('group_assign_box');
const group_assign_checklist = document.getElementById('group_assign_checklist');
const group_assign_cancel = document.getElementById('group_assign_cancel');
const group_assign_save = document.getElementById('group_assign_save');

const al_box = document.getElementById("al_box");
const aldelete_btn = document.getElementById("aldelete_btn");
const alcancel_btn = document.getElementById("alcancel_btn");

const rn_box = document.getElementById("rn_box");
const rn_title = rn_box.querySelector("h2");
const rn_input = document.getElementById("rn_input");
const rn_error = document.getElementById("rn_error");
const rnrename_btn = document.getElementById("rnrename_btn");
const rncancel_btn = document.getElementById("rncancel_btn");

calendar_box.hidden = true;

populate_time_options(event_start_input);
populate_time_options(event_end_input);
initialize_custom_selects();
for (const text_field of document.querySelectorAll('input[type="text"], textarea')) {
	text_field.addEventListener("input", function() {
		text_field.classList.toggle("contains_chinese_text", /[\u3400-\u9fff\uf900-\ufaff]/.test(text_field.value));
	});
}
initialize_task_scrollbar();
const update_memo_scrollbar = initialize_memo_scrollbar();
const update_account_settings_scrollbar = initialize_account_settings_scrollbar();

function initialize_user_workspace() {
	tasks = [];
	groups = [];
	events = [];
	memos = [];
	selected_memo_id = null;
	selected_group_id = null;
	current_view = "list";
	event_period = "upcoming";
	displayed_month = new Date();
	load_groups();
	load_tasks();
	load_events();
	load_memos();
	normalize_task_groups();
	remove_duplicate_all_tasks_group();
	sort_tasks();
	update_month();
	redraw_calendar();
	render_recent_events();
	render_favorite_events();
	render_groups();
	reshow_tasks();
	set_view("list");
	update_memo_scrollbar();
}

function read_local_accounts() {
	try {
		const accounts = JSON.parse(localStorage.getItem("todo_accounts") || "[]");
		return Array.isArray(accounts) ? accounts : [];
	} catch (error) {
		return [];
	}
}

function normalize_username(value) {
	return value.trim().toLowerCase();
}

function validate_username(value) {
	if (!/^[a-zA-Z0-9_-]{3,24}$/.test(value.trim())) return "Use 3–24 letters, numbers, underscores, or hyphens.";
	return "";
}

async function derive_password(password, salt) {
	if (!window.crypto?.subtle) throw new Error("Secure password storage is unavailable in this browser context.");
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256);
	return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, "0")).join("");
}

function set_auth_mode(mode) {
	auth_mode = mode;
	const signup = mode === "signup";
	auth_signin_tab.classList.toggle("active", !signup);
	auth_signup_tab.classList.toggle("active", signup);
	auth_signin_tab.setAttribute("aria-selected", String(!signup));
	auth_signup_tab.setAttribute("aria-selected", String(signup));
	auth_confirm_wrap.hidden = !signup;
	auth_confirm_password.required = signup;
	auth_confirm_password.value = "";
	auth_error.textContent = "";
	auth_username_status.textContent = "";
	auth_username_status.classList.remove("available");
	auth_title.textContent = signup ? "Create your account" : "Welcome back";
	auth_hint.textContent = signup ? "Create an account to start your workspace." : "Sign in to continue to your workspace.";
	auth_submit.textContent = signup ? "Sign Up" : "Sign In";
	auth_password.autocomplete = signup ? "new-password" : "current-password";
}

function check_username_availability() {
	if (auth_mode !== "signup") return false;
	const username = auth_username.value.trim();
	if (!username) { auth_username_status.textContent = ""; return false; }
	const invalid = validate_username(username);
	if (invalid) { auth_username_status.textContent = invalid; auth_username_status.classList.remove("available"); return false; }
	const duplicate = read_local_accounts().some(account => account.usernameKey === normalize_username(username));
	auth_username_status.textContent = duplicate ? "That username is already taken." : "Username is available.";
	auth_username_status.classList.toggle("available", !duplicate);
	return !duplicate;
}

function enter_workspace(account) {
	current_user = account.usernameKey;
	migrate_legacy_data(current_user);
	signed_in_username.textContent = account.username;
	auth_screen.hidden = true;
	app_shell.hidden = false;
	initialize_user_workspace();
}

async function verify_current_password(password) {
	const account = read_local_accounts().find(item => item.usernameKey === current_user);
	if (!account) return false;
	const salt = Uint8Array.from(account.salt.match(/.{2}/g) || [], byte => parseInt(byte, 16));
	return await derive_password(password, salt) === account.passwordHash;
}

function close_account_menu() {
	account_menu.hidden = true;
	account_menu_btn.setAttribute("aria-expanded", "false");
}

function open_account_settings() {
	close_account_menu();
	for (const form of [username_form, password_form, delete_account_form]) form.reset();
	document.querySelectorAll(".account_settings_message").forEach(message => { message.textContent = ""; });
	account_settings_box.style.display = "flex";
	update_account_settings_scrollbar();
	document.getElementById("settings_username").value = signed_in_username.textContent;
	document.getElementById("settings_username").focus();
}

function close_account_settings() {
	account_settings_box.style.display = "none";
}

function sign_out() {
	close_account_settings();
	close_account_menu();
	current_user = null;
	app_shell.hidden = true;
	auth_screen.hidden = false;
	auth_password.value = "";
	auth_confirm_password.value = "";
	auth_username.value = "";
	set_auth_mode("signin");
	auth_username.focus();
}

auth_signin_tab.addEventListener("click", () => set_auth_mode("signin"));
auth_signup_tab.addEventListener("click", () => { set_auth_mode("signup"); check_username_availability(); });
auth_username.addEventListener("input", () => {
	auth_error.textContent = "";
	check_username_availability();
});
auth_form.addEventListener("submit", async event => {
	event.preventDefault();
	auth_error.textContent = "";
	const username = auth_username.value.trim();
	const username_error = validate_username(username);
	if (username_error) { auth_error.textContent = username_error; return; }
	const password = auth_password.value;
	if (auth_mode === "signup") {
		if (password.length < 8) { auth_error.textContent = "Password must be at least 8 characters."; return; }
		if (password !== auth_confirm_password.value) { auth_error.textContent = "Passwords do not match."; return; }
		const accounts = read_local_accounts();
		const usernameKey = normalize_username(username);
		if (accounts.some(account => account.usernameKey === usernameKey)) {
			auth_username_status.textContent = "That username is already taken.";
			auth_username_status.classList.remove("available");
			auth_error.textContent = "Choose a different username.";
			return;
		}
		auth_submit.disabled = true;
		try {
			const salt = window.crypto.getRandomValues(new Uint8Array(16));
			const passwordHash = await derive_password(password, salt);
			const saltHex = Array.from(salt, byte => byte.toString(16).padStart(2, "0")).join("");
			const account = { username, usernameKey, salt: saltHex, passwordHash };
			accounts.push(account);
			localStorage.setItem("todo_accounts", JSON.stringify(accounts));
			enter_workspace(account);
		} catch (error) {
			auth_error.textContent = error.message || "Could not create this account.";
		} finally {
			auth_submit.disabled = false;
		}
		return;
	}
	const account = read_local_accounts().find(item => item.usernameKey === normalize_username(username));
	if (!account) { auth_error.textContent = "Account not found or password is incorrect."; return; }
	auth_submit.disabled = true;
	try {
		const salt = Uint8Array.from(account.salt.match(/.{2}/g) || [], byte => parseInt(byte, 16));
		const passwordHash = await derive_password(password, salt);
		if (passwordHash !== account.passwordHash) { auth_error.textContent = "Account not found or password is incorrect."; return; }
		enter_workspace(account);
	} catch (error) {
		auth_error.textContent = error.message || "Could not sign in.";
	} finally {
		auth_submit.disabled = false;
	}
});

account_menu_btn.addEventListener("click", () => {
	const is_open = !account_menu.hidden;
	account_menu.hidden = is_open;
	account_menu_btn.setAttribute("aria-expanded", String(!is_open));
});
document.getElementById("account_settings_btn").addEventListener("click", open_account_settings);
document.getElementById("account_settings_close").addEventListener("click", close_account_settings);
signout_btn.addEventListener("click", sign_out);
account_settings_box.addEventListener("click", event => {
	if (event.target === account_settings_box) close_account_settings();
});
document.addEventListener("keydown", event => {
	if (event.key === "Escape") {
		close_account_menu();
		if (account_settings_box.style.display === "flex") close_account_settings();
	}
});
document.addEventListener("click", event => {
	if (!event.target.closest(".account_menu_wrap")) close_account_menu();
});

username_form.addEventListener("submit", async event => {
	event.preventDefault();
	const error = document.getElementById("username_error");
	error.textContent = "";
	const username = document.getElementById("settings_username").value.trim();
	const username_error = validate_username(username);
	if (username_error) { error.textContent = username_error; return; }
	const accounts = read_local_accounts();
	const usernameKey = normalize_username(username);
	if (accounts.some(account => account.usernameKey === usernameKey && account.usernameKey !== current_user)) {
		error.textContent = "That username is already taken.";
		return;
	}
	try {
		if (!await verify_current_password(document.getElementById("username_current_password").value)) {
			error.textContent = "Current password is incorrect.";
			return;
		}
		const account = accounts.find(item => item.usernameKey === current_user);
		if (!account) { error.textContent = "Account not found."; return; }
		const old_user = current_user;
		if (old_user !== usernameKey) {
			for (const key of ["tasks", "groups", "events", "memos", "journal_entries"]) {
				const old_key = user_storage_key(key, old_user);
				const value = localStorage.getItem(old_key);
				if (value !== null) {
					localStorage.setItem(user_storage_key(key, usernameKey), value);
					localStorage.removeItem(old_key);
				}
			}
		}
		account.username = username;
		account.usernameKey = usernameKey;
		localStorage.setItem("todo_accounts", JSON.stringify(accounts));
		current_user = usernameKey;
		signed_in_username.textContent = username;
		username_form.reset();
		document.getElementById("settings_username").value = username;
		error.textContent = "Username updated.";
	} catch (exception) {
		error.textContent = exception.message || "Could not update username.";
	}
});

password_form.addEventListener("submit", async event => {
	event.preventDefault();
	const error = document.getElementById("password_error");
	error.textContent = "";
	const new_password = document.getElementById("settings_new_password").value;
	if (new_password.length < 8) { error.textContent = "Password must be at least 8 characters."; return; }
	if (new_password !== document.getElementById("settings_confirm_password").value) {
		error.textContent = "Passwords do not match.";
		return;
	}
	try {
		if (!await verify_current_password(document.getElementById("password_current_password").value)) {
			error.textContent = "Current password is incorrect.";
			return;
		}
		const accounts = read_local_accounts();
		const account = accounts.find(item => item.usernameKey === current_user);
		if (!account) { error.textContent = "Account not found."; return; }
		const salt = crypto.getRandomValues(new Uint8Array(16));
		account.salt = Array.from(salt, byte => byte.toString(16).padStart(2, "0")).join("");
		account.passwordHash = await derive_password(new_password, salt);
		localStorage.setItem("todo_accounts", JSON.stringify(accounts));
		password_form.reset();
		error.textContent = "Password updated.";
	} catch (exception) {
		error.textContent = exception.message || "Could not update password.";
	}
});

delete_account_form.addEventListener("submit", async event => {
	event.preventDefault();
	const error = document.getElementById("delete_account_error");
	error.textContent = "";
	try {
		if (!await verify_current_password(document.getElementById("delete_current_password").value)) {
			error.textContent = "Current password is incorrect.";
			return;
		}
		if (!window.confirm("Delete this account and all of its saved data from this browser? This cannot be undone.")) return;
		const accounts = read_local_accounts().filter(account => account.usernameKey !== current_user);
		localStorage.setItem("todo_accounts", JSON.stringify(accounts));
		for (const key of ["tasks", "groups", "events", "memos", "journal_entries"]) {
			localStorage.removeItem(user_storage_key(key));
		}
		sign_out();
	} catch (exception) {
		error.textContent = exception.message || "Could not delete account.";
	}
});
document.addEventListener("click", function(event) {
    new_menu.style.display = "none";
    const group_menus = document.querySelectorAll(".menu_box");
    for (const gm_menu of group_menus) {
        gm_menu.style.display = "none";
    }
});

document.addEventListener("click", function(event) {
	for (const wrapper of document.querySelectorAll(".custom_select.open")) {
		if (!wrapper.contains(event.target)) close_custom_select(wrapper);
	}
});

calendar_btn.addEventListener("click", function() {
	set_view("calendar");
});

list_btn.addEventListener("click", function() {
	set_view("list");
});

events_btn.addEventListener("click", function() {
	set_view("events");
});

memo_btn.addEventListener("click", function() {
	set_view("memos");
});

view_all_events_btn.addEventListener("click", function() {
	set_view("events");
});

upcoming_events_btn.addEventListener("click", function() {
	set_event_period("upcoming");
});

past_events_btn.addEventListener("click", function() {
	set_event_period("past");
});

function set_view(view) {
	const show_calendar = view === "calendar";
	const show_events = view === "events";
	const show_memos = view === "memos";
	current_view = view;
	if (show_memos) new_menu.style.display = "none";
	calendar_box.hidden = !show_calendar;
	calendar_header.hidden = !show_calendar;
	events_box.hidden = !show_events;
	memo_box.hidden = !show_memos;
	memo_sidebar_box.hidden = !show_memos;
	task_scroll_area.hidden = show_calendar || show_events || show_memos;
	left_box.hidden = show_calendar || show_events || show_memos;
	events_sidebar.hidden = !show_calendar;
	favorites_sidebar.hidden = !show_events;
	events_period_switch.hidden = !show_events;
	nt_btn.hidden = show_memos;
	new_event_btn.hidden = show_memos;
	ng_btn.hidden = show_memos;
	new_btn.hidden = false;
	new_btn.title = show_memos ? "New memo" : "New";
	set_user_text(main_title, show_calendar ? "Calendar" : show_events ? "Events" : show_memos ? "Memos" : get_selected_group_name());
	calendar_btn.classList.toggle("active", show_calendar);
	list_btn.classList.toggle("active", view === "list");
	events_btn.classList.toggle("active", show_events);
	memo_btn.classList.toggle("active", show_memos);
	calendar_btn.setAttribute("aria-pressed", String(show_calendar));
	list_btn.setAttribute("aria-pressed", String(view === "list"));
	events_btn.setAttribute("aria-pressed", String(show_events));
	memo_btn.setAttribute("aria-pressed", String(show_memos));
	if (show_events) render_events_timeline();
	if (show_memos) render_memos();
}

function load_memos() {
	try {
		const saved_memos = get_user_data("memos");
		if (saved_memos !== null) {
			const parsed_memos = JSON.parse(saved_memos);
			memos = Array.isArray(parsed_memos) ? parsed_memos : [];
		} else {
			const old_entries = JSON.parse(get_user_data("journal_entries") || "[]");
			memos = Array.isArray(old_entries) ? old_entries.map(entry => ({
				id: `memo-${entry.date || "undated"}-${entry.id || Date.now()}`,
				title: entry.title || "",
				content: entry.content || "",
				updatedAt: entry.date ? new Date(`${entry.date}T12:00:00`).toISOString() : new Date().toISOString()
			})) : [];
			if (memos.length) save_memos();
		}
	} catch (error) {
		memos = [];
	}
	for (const memo of memos) {
		if (!Array.isArray(memo.checklist)) memo.checklist = [];
		memo.checklist = memo.checklist.filter(item => item && typeof item.text === "string").map((item, index) => ({
			id: item.id || `check-${Date.now()}-${index}`,
			text: item.text,
			completed: Boolean(item.completed)
		}));
		if (!Array.isArray(memo.body)) {
			memo.body = String(memo.content || "").split("\n").map(text => ({ type: "text", text }));
			memo.body.push(...memo.checklist.map(item => ({ type: "text", id: item.id, text: item.text })));
		}
		memo.body = memo.body.filter(line => line && typeof line.text === "string").map(line => ({
			type: "text",
			id: line.id || `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			text: line.text
		}));
		memo.checklist = [];
	}
	memos.sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
	selected_memo_id = memos[0]?.id ?? null;
}

function save_memos() {
	set_user_data("memos", JSON.stringify(memos));
}

function render_memos() {
	memo_list.replaceChildren();
	const sorted_memos = [...memos].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
	for (const memo of sorted_memos) {
		const item = document.createElement("button");
		item.type = "button";
		item.className = "memo_list_item";
		item.classList.toggle("active", String(memo.id) === String(selected_memo_id));
		const title = document.createElement("strong");
		append_user_text(title, memo.title.trim() || "Untitled memo");
		const preview = document.createElement("span");
		append_user_text(preview, (memo.body || []).map(line => line.text).join(" ").trim() || "No content");
		const date = document.createElement("small");
		date.textContent = format_memo_date(memo.updatedAt);
		item.append(title, preview, date);
		item.dataset.memoId = memo.id;
		item.addEventListener("click", function() {
			selected_memo_id = memo.id;
			memo_body_scroll_area.scrollTop = 0;
			render_memos();
		});
		memo_list.appendChild(item);
	}
	const selected_memo = memos.find(memo => String(memo.id) === String(selected_memo_id));
	const has_memo = Boolean(selected_memo);
	memo_editor.classList.toggle("is_empty", !has_memo);
	memo_title_input.disabled = !has_memo;
	memo_content_input.contentEditable = String(has_memo);
	memo_content_input.setAttribute("aria-disabled", String(!has_memo));
	memo_delete_btn.hidden = !has_memo;
	memo_empty_state.hidden = has_memo;
	memo_title_input.value = selected_memo?.title || "";
	render_memo_body(selected_memo);
	memo_updated_label.textContent = has_memo ? `Edited ${format_memo_date(selected_memo.updatedAt)}` : "";
	update_memo_scrollbar();
}

function render_memo_body(memo) {
	memo_content_input.replaceChildren();
	if (!memo) return;
	for (const line of memo.body) {
		const row = document.createElement("div");
		row.className = "memo_body_line";
		row.dataset.type = "text";
		row.dataset.lineId = line.id;
		const text = document.createElement("div");
		text.className = "memo_body_line_text";
		text.contentEditable = "true";
		text.setAttribute("role", "presentation");
		text.textContent = line.text;
		row.appendChild(text);
		memo_content_input.appendChild(row);
	}
	if (!memo.body.length) add_memo_text_line(memo, "");
}

function serialize_memo_body() {
	const rows = Array.from(memo_content_input.children).filter(row => row.classList.contains("memo_body_line"));
	return rows.map(row => ({
		type: "text",
		id: row.dataset.lineId || `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		text: row.querySelector(".memo_body_line_text")?.innerText.replace(/\n$/, "") || "",
	}));
}

function save_memo_body(memo) {
	memo.body = serialize_memo_body();
	memo.checklist = [];
	memo.content = memo.body.filter(line => line.type === "text").map(line => line.text).join("\n");
	memo.updatedAt = new Date().toISOString();
	save_memos();
	memo_updated_label.textContent = `Edited ${format_memo_date(memo.updatedAt)}`;
}

function add_memo_text_line(memo, text) {
	const line = { type: "text", id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text };
	memo.body.push(line);
	const row = document.createElement("div");
	row.className = "memo_body_line";
	row.dataset.type = "text";
	row.dataset.lineId = line.id;
	const text_node = document.createElement("div");
	text_node.className = "memo_body_line_text";
	text_node.contentEditable = "true";
	text_node.textContent = text;
	row.appendChild(text_node);
	memo_content_input.appendChild(row);
}

function update_memo_sidebar_item(memo) {
	const item = memo_list.querySelector(`[data-memo-id="${CSS.escape(String(memo.id))}"]`);
	if (!item) return;
	item.querySelector("strong").textContent = memo.title.trim() || "Untitled memo";
	item.querySelector("span").textContent = memo.body.map(line => line.text).join(" ").trim() || "No content";
	item.querySelector("small").textContent = format_memo_date(memo.updatedAt);
}

memo_content_input.addEventListener("keydown", event => {
	if (event.key !== "Enter" || event.shiftKey) return;
	const active_line = event.target.closest(".memo_body_line");
	if (!active_line) return;
	event.preventDefault();
	const memo = memos.find(item => String(item.id) === String(selected_memo_id));
	if (!memo) return;
	const selection = window.getSelection();
	const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
	const text_node = active_line.querySelector(".memo_body_line_text");
	let remainder = "";
	if (range && text_node.contains(range.startContainer)) {
		const tail_range = document.createRange();
		tail_range.selectNodeContents(text_node);
		tail_range.setStart(range.startContainer, range.startOffset);
		remainder = tail_range.extractContents().textContent || "";
	}
	const new_line = { type: "text", id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text: remainder };
	const index = Array.from(memo_content_input.children).indexOf(active_line);
	memo.body.splice(index + 1, 0, new_line);
	const row = document.createElement("div"); row.className = "memo_body_line"; row.dataset.type = "text"; row.dataset.lineId = new_line.id;
	const text = document.createElement("div"); text.className = "memo_body_line_text"; text.contentEditable = "true"; text.textContent = remainder; row.appendChild(text);
	active_line.after(row); text.focus();
	save_memo_body(memo);
	update_memo_sidebar_item(memo);
});

memo_content_input.addEventListener("input", () => {
	const memo = memos.find(item => String(item.id) === String(selected_memo_id));
	if (!memo) return;
	memo.body = serialize_memo_body();
	save_memo_body(memo);
	update_memo_sidebar_item(memo);
	update_memo_scrollbar();
});

function format_memo_date(value) {
	const date = new Date(value || Date.now());
	return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function create_memo() {
	const now = new Date().toISOString();
	const memo = { id: `memo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: "", content: "", checklist: [], updatedAt: now };
	memos.unshift(memo);
	selected_memo_id = memo.id;
	save_memos();
	render_memos();
	memo_updated_label.textContent = `Edited ${format_memo_date(now)}`;
	memo_body_scroll_area.scrollTop = 0;
	update_memo_scrollbar();
	memo_title_input.focus();
}

memo_new_btn.addEventListener("click", create_memo);

function update_selected_memo() {
	const memo = memos.find(item => String(item.id) === String(selected_memo_id));
	if (!memo) return;
	memo.title = memo_title_input.value;
	memo.updatedAt = new Date().toISOString();
	save_memos();
	memo_updated_label.textContent = `Edited ${format_memo_date(memo.updatedAt)}`;
	update_memo_sidebar_item(memo);
}

memo_title_input.addEventListener("input", update_selected_memo);

memo_delete_btn.addEventListener("click", function() {
	if (!selected_memo_id) return;
	if (!window.confirm("Delete this memo?")) return;
	memos = memos.filter(memo => String(memo.id) !== String(selected_memo_id));
	selected_memo_id = memos[0]?.id ?? null;
	save_memos();
	render_memos();
	});

function set_event_period(period) {
	event_period = period;
	const showing_upcoming = period === "upcoming";
	upcoming_events_btn.classList.toggle("active", showing_upcoming);
	past_events_btn.classList.toggle("active", !showing_upcoming);
	upcoming_events_btn.setAttribute("aria-selected", String(showing_upcoming));
	past_events_btn.setAttribute("aria-selected", String(!showing_upcoming));
	render_events_timeline();
}

new_btn.addEventListener("click", function(event) {
	event.stopPropagation();
	if (current_view === "memos") {
		create_memo();
		return;
	}
	for (const gm_menu of document.querySelectorAll(".menu_box")) {
        gm_menu.style.display = "none";
    }
	new_menu.style.display = "block";
});

//new task
nt_create.addEventListener("click", add_newtask);
nt_input.addEventListener("keydown", function(event) {
	if (event.key === "Enter") {
		add_newtask();
	}
});


function open_new_task_dialog() {
	nt_input.value = "";
	nt_error.textContent = " ";
	nt_window.style.display = "flex";
	new_menu.style.display = "none";
}

nt_btn.addEventListener("click", open_new_task_dialog);
empty_add_task_btn.addEventListener("click", open_new_task_dialog);
nt_cancel.addEventListener("click", function() {
	nt_window.style.display = "none";
});

//new group
ng_create.addEventListener("click", add_newgroup);
ng_input.addEventListener("keydown", function(event) {
	if (event.key === "Enter") {
		add_newgroup();
	}
});

function open_new_group_dialog() {
	ng_input.value = "";
	ng_error.textContent = " ";
	ng_window.style.display = "flex";
	new_menu.style.display = "none";
}

ng_btn.addEventListener("click", open_new_group_dialog);
groups_new_btn.addEventListener("click", open_new_group_dialog);
ng_cancel.addEventListener("click", function() {
	ng_window.style.display = "none";
});

group_assign_cancel.addEventListener("click", function() {
	group_assign_box.style.display = "none";
	group_assign_task = null;
});

group_assign_save.addEventListener("click", function() {
	if (group_assign_task === null) return;
	group_assign_task.groups = Array.from(group_assign_checklist.querySelectorAll("input:checked"))
		.map(checkbox => Number(checkbox.value));
	save_tasks();
	group_assign_box.style.display = "none";
	group_assign_task = null;
	reshow_tasks();
});

new_event_btn.addEventListener("click", function() {
	reset_event_form();
	event_box.style.display = "flex";
	new_menu.style.display = "none";
	event_name_input.focus();
});

event_add_btn.addEventListener("click", add_new_event);
event_type_input.addEventListener("change", function() {
	event_custom_type_input.hidden = event_type_input.value !== "__custom__";
	if (!event_custom_type_input.hidden) event_custom_type_input.focus();
});

event_cancel_btn.addEventListener("click", function() {
	event_box.style.display = "none";
});

due_display.addEventListener("click", function() {
	open_date_picker(due_input, due_display);
});

due_picker_btn.addEventListener("click", function() {
	open_date_picker(due_input, due_display);
});

event_date_display.addEventListener("click", function() {
	open_date_picker(event_date_input, event_date_display);
});

event_date_picker_btn.addEventListener("click", function() {
	open_date_picker(event_date_input, event_date_display);
});

date_picker_prev.addEventListener("click", function() {
	picker_month = new Date(picker_month.getFullYear(), picker_month.getMonth() - 1, 1);
	redraw_date_picker();
});

date_picker_next.addEventListener("click", function() {
	picker_month = new Date(picker_month.getFullYear(), picker_month.getMonth() + 1, 1);
	redraw_date_picker();
});

date_picker_cancel.addEventListener("click", close_date_picker);

date_picker_clear.addEventListener("click", function() {
	if (active_date_value) active_date_value.value = "";
	if (active_date_display) set_date_display_text(active_date_display, "");
	if (active_date_task) {
		active_date_task.due = "";
		save_tasks();
		reshow_tasks();
	}
	close_date_picker();
});

date_picker_today.addEventListener("click", function() {
	select_picker_date(new Date());
});

date_picker_box.addEventListener("click", function(event) {
	if (event.target === date_picker_box) close_date_picker();
});

document.addEventListener("keydown", function(event) {
	if (event.key === "Escape" && date_picker_box.style.display === "flex") {
		close_date_picker();
	}
});

//delete confirm
alcancel_btn.addEventListener("click", function() {
    al_box.style.display = "none";
    delete_target = null;
	delete_target_type = "group";
	al_box.querySelector("h2").textContent = "Delete?";
});
aldelete_btn.addEventListener("click", function() {
	if (delete_target !== null && delete_target_type === "event") {
		const deleted_event_id = delete_target.id == null ? null : String(delete_target.id);
		events = events.filter(event => event !== delete_target && (
			deleted_event_id === null || event.id == null || String(event.id) !== deleted_event_id
		));
		save_events();
		redraw_calendar();
		render_recent_events();
		render_favorite_events();
		render_events_timeline();
		al_box.style.display = "none";
		delete_target = null;
		delete_target_type = "group";
		al_box.querySelector("h2").textContent = "Delete?";
		return;
	}
	if (delete_target !== null) {
		const removed_group_id = delete_target.id;
        groups.splice(groups.indexOf(delete_target), 1);
        save_groups();
		for (const task of tasks) {
			task.groups = task.groups.filter(group_id => group_id !== removed_group_id);
		}
		save_tasks();
		if (selected_group_id === removed_group_id) selected_group_id = null;
        al_box.style.display = "none";
        delete_target = null;
		delete_target_type = "group";
		al_box.querySelector("h2").textContent = "Delete?";
		render_groups();
		reshow_tasks();
		if (current_view === "list") set_user_text(main_title, get_selected_group_name());
    }
});

//Rename Group
rncancel_btn.addEventListener("click", function() {
    rn_box.style.display = "none";
    rename_target = null;
    rn_error.textContent = " ";
});
rnrename_btn.addEventListener("click", function() {
	if (rename_target === null) {
        return;
    }

	const new_name = rn_input.value.trim();
	if (new_name === "") {
		rn_error.textContent = "Please enter a name.";
        return;
    }

	if (rename_target_type === "group") {
		if ((g_default.includes(new_name) || groups.some(group => group.name === new_name)) && rename_target.name !== new_name) {
			rn_error.textContent = "Group name already exists.";
			return;
		}
		rename_target.name = new_name;
		save_groups();
		render_groups();
		if (current_view === "list") set_user_text(main_title, get_selected_group_name());
	} else {
		rename_target.text = new_name;
		save_tasks();
		reshow_tasks();
	}

    rn_box.style.display = "none";
    rename_target = null;
	rn_error.textContent = " ";
});

//calendar
mpre_btn.addEventListener("click", function() {
	displayed_month = new Date(
		displayed_month.getFullYear(),
		displayed_month.getMonth() - 1,
		1
	);
	update_month();
	redraw_calendar();
});
mnext_btn.addEventListener("click", function() {
	displayed_month = new Date(
		displayed_month.getFullYear(),
		displayed_month.getMonth() + 1,
		1
	);
	update_month();
	redraw_calendar();
});

function redraw_calendar() {
	calendar_grid.innerHTML = "";

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const year = displayed_month.getFullYear();
	const month = displayed_month.getMonth();
	const today_key = date_to_key(new Date());

	for (const day_name of weekdays) {
		const day_heading = document.createElement("div");
		day_heading.classList.add("calendar_weekday");
		day_heading.textContent = day_name;
		calendar_grid.appendChild(day_heading);
	}

	const first_weekday = new Date(year, month, 1).getDay();
	const days_in_month = new Date(year, month + 1, 0).getDate();
	const week_count = Math.ceil((first_weekday + days_in_month) / 7);
	calendar_grid.style.gridTemplateRows = `40px repeat(${week_count}, minmax(0, 1fr))`;

	const date_cells_used = first_weekday + days_in_month;
	const next_month_days = (7 - (date_cells_used % 7)) % 7;
	for (let offset = -first_weekday; offset < days_in_month + next_month_days; offset++) {
		const date = new Date(year, month, offset + 1);
		const day_cell = document.createElement("div");
		day_cell.classList.add("calendar_day");
		if (date.getMonth() !== month) day_cell.classList.add("outside_month");
		const day_number = document.createElement("span");
		day_number.className = "calendar_day_number";
		day_number.textContent = date.getDate();
		const items = document.createElement("div");
		items.className = "calendar_day_items";
		day_cell.append(day_number, items);
		if (date_to_key(date) === today_key) day_cell.classList.add("today");
		add_calendar_tasks(day_cell, date);
		add_calendar_events(day_cell, date);
		calendar_grid.appendChild(day_cell);
	}
}

function add_calendar_tasks(day_cell, date) {
	const date_key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	const day_tasks = tasks.filter(task => task.due === date_key);

	for (const task of day_tasks) {
		const task_chip = document.createElement("button");
		task_chip.type = "button";
		task_chip.classList.add("calendar_task");
		if (task.complete) task_chip.classList.add("calendar_task_done");
		append_user_text(task_chip, task.text);
		task_chip.title = task.complete ? "Mark as to do" : "Mark as done";
		task_chip.addEventListener("click", function() {
			task.complete = !task.complete;
			save_tasks();
			reshow_tasks();
		});
		day_cell.querySelector(".calendar_day_items").appendChild(task_chip);
	}
}

function add_calendar_events(day_cell, date) {
	const date_key = date_to_key(date);
	const day_events = events
		.filter(event => event.date === date_key)
		.sort((a, b) => (a.start || "").localeCompare(b.start || ""));

	for (const event of day_events) {
		const event_item = document.createElement("div");
		event_item.classList.add("calendar_event");
		const time_label = event.start
			? `${event.start}${event.end ? `–${event.end}` : ""} · `
			: "";
		const event_type = event.type || "Activity";
		event_item.append(document.createTextNode(time_label));
		append_user_text(event_item, event.text);
		event_item.classList.add(event_type_class(event_type));
		event_item.title = event.notes ? `${event.text}\n${event.notes}` : event.text;
		day_cell.querySelector(".calendar_day_items").appendChild(event_item);
	}
}

function render_recent_events() {
	recent_events_list.innerHTML = "";
	const recent_events = events
		.filter(event => event_is_upcoming(event))
		.sort((a, b) => a.date.localeCompare(b.date) || (a.start || "").localeCompare(b.start || ""));

	if (recent_events.length === 0) {
		const empty_message = document.createElement("p");
		empty_message.classList.add("recent_events_empty");
		empty_message.textContent = "No upcoming events";
		recent_events_list.appendChild(empty_message);
		return;
	}

	for (const event of recent_events) {
		const item = document.createElement("div");
		item.classList.add("recent_event_item", event_type_class(event.type || "Activity"));
		const event_date = new Date(`${event.date}T00:00:00`);
		const date_label = document.createElement("span");
		date_label.classList.add("recent_event_date");
		date_label.textContent = event_date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
		const type_label = document.createElement("span");
		type_label.className = `recent_event_type ${event_type_class(event.type || "Activity")}`;
		append_user_text(type_label, event.type || "Activity");
		const event_title = document.createElement("span");
		event_title.className = "recent_event_title";
		const time_label = event.start ? `${event.start}${event.end ? `–${event.end}` : ""} · ` : "";
		event_title.append(document.createTextNode(time_label));
		append_user_text(event_title, event.text);
		item.append(date_label, type_label, event_title);
		if (event.notes) item.title = event.notes;
		recent_events_list.appendChild(item);
	}
}

function render_favorite_events() {
	favorite_events_list.innerHTML = "";
	const favorite_events = events
		.filter(event => event.favorite)
		.sort((a, b) => a.date.localeCompare(b.date) || (a.start || "").localeCompare(b.start || ""));

	if (favorite_events.length === 0) {
		const empty_message = document.createElement("p");
		empty_message.className = "recent_events_empty";
		empty_message.textContent = "No favorite events";
		favorite_events_list.appendChild(empty_message);
		return;
	}

	for (const event of favorite_events) {
		const item = document.createElement("div");
		item.className = `recent_event_item favorite_event_item ${event_type_class(event.type || "Activity")}`;
		const date_label = document.createElement("span");
		date_label.className = "recent_event_date";
		date_label.textContent = new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
		const type_label = document.createElement("span");
		type_label.className = `recent_event_type ${event_type_class(event.type || "Activity")}`;
		append_user_text(type_label, event.type || "Activity");
		const title = document.createElement("span");
		title.className = "recent_event_title";
		append_user_text(title, event.text);
		item.append(date_label, type_label, title);
		favorite_events_list.appendChild(item);
	}
}

function render_events_timeline() {
	for (const old_menu of document.querySelectorAll(".event_actions_menu")) old_menu.remove();
	event_timeline.innerHTML = "";
	const filtered_events = events.filter(event => event_period === "upcoming"
		? event_is_upcoming(event)
		: !event_is_upcoming(event));
	filtered_events.sort((a, b) => {
		const date_order = a.date.localeCompare(b.date);
		const time_order = (a.start || "").localeCompare(b.start || "");
		return event_period === "upcoming" ? date_order || time_order : -(date_order || time_order);
	});

	if (filtered_events.length === 0) {
		event_timeline.classList.add("is_empty");
		const empty = document.createElement("p");
		empty.className = "events_timeline_empty";
		empty.textContent = event_period === "upcoming" ? "No upcoming events" : "No past events";
		event_timeline.appendChild(empty);
		return;
	}
	event_timeline.classList.remove("is_empty");

	for (const event of filtered_events) {
		const entry = document.createElement("div");
		entry.className = "event_timeline_entry";
		const date = new Date(`${event.date}T00:00:00`);
		const date_label = document.createElement("div");
		date_label.className = "event_timeline_date";
		const date_weekday = document.createElement("span");
		date_weekday.className = "event_timeline_date_weekday";
		date_weekday.textContent = `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()},`;
		const date_year = document.createElement("span");
		date_year.className = "event_timeline_date_year";
		date_year.textContent = String(date.getFullYear());
		date_label.append(date_weekday, date_year);
		const dot = document.createElement("span");
		dot.className = "event_timeline_dot";
		const card = document.createElement("div");
		card.className = "event_timeline_card";
		const card_header = document.createElement("div");
		card_header.className = "event_timeline_card_header";
		const title = document.createElement("strong");
		append_user_text(title, event.text);
		const menu_wrap = document.createElement("div");
		menu_wrap.className = "menu_wrap event_actions_wrap";
		const menu_button = document.createElement("button");
		menu_button.type = "button";
		menu_button.className = "tm_btn";
		menu_button.textContent = "⋮";
		menu_button.setAttribute("aria-label", "Event actions");
		const favorite_button = document.createElement("button");
		favorite_button.type = "button";
		favorite_button.className = `event_favorite_btn${event.favorite ? " is_favorite" : ""}`;
		favorite_button.setAttribute("aria-label", event.favorite ? "Remove from favorites" : "Add to favorites");
		favorite_button.setAttribute("aria-pressed", String(Boolean(event.favorite)));
		const favorite_icon = document.createElement("img");
		favorite_icon.src = event.favorite ? "Images/star-filled.svg" : "Images/star-outline.svg";
		favorite_icon.alt = "";
		favorite_button.appendChild(favorite_icon);
		favorite_button.addEventListener("click", function(click_event) {
			click_event.stopPropagation();
			event.favorite = !event.favorite;
			save_events();
			render_events_timeline();
			render_favorite_events();
		});
		const menu = document.createElement("div");
		menu.className = "menu_box event_actions_menu";
		const edit_choice = document.createElement("div");
		edit_choice.className = "menu_choice";
		edit_choice.textContent = "Edit";
		const delete_choice = document.createElement("div");
		delete_choice.className = "menu_choice";
		delete_choice.textContent = "Delete";
		menu.append(edit_choice, delete_choice);
		menu_wrap.append(menu_button, favorite_button);
		document.body.appendChild(menu);
		card_header.append(title, menu_wrap);
		card.appendChild(card_header);
		if (event.notes) {
			const notes = document.createElement("p");
			notes.className = "event_timeline_notes";
			append_user_text(notes, event.notes);
			card.appendChild(notes);
		}

		const details = document.createElement("div");
		details.className = "event_timeline_details";
		const time = event.start ? `${event.start}${event.end ? `–${event.end}` : ""}` : "All day";
		const type = event.type || "Activity";
		const time_label = document.createElement("span");
		time_label.className = "event_timeline_time";
		time_label.textContent = time;
		const type_label = document.createElement("span");
		type_label.className = "event_timeline_type";
		type_label.classList.add(event_type_class(type));
		append_user_text(type_label, type);
		details.append(time_label, type_label);
		card.appendChild(details);
		entry.append(date_label, dot, card);
		event_timeline.appendChild(entry);

		menu_button.addEventListener("click", function(click_event) {
			click_event.stopPropagation();
			for (const other_menu of document.querySelectorAll(".menu_box")) {
				if (other_menu !== menu) other_menu.style.display = "none";
			}
			if (menu.style.display === "block") {
				menu.style.display = "none";
				return;
			}
			menu.style.display = "block";
			const trigger_rect = menu_button.getBoundingClientRect();
			const menu_rect = menu.getBoundingClientRect();
			const gap = 6;
			const top = trigger_rect.bottom + menu_rect.height + gap <= window.innerHeight - 8
				? trigger_rect.bottom + gap
				: Math.max(8, trigger_rect.top - menu_rect.height - gap);
			const left = Math.max(8, Math.min(window.innerWidth - menu_rect.width - 8, trigger_rect.right - menu_rect.width));
			menu.style.top = `${top}px`;
			menu.style.left = `${left}px`;
			menu.style.right = "auto";
		});
		edit_choice.addEventListener("click", function(click_event) {
			click_event.stopPropagation();
			menu.style.display = "none";
			open_event_editor(event);
		});
		delete_choice.addEventListener("click", function(click_event) {
			click_event.stopPropagation();
			delete_target = event;
			delete_target_type = "event";
			al_box.querySelector("h2").textContent = "Delete event?";
			al_box.style.display = "flex";
			menu.style.display = "none";
		});
	}
}

function open_date_picker(value_input, display_input) {
	active_date_value = value_input;
	active_date_display = display_input;
	const selected_value = value_input.value;
	const starting_date = selected_value ? new Date(`${selected_value}T00:00:00`) : new Date();
	picker_month = new Date(starting_date.getFullYear(), starting_date.getMonth(), 1);
	redraw_date_picker();
	date_picker_box.style.display = "flex";
}

function close_date_picker() {
	date_picker_box.style.display = "none";
	if (active_date_task) {
		due_input.value = "";
		due_display.value = "";
	}
	active_date_value = null;
	active_date_display = null;
	active_date_task = null;
}

function select_picker_date(date) {
	if (active_date_value && active_date_display) {
		active_date_value.value = date_to_key(date);
		set_date_display_text(active_date_display, date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}));
		if (active_date_task) {
			active_date_task.due = active_date_value.value;
			save_tasks();
			reshow_tasks();
		}
	}
	close_date_picker();
}

function set_date_display_text(display, text) {
	if (display instanceof HTMLInputElement) display.value = text;
	else display.textContent = text;
}

function date_to_key(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function event_is_upcoming(event, now = new Date()) {
	const today_key = date_to_key(now);
	if (event.date > today_key) return true;
	if (event.date < today_key) return false;
	const last_event_time = event.end || event.start;
	if (!last_event_time) return true;
	const [hours, minutes] = last_event_time.split(":").map(Number);
	const event_datetime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
	return event_datetime >= now;
}

function set_user_text(element, value) {
	element.replaceChildren();
	append_user_text(element, value);
}

function append_user_text(element, value) {
	const text = String(value ?? "");
	const segments = text.match(/\p{Script=Han}+|[^\p{Script=Han}]+/gu) || [];
	for (const segment of segments) {
		if (/^\p{Script=Han}+$/u.test(segment)) {
			const chinese_text = document.createElement("span");
			chinese_text.className = "user_chinese_text";
			chinese_text.textContent = segment;
			element.appendChild(chinese_text);
		} else {
			element.appendChild(document.createTextNode(segment));
		}
	}
}

function redraw_date_picker() {
	const year = picker_month.getFullYear();
	const month = picker_month.getMonth();
	const first_weekday = new Date(year, month, 1).getDay();
	const days_in_month = new Date(year, month + 1, 0).getDate();
	const total_cells = Math.ceil((first_weekday + days_in_month) / 7) * 7;
	const selected_key = active_date_value ? active_date_value.value : "";

	date_picker_month.textContent = picker_month.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	});
	date_picker_grid.innerHTML = "";

	for (const weekday of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
		const heading = document.createElement("div");
		heading.classList.add("picker_weekday");
		heading.textContent = weekday;
		date_picker_grid.appendChild(heading);
	}

	for (let cell_index = 0; cell_index < total_cells; cell_index++) {
		const date = new Date(year, month, cell_index - first_weekday + 1);
		const day_button = document.createElement("button");
		day_button.type = "button";
		day_button.classList.add("picker_day");
		day_button.textContent = date.getDate();
		if (date.getMonth() !== month) day_button.classList.add("outside_month");
		if (date_to_key(date) === selected_key) day_button.classList.add("selected");
		day_button.addEventListener("click", function() {
			select_picker_date(date);
		});
		date_picker_grid.appendChild(day_button);
	}
}

function populate_time_options(select) {
	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.textContent = "Choose a time";
	select.appendChild(placeholder);

	for (let minutes = 0; minutes < 24 * 60; minutes += 30) {
		const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
		const minute = String(minutes % 60).padStart(2, "0");
		const value = `${hours}:${minute}`;
		const option = document.createElement("option");
		option.value = value;
		option.textContent = value;
		select.appendChild(option);
	}
}

function update_month() {
	month_title.textContent = displayed_month.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	});
}

function add_newgroup() {
	const group_name = ng_input.value.trim();
	if (group_name === "") {
		ng_error.textContent = "Please enter a group name.";
		return;
	}
	if (g_default.includes(group_name) || groups.some(group => group.name === group_name)) {
		ng_error.textContent = "Group name already exists.";
		return;
	}

	const group = {
		id: Date.now(),
		name: group_name
	}

	groups.push(group);
	save_groups();
	render_groups();
	
	ng_window.style.display = "none";
}

function show_group(group) {
	const group_box = document.createElement("div");

	group_box.classList.add("group_title");	
	if (group.id === selected_group_id) group_box.classList.add("selected_group");

	append_user_text(group_box, group.name);

	group_list.appendChild(group_box);
	group_box.addEventListener("click", function() {
		selected_group_id = group.id;
		set_user_text(main_title, group.name);
		render_groups();
		reshow_tasks();
	});

	if (g_default.includes(group.name) != true) {
		const gm_wrap = document.createElement("div");
		const gm_menu = document.createElement("div");
		const grename_btn = document.createElement("div");
		const gdelete_btn = document.createElement("div");
		const gm_btn = document.createElement("button");

		gm_wrap.classList.add("menu_wrap");
		gm_menu.classList.add("menu_box");
		grename_btn.classList.add("menu_choice");
		gdelete_btn.classList.add("menu_choice");
		gm_btn.classList.add("gm_btn");
		
		gm_btn.textContent = "⋮";
		grename_btn.textContent = "Rename";
		gdelete_btn.textContent = "Delete";

		gm_menu.appendChild(grename_btn);
		gm_menu.appendChild(gdelete_btn);
		gm_wrap.appendChild(gm_btn);
		gm_wrap.appendChild(gm_menu);
		group_box.appendChild(gm_wrap);

		gm_btn.addEventListener("click", function(event) {
			event.stopPropagation();
			gm_menu.style.display = "block";
			new_menu.style.display = "none";
		});

		gdelete_btn.addEventListener("click", function(event) {
			event.stopPropagation();
	    	delete_target = group;
		delete_target_type = "group";
		al_box.querySelector("h2").textContent = "Delete?";
	    	al_box.style.display = "flex";
			gm_menu.style.display = "none";
		});

		grename_btn.addEventListener("click", function(event) {
			event.stopPropagation();
	    	rename_target = group;
			rename_target_type = "group";
			rn_title.textContent = "Rename Group";
			rn_input.placeholder = "Group Name";
			rn_input.value = group.name;
			rn_input.classList.toggle("contains_chinese_text", /[\u3400-\u9fff\uf900-\ufaff]/.test(rn_input.value));
			rn_error.textContent = " ";
	    	rn_box.style.display = "flex";
			gm_menu.style.display = "none";
		});
	}
}

function render_groups() {
	group_list.innerHTML = "";
	show_group({ id: null, name: "All Tasks" });
	for (const group of groups) show_group(group);
}

function remove_duplicate_all_tasks_group() {
	const duplicate_groups = groups.filter(group => g_default.includes(group.name.trim()));
	if (duplicate_groups.length === 0) return;
	const duplicate_ids = duplicate_groups.map(group => group.id);
	groups = groups.filter(group => !g_default.includes(group.name.trim()));
	for (const task of tasks) {
		task.groups = task.groups.filter(group_id => !duplicate_ids.includes(group_id));
	}
	save_groups();
	save_tasks();
}

function normalize_task_groups() {
	let changed = false;
	for (const task of tasks) {
		if (!Array.isArray(task.groups)) {
			task.groups = task.group === null || task.group === undefined ? [] : [task.group];
			changed = true;
		}
		if (Object.prototype.hasOwnProperty.call(task, "group")) {
			delete task.group;
			changed = true;
		}
	}
	if (changed) save_tasks();
}

function get_selected_group_name() {
	if (selected_group_id === null) return "All Tasks";
	const selected_group = groups.find(group => group.id === selected_group_id);
	return selected_group ? selected_group.name : "All Tasks";
}

function add_newtask() {
	if (nt_input.value === "") {
		nt_error.textContent = "Please enter a task name.";
		return;
	}
	const task = {
		id: Date.now(),
		text: nt_input.value,
		due: due_input.value,
		complete: false,
		groups: selected_group_id === null ? [] : [selected_group_id]
	}
	tasks.push(task);
	save_tasks();
	reshow_tasks();
	nt_input.value = "";

	nt_window.style.display = "none";
}

function add_new_event() {
	const name = event_name_input.value.trim();
	const date = event_date_input.value;
	const start = event_start_input.value;
	const end = event_end_input.value;
	const type = event_type_input.value === "__custom__"
		? event_custom_type_input.value.trim()
		: event_type_input.value;

	if (!name) {
		event_error.textContent = "Please enter an event name.";
		event_name_input.focus();
		return;
	}
	if (!date) {
		event_error.textContent = "Please choose a date.";
		event_date_picker_btn.focus();
		return;
	}
	if (!type) {
		event_error.textContent = "Please enter a custom event type.";
		event_custom_type_input.focus();
		return;
	}
	if (start && end && end <= start) {
		event_error.textContent = "End time must be later than start time.";
		return;
	}

	const event_data = {
		text: name,
		type: type,
		date: date,
		start: start,
		end: end,
		notes: event_notes_input.value.trim()
	};
	const was_editing = editing_event !== null;
	if (was_editing) Object.assign(editing_event, event_data);
	else events.push({ id: Date.now(), ...event_data });
	save_events();
	redraw_calendar();
	render_recent_events();
	render_favorite_events();
	render_events_timeline();
	event_box.style.display = "none";
	reset_event_form();
	if (!was_editing && current_view !== "events") set_view("calendar");
}

function open_event_editor(event) {
	editing_event = event;
	event_name_input.value = event.text;
	event_date_input.value = event.date;
	event_date_display.value = new Date(`${event.date}T00:00:00`).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	const type = event.type || "Activity";
	const standard_types = ["Activity", "Holiday", "Day off"];
	const is_custom_type = !standard_types.includes(type);
	event_type_input.value = is_custom_type ? "__custom__" : type;
	refresh_custom_select(event_type_input);
	event_custom_type_input.value = is_custom_type ? type : "";
	event_custom_type_input.hidden = !is_custom_type;
	event_start_input.value = event.start || "";
	event_end_input.value = event.end || "";
	refresh_custom_select(event_start_input);
	refresh_custom_select(event_end_input);
	event_notes_input.value = event.notes || "";
	event_error.textContent = " ";
	document.getElementById("event_title").textContent = "Edit Event";
	event_add_btn.textContent = "Save Event";
	event_box.style.display = "flex";
	event_name_input.focus();
}

function reset_event_form() {
	editing_event = null;
	event_name_input.value = "";
	event_type_input.value = "Activity";
	refresh_custom_select(event_type_input);
	event_custom_type_input.value = "";
	event_custom_type_input.hidden = true;
	const today = new Date();
	event_date_input.value = date_to_key(today);
	event_date_display.value = today.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	event_start_input.value = "";
	event_end_input.value = "";
	refresh_custom_select(event_start_input);
	refresh_custom_select(event_end_input);
	event_notes_input.value = "";
	event_error.textContent = " ";
	document.getElementById("event_title").textContent = "New Event";
	event_add_btn.textContent = "Add Event";
}

function show_task(task) {
	const task_box = document.createElement("div");
	const todo_btn = document.createElement("button");
	const task_item = document.createElement("div");
	const due_item = document.createElement("div");

	const tm_wrap = document.createElement("div");
	const tm_menu = document.createElement("div");
	const trename_btn = document.createElement("div");
	const tchangedue_btn = document.createElement("div");
	const taddgroup_btn = document.createElement("div");
	const tdelete_btn = document.createElement("div");
	const tm_btn = document.createElement("button");

	task_box.classList.add("task_box");
	todo_btn.classList.add("todo_btn");
	task_item.classList.add("task_item");
	due_item.classList.add("due_item");
	tm_wrap.classList.add("menu_wrap");
	tm_menu.classList.add("menu_box");
	trename_btn.classList.add("menu_choice");
	tchangedue_btn.classList.add("menu_choice");
	taddgroup_btn.classList.add("menu_choice");
	tdelete_btn.classList.add("menu_choice");
	tm_btn.classList.add("tm_btn");

	todo_btn.classList.remove("todo", "done");

	append_user_text(task_item, task.text);
	tm_btn.textContent = "⋮";
	trename_btn.textContent = "Rename";
	tchangedue_btn.textContent = "Change due date";
	taddgroup_btn.textContent = "Add to group";
	tdelete_btn.textContent = "Delete Task";

	if (task.due === ""){
		due_item.textContent = "No due date";
		due_item.classList.add("nodue_txt");
	} else {
		due_item.textContent = "Due: " + task.due;
	}
	
	if (task.complete === false && new Date(task.due) < new Date()) {
		due_item.classList.add("overdue_txt");
	}

	if (task.complete === true) {
		todo_btn.textContent = "Done";
		todo_btn.classList.add("done");
	} else {
		todo_btn.textContent = "To do";
		todo_btn.classList.add("todo");
	}

	tm_menu.appendChild(trename_btn);
	tm_menu.appendChild(tchangedue_btn);
	tm_menu.appendChild(taddgroup_btn);
	tm_menu.appendChild(tdelete_btn);
	tm_wrap.appendChild(tm_btn);
	tm_wrap.appendChild(tm_menu);
	task_box.append(todo_btn);
	task_box.append(task_item);
	task_box.append(due_item);
	task_box.append(tm_wrap);
	show_box.appendChild(task_box);

	tm_btn.addEventListener("click", function(event) {
		event.stopPropagation();
		tm_menu.style.display = "block";
		new_menu.style.display = "none";
	});

	trename_btn.addEventListener("click", function(event) {
		event.stopPropagation();
		rename_target = task;
		rename_target_type = "task";
		rn_title.textContent = "Rename Task";
		rn_input.placeholder = "Task Name";
		rn_input.value = task.text;
		rn_input.classList.toggle("contains_chinese_text", /[\u3400-\u9fff\uf900-\ufaff]/.test(rn_input.value));
		rn_error.textContent = " ";
		rn_box.style.display = "flex";
		tm_menu.style.display = "none";
	});

	tchangedue_btn.addEventListener("click", function(event) {
		event.stopPropagation();
		active_date_task = task;
		due_input.value = task.due || "";
		due_display.value = task.due
			? new Date(`${task.due}T00:00:00`).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			})
			: "";
		open_date_picker(due_input, due_display);
		tm_menu.style.display = "none";
	});

	taddgroup_btn.addEventListener("click", function(event) {
		event.stopPropagation();
		group_assign_task = task;
		group_assign_checklist.innerHTML = "";
		if (groups.length === 0) {
			const empty_message = document.createElement("p");
			empty_message.classList.add("group_assign_empty");
			empty_message.textContent = "Create a group first to assign this task.";
			group_assign_checklist.appendChild(empty_message);
		}
		for (const group of groups) {
			const row = document.createElement("label");
			row.classList.add("group_assign_option");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.value = String(group.id);
			checkbox.checked = task.groups.some(group_id => String(group_id) === String(group.id));
			const group_name = document.createElement("span");
			append_user_text(group_name, group.name);
			row.append(checkbox, group_name);
			group_assign_checklist.appendChild(row);
		}
		group_assign_box.style.display = "flex";
		tm_menu.style.display = "none";
	});

	tdelete_btn.addEventListener("click", function() {
		tasks.splice(tasks.indexOf(task), 1);
		save_tasks();
		reshow_tasks();
	});

	todo_btn.addEventListener("click", function() {
		if (task.complete === false) {
			task.complete = true;
			todo_btn.textContent = "Done"

			todo_btn.classList.remove("todo");
			todo_btn.classList.add("done");
		} else {
			task.complete = false;
			todo_btn.textContent = "To do"

			todo_btn.classList.remove("done");
			todo_btn.classList.add("todo");
		}

		reshow_tasks();
		save_tasks();
	});
}

function reshow_tasks() {
	show_box.innerHTML = "";
	sort_tasks();

	const visible_tasks = selected_group_id === null
		? tasks
		: tasks.filter(task => task.groups.some(group_id => group_id === selected_group_id));
	for (const task of visible_tasks) {
		show_task(task);
	}
	tasks_empty_state.hidden = selected_group_id !== null || visible_tasks.length !== 0;
	redraw_calendar();
}

function sort_tasks() {
	tasks.sort(function(a, b) {
		if (a.complete !== b.complete) {
			return a.complete - b.complete;
		}
		if (a.due === "" && b.due === "") {
			return 0;
		}
		if (a.due === "") {
			return 1;
		}
		if (b.due === "") {
			return -1;
		}
		return new Date(a.due) - new Date(b.due);
	});
}

function save_tasks() {
	set_user_data("tasks", JSON.stringify(tasks));
}

function save_events() {
	set_user_data("events", JSON.stringify(events));
}

function load_events() {
	const saved_events = get_user_data("events");
	if (saved_events !== null) events = JSON.parse(saved_events);
}

window.addEventListener("storage", function(event) {
	if (!current_user || event.key !== user_storage_key("events")) return;
	events = event.newValue ? JSON.parse(event.newValue) : [];
	redraw_calendar();
	render_recent_events();
	render_favorite_events();
	render_events_timeline();
});

function event_type_class(type) {
	if (type === "Holiday" || type === "节日") return "event_type_holiday";
	if (type === "Day off" || type === "放假") return "event_type_day_off";
	if (type === "Activity" || type === "活动") return "event_type_activity";
	return "event_type_custom";
}

function initialize_custom_selects() {
	for (const select of document.querySelectorAll("select")) {
		if (select.dataset.customized === "true") continue;
		select.dataset.customized = "true";
		const wrapper = document.createElement("div");
		wrapper.className = "custom_select";
		select.parentNode.insertBefore(wrapper, select);
		wrapper.appendChild(select);
		select.classList.add("native_select_accessible");
		select.tabIndex = -1;

		const trigger = document.createElement("button");
		trigger.type = "button";
		trigger.className = "custom_select_trigger";
		trigger.setAttribute("aria-haspopup", "listbox");
		trigger.setAttribute("aria-expanded", "false");
		const label = document.querySelector(`label[for="${select.id}"]`);
		if (label) {
			trigger.setAttribute("aria-label", label.textContent.trim());
			label.addEventListener("click", function(event) {
				event.preventDefault();
				trigger.focus();
			});
		}
		wrapper.appendChild(trigger);

		const options = document.createElement("div");
		options.className = "custom_select_options";
		options.setAttribute("role", "listbox");
		wrapper.appendChild(options);
		wrapper._trigger = trigger;
		wrapper._options = options;
		wrapper._select = select;

		trigger.addEventListener("click", function() {
			const was_open = wrapper.classList.contains("open");
			for (const open_wrapper of document.querySelectorAll(".custom_select.open")) close_custom_select(open_wrapper);
			if (!was_open) {
				wrapper.classList.add("open");
				trigger.setAttribute("aria-expanded", "true");
				options.querySelector("[aria-selected='true']")?.focus();
			}
		});
		select.addEventListener("change", function() {
			render_custom_select(wrapper);
		});
		render_custom_select(wrapper);
	}
}

function render_custom_select(wrapper) {
	const select = wrapper._select;
	const trigger = wrapper._trigger;
	const options = wrapper._options;
	set_user_text(trigger, select.selectedOptions[0]?.textContent || "Select");
	options.innerHTML = "";
	for (const native_option of select.options) {
		const option = document.createElement("button");
		option.type = "button";
		option.className = "custom_select_option";
		append_user_text(option, native_option.textContent);
		option.setAttribute("role", "option");
		option.setAttribute("aria-selected", String(native_option.value === select.value));
		option.addEventListener("click", function() {
			select.value = native_option.value;
			select.dispatchEvent(new Event("change", { bubbles: true }));
			close_custom_select(wrapper);
			trigger.focus();
		});
		option.addEventListener("keydown", function(event) {
			if (event.key === "Escape") {
				event.preventDefault();
				close_custom_select(wrapper);
				trigger.focus();
			} else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				const all_options = [...options.querySelectorAll(".custom_select_option")];
				const step = event.key === "ArrowDown" ? 1 : -1;
				all_options[(all_options.indexOf(option) + step + all_options.length) % all_options.length].focus();
			} else if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				option.click();
			}
		});
		options.appendChild(option);
	}
}

function refresh_custom_select(select) {
	const wrapper = select.parentElement;
	if (wrapper?.classList.contains("custom_select")) render_custom_select(wrapper);
}

function close_custom_select(wrapper) {
	wrapper.classList.remove("open");
	wrapper._trigger?.setAttribute("aria-expanded", "false");
}

function initialize_task_scrollbar() {
	let dragging = false;
	let drag_start_y = 0;
	let drag_start_top = 0;
	const update = function() {
		const viewport_height = show_box.clientHeight;
		const content_height = show_box.scrollHeight;
		const track_height = task_scrollbar.clientHeight;
		const has_overflow = content_height > viewport_height + 1;
		task_scrollbar.hidden = !has_overflow;
		if (!has_overflow || track_height === 0) return;
		const thumb_height = Math.max(24, viewport_height / content_height * track_height);
		const max_thumb_top = track_height - thumb_height;
		const max_scroll_top = content_height - viewport_height;
		task_scroll_thumb.style.height = `${thumb_height}px`;
		task_scroll_thumb.style.transform = `translateY(${max_scroll_top ? show_box.scrollTop / max_scroll_top * max_thumb_top : 0}px)`;
	};
	show_box.addEventListener("scroll", update);
	new MutationObserver(update).observe(show_box, { childList: true, subtree: true, characterData: true });
	new ResizeObserver(update).observe(show_box);
	task_scrollbar.addEventListener("pointerdown", function(event) {
		if (event.target === task_scroll_thumb) {
			dragging = true;
			drag_start_y = event.clientY;
			drag_start_top = show_box.scrollTop;
			task_scroll_thumb.setPointerCapture(event.pointerId);
			event.preventDefault();
			return;
		}
		const bounds = task_scrollbar.getBoundingClientRect();
		const thumb_height = task_scroll_thumb.offsetHeight;
		const progress = Math.max(0, Math.min(1, (event.clientY - bounds.top - thumb_height / 2) / (bounds.height - thumb_height)));
		show_box.scrollTop = progress * (show_box.scrollHeight - show_box.clientHeight);
	});
	task_scroll_thumb.addEventListener("pointermove", function(event) {
		if (!dragging) return;
		const track_range = task_scrollbar.clientHeight - task_scroll_thumb.offsetHeight;
		const scroll_range = show_box.scrollHeight - show_box.clientHeight;
		show_box.scrollTop = drag_start_top + (event.clientY - drag_start_y) / track_range * scroll_range;
	});
	const stop_dragging = function() { dragging = false; };
	task_scroll_thumb.addEventListener("pointerup", stop_dragging);
	task_scroll_thumb.addEventListener("pointercancel", stop_dragging);
	window.addEventListener("resize", update);
	update();
}

function initialize_memo_scrollbar() {
	let dragging = false;
	let drag_start_y = 0;
	let drag_start_scroll = 0;
	const update = function() {
		const viewport_height = memo_body_scroll_area.clientHeight;
		const content_height = memo_body_scroll_area.scrollHeight;
		const track_height = memo_scrollbar.clientHeight;
		const has_memo = memos.some(memo => String(memo.id) === String(selected_memo_id));
		const has_overflow = has_memo && content_height > viewport_height + 1;
		memo_scrollbar.hidden = !has_overflow;
		if (!has_overflow || track_height === 0) return;
		const thumb_height = Math.max(24, viewport_height / content_height * track_height);
		const max_thumb_top = track_height - thumb_height;
		const max_scroll_top = content_height - viewport_height;
		memo_scroll_thumb.style.height = `${thumb_height}px`;
		memo_scroll_thumb.style.transform = `translateY(${max_scroll_top ? memo_body_scroll_area.scrollTop / max_scroll_top * max_thumb_top : 0}px)`;
	};
	memo_body_scroll_area.addEventListener("scroll", update);
	memo_content_input.addEventListener("input", update);
	new ResizeObserver(update).observe(memo_body_scroll_area);
	new MutationObserver(update).observe(memo_body_scroll_area, { childList: true, subtree: true, characterData: true });
	memo_scrollbar.addEventListener("pointerdown", function(event) {
		if (event.target === memo_scroll_thumb) {
			dragging = true;
			drag_start_y = event.clientY;
			drag_start_scroll = memo_body_scroll_area.scrollTop;
			memo_scroll_thumb.setPointerCapture(event.pointerId);
			event.preventDefault();
			return;
		}
		const bounds = memo_scrollbar.getBoundingClientRect();
		const thumb_height = memo_scroll_thumb.offsetHeight;
		const track_range = Math.max(1, bounds.height - thumb_height);
		const progress = Math.max(0, Math.min(1, (event.clientY - bounds.top - thumb_height / 2) / track_range));
		memo_body_scroll_area.scrollTop = progress * (memo_body_scroll_area.scrollHeight - memo_body_scroll_area.clientHeight);
	});
	memo_scroll_thumb.addEventListener("pointermove", function(event) {
		if (!dragging) return;
		const track_range = memo_scrollbar.clientHeight - memo_scroll_thumb.offsetHeight;
		if (track_range <= 0) return;
		const scroll_range = memo_body_scroll_area.scrollHeight - memo_body_scroll_area.clientHeight;
		memo_body_scroll_area.scrollTop = drag_start_scroll + (event.clientY - drag_start_y) / track_range * scroll_range;
	});
	const stop_dragging = function() { dragging = false; };
	memo_scroll_thumb.addEventListener("pointerup", stop_dragging);
	memo_scroll_thumb.addEventListener("pointercancel", stop_dragging);
	window.addEventListener("resize", update);
	update();
	return update;
}

function initialize_account_settings_scrollbar() {
	let dragging = false;
	let drag_start_y = 0;
	let drag_start_scroll = 0;
	const update = function() {
		const viewport_height = account_settings_scroll_area.clientHeight;
		const content_height = account_settings_scroll_area.scrollHeight;
		const track_height = account_settings_scrollbar.clientHeight;
		const has_overflow = content_height > viewport_height + 1;
		account_settings_scrollbar.hidden = !has_overflow;
		if (!has_overflow || track_height === 0) return;
		const thumb_height = Math.max(24, viewport_height / content_height * track_height);
		const max_thumb_top = track_height - thumb_height;
		const max_scroll_top = content_height - viewport_height;
		account_settings_scroll_thumb.style.height = `${thumb_height}px`;
		account_settings_scroll_thumb.style.transform = `translateY(${max_scroll_top ? account_settings_scroll_area.scrollTop / max_scroll_top * max_thumb_top : 0}px)`;
	};
	account_settings_scroll_area.addEventListener("scroll", update);
	new ResizeObserver(update).observe(account_settings_scroll_area);
	new MutationObserver(update).observe(account_settings_scroll_area, { childList: true, subtree: true, characterData: true });
	account_settings_scrollbar.addEventListener("pointerdown", function(event) {
		if (event.target === account_settings_scroll_thumb) {
			dragging = true;
			drag_start_y = event.clientY;
			drag_start_scroll = account_settings_scroll_area.scrollTop;
			account_settings_scroll_thumb.setPointerCapture(event.pointerId);
			event.preventDefault();
			return;
		}
		const bounds = account_settings_scrollbar.getBoundingClientRect();
		const thumb_height = account_settings_scroll_thumb.offsetHeight;
		const track_range = Math.max(1, bounds.height - thumb_height);
		const progress = Math.max(0, Math.min(1, (event.clientY - bounds.top - thumb_height / 2) / track_range));
		account_settings_scroll_area.scrollTop = progress * (account_settings_scroll_area.scrollHeight - account_settings_scroll_area.clientHeight);
	});
	account_settings_scroll_thumb.addEventListener("pointermove", function(event) {
		if (!dragging) return;
		const track_range = account_settings_scrollbar.clientHeight - account_settings_scroll_thumb.offsetHeight;
		if (track_range <= 0) return;
		const scroll_range = account_settings_scroll_area.scrollHeight - account_settings_scroll_area.clientHeight;
		account_settings_scroll_area.scrollTop = drag_start_scroll + (event.clientY - drag_start_y) / track_range * scroll_range;
	});
	const stop_dragging = function() { dragging = false; };
	account_settings_scroll_thumb.addEventListener("pointerup", stop_dragging);
	account_settings_scroll_thumb.addEventListener("pointercancel", stop_dragging);
	window.addEventListener("resize", update);
	update();
	return update;
}

function load_tasks() {
	const saved_tasks = get_user_data("tasks");
	if (saved_tasks !== null) {
		tasks = JSON.parse(saved_tasks);
	}	
}

function save_groups() {
    set_user_data("groups", JSON.stringify(groups));
}
function load_groups() {
    const saved_groups = get_user_data("groups");
    if (saved_groups !== null) {
        groups = JSON.parse(saved_groups);
    }
}
