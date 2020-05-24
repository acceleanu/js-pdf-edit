const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const createNewPdf = async (srcPdfFileName, pagesFilter, newPdfFileName) => {
	const srcPdfContent = fs.readFileSync(srcPdfFileName);
	const srcPdf = await PDFDocument.load(srcPdfContent);
	const newPdf = await PDFDocument.create();

	const n = srcPdf.getPages().length;
	const v = Array.from(Array(n).keys());
	const pages = v.filter(x => pagesFilter(x));

	const copiedPages = await newPdf.copyPages(srcPdf, pages);
	copiedPages.forEach(p => newPdf.addPage(p));
	const newPdfContent = await newPdf.save();
	fs.writeFileSync(newPdfFileName, newPdfContent);	
}

const splitPdf = async (srcFileName) => {
	await createNewPdf(`${srcFileName}.pdf`, x => x%2 === 0, `${srcFileName}-odd.pdf`);
	await createNewPdf(`${srcFileName}.pdf`, x => x%2 === 1, `${srcFileName}-even.pdf`);
}; 

const main = async () => {
	await splitPdf('p1');	
}

main().then(
    () => {
        console.info('finished ok');
    },
    e => {
        console.error(e);
    }
);

