const fs = require('fs').promises;

(async() => {
	const learnedFile = await fs.readFile('./learned.alchemy.txt', 'utf-8');
	const allFile = await fs.readFile('./all.alchemy.txt', 'utf-8');
	
	const learnedRecipies = learnedFile.split('\n').map(r => r.trim());
	const allRecipies = allFile.split('\n').map(r => r.trim());
	
	const missingRecipes = allRecipies.filter(all => learnedRecipies.every(learned => all !== learned));
	
	const missingList = missingRecipes.map((r, i) => `${i+1}\t${r}`).join('\n');
	
	
	await fs.writeFile('./missing.alchemy.txt', missingList, 'utf-8');
	console.log(missingList);
})();