//
// Feltskyting - Javascript rutiner
//
// **************************
// Globale variable
// **************************

var db;

console.log("\n************** Starting application **************");

//  ********************************************
// Wait for device API libraries to load
// 	********************************************
document.addEventListener("deviceready", onDeviceReady, false);

//  ********************************************
// onDeviceReady - Device is ready for use
// 	********************************************
function onDeviceReady() {
    console.log("onDevice called");
    try {
        db = window.openDatabase("FeltDB", "1.0", "Feltskyting", 200000);
    } catch (err) {
        alert(err);
    }
    // Skal fjernes senere. Skal være brukerstyrt
    db.transaction(initierDatabase, DbErrorHandler, initierDropDowns);
}

//  ********************************************
//  Parameter Endret
// 	********************************************
function parameterEndring(obj) {
    console.log("parameterEndring");
    // console.log(obj.options[obj.selectedIndex].value);
    // console.log(obj.options[obj.selectedIndex].innerHTML);
}

//  ********************************************
//  Oppdater Dropdown fra resultatsett
// 	********************************************
function oppdaterListe(tx, res, selId) {
    console.log("oppdaterListe " + selId.name);
    var rec, i;

    // Løp gjennom resultatene og fyll opp listen
    for ( i = 0; i < res.rows.length; i++) {
        rec = res.rows.item(i);
        selId.append($("<OPTION />").val(rec.id).text(rec.navn));
    };

    // Sett valgt element til første element og oppdater skjerm
    selId.prop('selectedIndex', 1).selectmenu('refresh');
}

//  ********************************************
//  Initier Liste
// 	********************************************
function initierListe(tx, tbl, selId) {
    console.log("initierListe: " + tbl);
    tx.executeSql('SELECT id, navn FROM ' + tbl + " order by navn", [], function(tx, res) {
        oppdaterListe(tx, res, selId)
    }, DbErrorHandler);
}

//  ********************************************
//  Initier DropDowns
// 	********************************************
function initierDropDowns() {
    console.log("initierDropDowns");
    // Fyll inn dropdown for våpen
    db.transaction(function(tx) {
        initierListe(tx, "VAAPEN", $("#selectVaapen"));
    }, DbErrorHandler);

    // Fyll inn dropdown for kuler
    db.transaction(function(tx) {
        initierListe(tx, "KULE", $("#selectKule"));
    }, DbErrorHandler);

}

//  ********************************************
//  Populate the database
// 	********************************************
function initierDatabase(tx) {
    console.log("initierDatabase");
    initierTabellSikte(tx);
    initierTabellKule(tx);
    initierTabellVaapen(tx);
}

//  ********************************************
//  Opprett og initier tabell Sikter
//  ********************************************
function initierTabellSikte(tx) {
    console.log("initierTabellSikte");
    try {
        tx.executeSql('DROP TABLE IF EXISTS SIKTE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SIKTE (id unique, navn, gjenge, antKnepp)');
        tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (1, "Busk Standard", 1.0, 12)');
        tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (2, "Busk Finknepp", 1.0, 24)');
    } catch(err) {
        alert("initierTabellSikte: " + err);
    }
}

//  ********************************************
//  Opprett og initier tabell Kuler
//  ********************************************
function initierTabellKule(tx) {
    console.log("initierTabellKule");
    try {
        tx.executeSql('DROP TABLE IF EXISTS Kule');
        tx.executeSql('CREATE TABLE IF NOT EXISTS KULE (id unique, navn, balC)');
        tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (1, "Lapua 108gr 6.6mm", .60)');
        tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (2, "Sierra 109gr 6.5mm", .61)');
        tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (3, "Sierra 123gr 6.5mm", .62)');
        tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (4, "Sierra 144gr 6.5mm", .63)');
    } catch (err) {
        alert("initierTabellKule: " + err.message);
    }
}

//  ********************************************
//  Opprett og initier tabell Vaapen
//  ********************************************
function initierTabellVaapen(tx) {
    console.log("initierTabellVaapen");
    try {
        tx.executeSql('DROP TABLE IF EXISTS Vaapen');
        tx.executeSql('CREATE TABLE IF NOT EXISTS VAAPEN (id unique, navn, kuleId, sikteId)');
        tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (1, "Terje FeltSauer", 2, 1)');
        tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (2, "Terje BaneSauer", 1, 1)');
        tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (3, "Stian Sauer", 3, 2)');
    } catch (err) {
        alert("initierTabellVaapen: " + err.message);
    }
}

//  ********************************************
//  Transaction error callback
//  ********************************************
function DbErrorHandler(err) {
    console.log("DbErrorHandler");
    console.log("Error processing SQL: " + err.message);
}
