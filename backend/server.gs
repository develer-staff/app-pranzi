/**
 * API JSON per aggiornare il foglio di calcolo dei pranzi.
 *
 * Modalità d'uso: fare una HTTP GET alla URL di pubblicazione dello script
 * specificando come query argument il nome dell'utente e il tipo di pasto.
 *
 *    HTTP GET <script_url>?user=rasky&food=PD&func=insert
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

var SCRIPT_VERSION = "1.2.0";
var TUTTO_PRANZI = "1Ox0nwWTKa_PgM7O6ZfMrbRyOcscjCkOdUKn0QNV91Rk"


/**
 * Search for today's row, assuming that dates are in the first column.
 * It returns the row number that corresponds to today, or -1 if such row
 * does not exist.
 */
function findTodayRow() {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var lastRow = doc.getLastRow();
  var today = new Date();
  today.setHours(0,0,0,0);
  var dates = doc.getActiveSheet().getRange(1, 1, lastRow, 1).getValues();

  for (var i=1; i < lastRow; ++i) {
     if (dates[i][0].getDate() == today.getDate() &&
         dates[i][0].getMonth() == today.getMonth() &&
         dates[i][0].getYear() == today.getYear())
        return i;
  }

  return -1;
}


/**
 * Search for a date specific row, assuming that dates are in the first column.
  * It returns the row number that corresponds to today, or -1 if such row
 * does not exist.
 */
function findDate(date) {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var lastRow = doc.getLastRow();
  var dates = doc.getActiveSheet().getRange(1, 1, lastRow, 1).getValues();
  date = date.split('-');

  for (var i=1; i < lastRow; ++i) {
    var d = dates[i][0];
    if (dates[i][0].getDate() == date[0] &&
        dates[i][0].getMonth() == date[1] &&
        dates[i][0].getYear() == date[2])
        return i;
  }

  return -1;
}


/**
 * Search for a user's specific column, assuming that usernames are in the first row.
 * It returns the user column number or -1 if user column is not found.
 */
function findUserColumn(user) {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var lastCol = doc.getLastColumn();
  var names = doc.getActiveSheet().getRange(1, 1, 1, lastCol).getValues();

  for (var i=1;i < lastCol;++i) {
    if (names[0][i] == user) {
      return i;
    }
  }

  return -1;
}


/**
 * Register a lunch for specific date.
 */
function insertLunch(e) {
  var doc = SpreadsheetApp.openById(TUTTO_PRANZI);
  var row = findDate(e.parameter.date);

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


/**
 * Web application GET endpoint.
 */
function doGet(e) {
  var msg = '';

  /**
   * In case the "func" parameter is not defined we fall back to the
   * "insert lunch" function for today.
   */
  if (e.parameter.func == undefined) {
    var today = new Date();
    var todayStr = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
    e.parameter['func'] = 'insert';
    e.parameter['date'] = todayStr;
  }

  if (e.parameter.func === 'insert') {
    msg = insertLunch(e);
  }
  else if (e.parameter.func === 'search') {
    if (findUserColumn(e.parameter.user) === -1) {
      msg = "Utente '" + e.parameter.user + "' non trovato in TuttoPranzi";
    }
  } else {
    msg = "Funzione '" + e.parameter.func + "' non trovata";
  }

  if (msg) {
    result = { error: 1, message: msg }
  }
  else {
    result = { error: 0 };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
                       .setMimeType(ContentService.MimeType.JSON);
};
