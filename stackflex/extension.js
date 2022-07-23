const vscode = require("vscode");
const fetch = require("node-fetch");

const baseURL = "https://stackflex.tronic247.com/";

function activate(context) {
	const storeLocation = context.globalState;

	/**
	 *
	 * Utility functions
	 *
	 */
	const setGlobal = (key, value) => {
		storeLocation.update(key, value);
	};

	const getGlobal = (key) => {
		return storeLocation.get(key);
	};

	/**
	 *
	 *
	 * Main app
	 *
	 *
	 */

	/**
	 * Check if logged in
	 */
	const isLoggedIn = () => {
		return getGlobal("_SECRET_TOKEN_DO_NOT_SHARE_") !== undefined;
	};

	/**
	 *
	 *
	 * Login handler
	 *
	 */
	function checkLogin() {
		if (!isLoggedIn()) {
			vscode.window
				.showInformationMessage(
					"Please login to your StackFlex account first.",
					{
						detail: "Login",
						title: "Login",
					}
				)
				.then(() => {
					/**
					 * Open login page
					 */
					vscode.commands
						.executeCommand(
							"vscode.open",
							vscode.Uri.parse(baseURL + "loginToExtension")
						)
						.then(() => {
							vscode.window
								.showInformationMessage("Logged in?", {
									detail: "Enter your secret token",
									title: "Enter your secret token",
								})
								.then(() => {
									/**
									 * Open prompt to get token
									 */
									vscode.window
										.showInputBox({
											placeHolder: "Enter your token",
											prompt: "Enter your token",
											value: "",
											validateInput: (input) => {
												if (input.length < 10) {
													return "Token must be at least 10 characters long";
												}
												return null;
											},
											password: true,
										})
										.then((token) => {
											if (token) {
												setGlobal("_SECRET_TOKEN_DO_NOT_SHARE_", token);
												vscode.window.showInformationMessage(
													"Logged in successfully."
												);
											}
										});
								});
						});
				});

			return;
		}
	}

	checkLogin();

	/**
	 *
	 *
	 * The main app!
	 *
	 * This is where the magic happens
	 * and where the extension is actually useful
	 *
	 *
	 */

	/**
	 * Get the item titles and languages
	 */
	const getItemTitles = async () => {
		const response = await fetch(baseURL + "api/codes/extension", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				key: getGlobal("_SECRET_TOKEN_DO_NOT_SHARE_"), // lmao this is not actually a secret
				getItems: true,
			}),
		});

		const data = await response.json();

		return data.items;
	};

	/**
	 * Get single item
	 */
	const getItem = async (id) => {
		const response = await fetch(baseURL + "api/codes/extension", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				key: getGlobal("_SECRET_TOKEN_DO_NOT_SHARE_"),
				id: id,
				getItems: true,
			}),
		});

		const data = await response.json();

		return data.item;
	};

	const disposable = vscode.commands.registerCommand(
		"stackflex.openMenu",
		async () => {
			// Check if logged in
			if (!isLoggedIn()) return checkLogin();

			// Get the active text editor
			const editor = vscode.window.activeTextEditor;

			/**
			 * If there's an editor
			 */
			if (editor) {
				const selection = editor.selection;

				// Create quick pick
				const quickPick = vscode.window.createQuickPick();

				/**
				 * On selected, insert
				 */
				quickPick.onDidChangeSelection(async () => {
					if (quickPick.selectedItems[0].id === "signout") {
						setGlobal("_SECRET_TOKEN_DO_NOT_SHARE_", undefined);
						checkLogin();
						quickPick.dispose();
						return;
					}

					const id = quickPick.selectedItems[0].id;
					const item = await getItem(id);

					// Insert the item
					editor.edit((editBuilder) => {
						editBuilder.insert(selection.start, item.code);

						// Move the cursor to the end of the inserted text
						editor.selection = new vscode.Selection(
							selection.start,
							selection.start.translate(0, item.code.length)
						);

						quickPick.dispose();
					});
				});

				quickPick.show();

				let searchItems = await getItemTitles();
				searchItems =
					searchItems.map((item) => ({
						label: item.title,
						description: item.language,
						id: item.id,
					})) || [];

				quickPick.items = [
					...searchItems,
					{
						label: "Sign out",
						description: "Sign out",
						id: "signout",
					},
				];
			}
		}
	);

	context.subscriptions.push(disposable);
}

module.exports = {
	activate,
};
