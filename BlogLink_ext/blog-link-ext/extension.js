// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const convert = require('xml-js');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	console.log('Congratulations, your extension "blog-link-ext" is now active!');
	const res = await axios.get('https://blog.webdevsimplified.com/rss.xml')
	const jsonResult = JSON.parse(convert.xml2json(res.data, {
		compact: true,
		spaces: 2
	}));
	const items = jsonResult.rss.channel.item.map
	(item => {
		return {
			label: item.title._text,
			detail: item.description._text,
			link: item.link._text
		}
	});


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	try{
		const disposable = vscode.commands.registerCommand('blog-link-ext.searchBlogExample', 
			async function () {
				const item = await vscode.window.showQuickPick(items,{
				matchOnDetail: true,
			})
			if (item == null) return
			
			vscode.env.openExternal(item.link);
			}
		);

		context.subscriptions.push(disposable);
	}
	catch(e){
		vscode.window.showErrorMessage('Error: ' + e);
	}

	let disposable2 = vscode.commands.registerCommand('blog-link-ext.test', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World 2 from blog-link-ext.test!');
    });

    context.subscriptions.push(disposable2);
	
	

	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
