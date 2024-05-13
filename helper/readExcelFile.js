const ExcelJS = require('exceljs');

function readExcelFile(filePath,langData) {

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
                    message: langData.excelReadSuccess,
                    data
                })

            })
            .catch(error => reject({
                status : false,
                message: langData.excelReadError,
            }));
    });
}
module.exports = readExcelFile;