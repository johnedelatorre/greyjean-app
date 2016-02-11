module.exports = {
	release: {
		options: {
			insertType: "prepend",
			template: "## Release v<%= package.version %>:\n\n{{> features}}{{> fixes}}\n\n",
			partials: {
				features: "### Features:\n\n{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n",
				fixes: "### BugFixes:\n\n{{#if fixes}}{{#each fixes}}{{> fix}}{{/each}}{{else}}{{> empty}}{{/if}}",
				funtime: "### FunTime:\n\n{{#if funtime}}{{#each funtime}}{{> fix}}{{/each}}{{else}}{{> empty}}{{/if}}",
				empty: " - (none)\n"
			},
			dest: "update.txt"
		}
	}
};
