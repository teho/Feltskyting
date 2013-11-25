//
// Feltskyting
//
// Javascript rutiner
//

// **************************
// Globale variable
// **************************
var db;
// Database

//
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

//
// device APIs are available
//
function onDeviceReady() {
	console.log("onDevice called");
	try {
		db = window.openDatabase("FeltDB", "1.0", "Feltskyting", 200000);
	} catch (err) {
		alert(err);
	}
	initierDatabase();					// Fjernes senere og settes kun ved brukervalg
	// initierSikter();
	initierKuler();
}

//
// Våpen ble endret
//
function parameterEndring(obj) {
	console.log("obj : " + obj);
	console.log(obj.options[obj.selectedIndex].value);
	console.log(obj.options[obj.selectedIndex].innerHTML);
}

//
// Fyll select "sikter" med data
//
function initierSikter() {
	var results = {
		'sikte1' : 'Busk Standard',
		'sikte2' : 'Busk Finknepp'
	};
	$.each(results, function(val, text) {
		$("#selectSikte").append($("<option />").val(val).text(text));
	});

	// Velg første element og refresh skjermbilde
	$('#selectSikte').prop('selectedIndex', 0).selectmenu('refresh');
}

//
// Fyl inn dropdown med kuler
//
function initierKuler() {
	console.log("InitierKuler");
	var results = {
		'kule1' : 'Lapua 108gr 6.5mm',
		'kule2' : 'Sierra 144gr 6.5mm',
		'kule3' : 'Sierra 123gr 6.5mm',
		'kule4' : 'Sierra 109gr 6.5mm'
	};
	$.each(results, function(val, text) {
		$("#selectKule").append($("<option />").val(val).text(text));
	});

	// Sett valgt element og oppdater skjerm
	$("#selectKule").prop('selectedIndex', 2).selectmenu('refresh');
}

//  ********************************************
// Populate the database
// 	********************************************
function initierDatabase() {
	initierTabellSikte();
	initierTabellKule();
}

//  ********************************************
//  Sikter
//  ********************************************
function initierTabellSikte(tx) {
	tx.executeSql('DROP TABLE IF EXISTS SIKTE');
	tx.executeSql('CREATE TABLE IF NOT EXISTS SIKTE (id unique, navn, gjenge, antKnepp)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (1, "Busk Standard", 1.0, 12)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (2, "Busk Finknepp", 1.0, 24)');
}

//  ********************************************
//  Kuler
//  ********************************************
function initierTabellKule(tx) {
	tx.executeSql('DROP TABLE IF EXISTS Kule');
	tx.executeSql('CREATE TABLE IF NOT EXISTS KULE (id unique, navn, bcoeff)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, balCoef) VALUES (1, "Lapua 108gr 6.5mm", .60)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, balCoef) VALUES (1, "Sierra 109gr 6.5mm", .61)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, balCoef) VALUES (1, "Sierra 123gr 6.5mm", .62)');
	tx.executeSql('INSERT INTO SIKTE (id, navn, balCoef) VALUES (1, "Sierra 144gr 6.5mm", .63)');
}

//
// Transaction error callback
//
function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}

//
// Transaction success callback
//
// function successCB() {
// var db = window.openDatabase("FeltDB", "1.0", "Feltskyting", 200000);
// db.transaction(queryDB, errorCB);
// }
