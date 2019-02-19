var numOfList = 9; //number of lists
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("BackEndSheet");
var row = sheet.getRange(10,2).getValue();
var rowCell = sheet.getRange(10,2);
var nextRow = ((row)%numOfList)+1;
var nextRowCell = sheet.getRange(nextRow,2)
var currentChapterCell = sheet.getRange(row,2);
var currentChapter = currentChapterCell.getValue();

//variables for test()
var bookNameColumnCell = sheet.getRange(row,4);
var bookNameColumn = bookNameColumnCell.getValue();
var bookChapterColumn = bookNameColumn+1;
var bookCell = sheet.getRange(row,bookNameColumn); //cell with book name (not column 1 cell)
var currentBook = bookCell.getValue();
var numChapters = sheet.getRange(row,bookChapterColumn).getValue();

// Variables for function link()
var linkCell = sheet.getRange(11,3);
var linkAmpCell = sheet.getRange(11,4);
var linkURL = "https://www.biblegateway.com/passage/?search=" + currentBook + "+" + currentChapter + "&version=ESV";
var linkAmp = "https://www.google.com/amp/s/www.biblegateway.com/passage/%3fsearch=" + currentBook + "+" + currentChapter + "&version=ESV&interface=amp";

function updateBookAndChapter() {
  currentBook = bookCell.getValue();
  currentChapter = currentChapterCell.getValue();
}

function updateLink() {
  linkURL = "https://www.biblegateway.com/passage/?search=" + currentBook + "+" + currentChapter + "&version=ESV";
}

function onEdit(e) {
//this is a reserved function in Google Scripts

  var onEditCell = 'A11'; //the cell we check for changes
  var onEditSheet = 'backEndSheet'; //the sheet we check for edits
  
  
  if (e.source.getActiveSheet().getName() == onEditSheet 
      && e.range.getA1Notation() == onEditCell) {
    //Compares sheet edited to onEditSheet
    //finds which cell was edited (i.e., range) 
    //and compares to onEditCell
    //That way, only edits in onEditCell execute code
  
    if (/^\w+$/.test(e.value)) { //blackbox function
           
      eval(e.value)(); 
      //executes function chosen in drop down menu
      //Allows us the option to execute different functions
      //can be dangerous, that's why we have data validation for cell
      //data validation options must match a function name exactly to execute that function
      
      e.range.clear(); //clears cell we changed so we can repeat
    }
  }
}



function setNewBook() {
bookCell = sheet.getRange(row,bookNameColumnCell.getValue());
  //if cell is empty
if (bookCell.getValue() === "") {
 //set bookCell to first book in list
  bookCell = sheet.getRange(row,5);
  bookNameColumnCell.setValue(5);
}
//set current book on list as the one in bookCell 
sheet.getRange(row,1).setValue(bookCell.getValue());
}

//test whether it's last chapter in book
function test() {
  
  if ( currentChapter >= numChapters ) {
    
    currentChapterCell.setValue(1);
    //Set new bookNameColumn value in cell
    bookNameColumnCell.setValue(bookNameColumn+2);
    //Changes book in row 1 to new book
    setNewBook();
    updateBookAndChapter();
    updateLink();
    currentChapterCell.setFormula("=HYPERLINK( \"" + linkURL + "\", \" " + 1 + " \" )");
  }  
    else {
      
  //increment chapter
  currentChapter++
  updateLink();
  currentChapterCell.setFormula("=HYPERLINK( \"" + linkURL + "\", \" " + currentChapter + " \" )");
      
 }
}


function bold() {
 nextRowCell.setFontWeight("bold");
}

function normal(sheet,row) {
  currentChapterCell.setFontWeight("normal");
  currentChapterCell.setFontLine("none");
  currentChapterCell.setFontColor("black");
  
}

// Create a link to BibleGateway page for passage

function link() {
  
  linkCell.setFormula("=HYPERLINK( \"" + linkURL + "\", \" " + linkURL + " \" )");
  linkAmpCell.setFormula("=HYPERLINK( \"" + linkAmp+ "\", \"BibleGateway\" )");
}
  
  
//Name of this function must match data validated entry in button
function increment() {
  link();
  test();
  bold();
  normal(sheet,row);
  rowCell.setValue(nextRow);
}






