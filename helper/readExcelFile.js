const ExcelJS = require('exceljs');

function readExcelFile(filePath) {
    return new Promise((resolve, reject) => {
        const workbook = new ExcelJS.Workbook();

        workbook.xlsx.readFile(filePath)
            .then(() => {

                const worksheet = workbook.getWorksheet(1);
                const {columnCount} = worksheet;
                const data = [];

                for (let column = 1; column - 1 < columnCount; column++) {
                    const columnData = worksheet.getColumn(column).values.filter(value => value !== undefined);
                    if (columnData.length > 0) {
                        data.push(columnData);
                    }
                }

                resolve({
                    status : true,
                    message: 'Excel file was read successfully',
                    data
                })

            })
            .catch(error => reject({
                status : false,
                message: `An error occurred while reading the Excel file: ${error.message}`,
            }));
    });
}
module.exports = readExcelFile;