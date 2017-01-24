/**
 * API JSON per aggiornare il foglio di calcolo TuttoPranzi.
 *
 * Modalità d'uso: fare una HTTP GET alla URL di pubblicazione dello script
 * specificando come query argument il nome dell'utente e il tipo di pasto.
 *
 *
 *    HTTP GET <script_url>?user=rasky&food=PD
 *
 * Lo script ritorna un oggetto JSON di questo tipo:
 *
 *    { error: 0 }
 *
 * oppure:
 *
 *    [ error: 1, message: "user not found" }
 *
 */

var SCRIPT_VERSION = "1.0.0";
var TUTTO_PRANZI = "1Ox0nwWTKa_PgM7O6ZfMrbRyOcscjCkOdUKn0QNV91Rk";


function findTodayRow() {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var lastRow = doc.getLastRow();
  var today = new Date();
  today.setHours(0,0,0,0);

  var dates = doc.getActiveSheet().getRange(1,1,lastRow,1).getValues();

  for (var i=1; i < lastRow; ++i) {
     if (dates[i][0].getDate() == today.getDate() &&
         dates[i][0].getMonth() == today.getMonth() &&
         dates[i][0].getYear() == today.getYear())
        return i;
  }
  return -1;
}


function findUserColumn(user) {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var lastCol = doc.getLastColumn();
  var names = doc.getActiveSheet().getRange(1,1,1,lastCol).getValues();

  for (var i=1;i < lastCol;++i) {
    if (names[0][i] == user) {
      return i;
    }
  }

  return -1;
}


function execute(e) {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var row = findTodayRow();

  if (row < 0) {
    return "Internal error: cannot find the row representing today in the spreadsheet";
  }

  var col = findUserColumn(e.parameter.user);
  if (col < 0) {
    return "Utente '" + e.parameter.user + "' non trovato in TuttoPranzi";
  }

  var cell = doc.getActiveSheet().getRange("a1").offset(row, col);
  cell.setValue(e.parameter.food);
}


function doGet(e) {
  var msg = execute(e);

  if (msg) result = { error: 1, message: msg }
  else result = { error: 0 };

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
};
