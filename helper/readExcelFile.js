const ExcelJS = require('exceljs');

function readExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();

    workbook.xlsx.readFile(filePath)
        .then(function() {
            // İlk çalışma sayfasını seçin
            const worksheet = workbook.getWorksheet(1);

            // Tüm satırları döngüye alarak verilere erişin
            worksheet.eachRow(function(row, rowNumber) {
                // Satırdaki hücreleri döngüye alarak her bir hücreyi yazdırın
                row.eachCell(function(cell, colNumber) {
                    console.log('Satır ' + rowNumber + ', Sütun ' + colNumber + ' : ' + cell.value);
                });
            });
        })
        .catch(function(err) {
            console.error('Hata:', err);
        });
}
module.exports = readExcelFile;