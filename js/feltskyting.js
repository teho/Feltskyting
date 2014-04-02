//
// Feltskyting - Javascript rutiner
//
// **************************
// Globale variable
// **************************

var db;
var isVaapenOppsettLoaded = false;
// var vaapenListActiveItem = -1;

console.log("\n\n\n************** Starting application **************");

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

window.onBeforeUnload = function() {
	console.log("window.onBeforeUnload");
};
window.onUnload = function() {
	console.log("window.onUnload");
	// navigator.app.exitApp();
};

// document.addEventListener("menubutton", function () {
// console.log('Menu button');
// }, false);
//
// document.addEventListener("searchbutton", function () {
// console.log('Search button');
// }, false);
//
// document.addEventListener("backbutton", function () {
// console.log('Back button');
// }, false);

document.addEventListener("resume", onResume, false);
function onResume() {
	console.log("Resume event");
};

document.addEventListener("pause", onPause, false);
function onPause() {
	console.log("Pause event");
};

//  ********************************************
//  Parameter endret
// 	********************************************
function parameterEndring(obj) {
	console.log("parameterEndring");
	console.log(obj);
	// console.log(obj.options[obj.selectedIndex].value);
	console.log(obj.options[obj.selectedIndex].innerHTML);
}

//  ********************************************
//  Oppdater Dropdown fra resultatsett
// 	********************************************
function oppdaterListe(tx, res, selId) {
	console.log("oppdaterListe");
	var rec, i;

	// Løp gjennom resultatene og fyll opp listen
	for ( i = 0; i < res.rows.length; i++) {
		rec = res.rows.item(i);
		selId.append($("<option />").val(rec.id).text(rec.navn));
	};

	// Sett fokus på første element (index 0 er første) og oppdater skjerm
	selId.prop('selectedIndex', 0).selectmenu('refresh');
}

//  ********************************************
//  Initier Liste
// 	********************************************
function initierListe(tx, tbl, selId) {
	console.log("initierListe: " + tbl);
	tx.executeSql('SELECT id, navn FROM ' + tbl + " order by navn", [], function(tx, res) {
		oppdaterListe(tx, res, selId);
	}, DbErrorHandler);
}

//  ********************************************
//  Initier DropDown
// 	********************************************
function initierDropDown(tbl, selId) {
	// Fyll inn dropdown for kuler
	db.transaction(function(tx) {
		initierListe(tx, tbl, $(selId));
	}, DbErrorHandler);
}

//  ********************************************
//  Initier Objects (dropdowns, listview, etc.)
// 	********************************************
function initierDropDowns() {
	console.log("initierDropDowns");
	// Fyll inn dropdown for våpen
	// db.transaction(function(tx) {
	// initierListe(tx, "VAAPEN", $("#selectVaapen"));
	// }, DbErrorHandler);
	initierDropDown("VAAPEN", "#selectVaapen");
// 	initierListView("VAAPEN", "#vaapenList", "<li />");
}

//  ********************************************
//  Populate the database
// 	********************************************
function initierDatabase(tx) {
	console.log("initierDatabase");
	initierTabellSikte(tx);
	initierTabellKule(tx);
	initierTabellVaapen(tx);
	// initierTabellSisteBruk(tx);
}

//  ********************************************
//  Transaction error callback
//  ********************************************
function DbErrorHandler(err) {
	console.log("DbErrorHandler");
	console.log("Error processing SQL: " + err.message);
}

//  ********************************************
//  Eventhandlers for enter/leave pages
//  ********************************************
$(function() {
	$('#vaapenOppsett').on('pagebeforeshow', function() {
		console.log("vaapenOppsett: pagebeforeshow triggered");
		if (!isVaapenOppsettLoaded) {
			initierDropDown("KULE", "#selectKule");
			isVaapenOppsettLoaded = true;
			console.log("\tloaded KULE");
		}
	});
	$('#vaapenOppsett').on('pagebeforehide', function() {
		console.log("vaapenOppsett: pagebeforehide triggered");
		// $('#selectKule').find('option').remove().end();
		// $('#selectKule').selectmenu('refresh');
		// isVaapenOppsettLoaded = false;
		// $( "#vaapenEdit" ).css( "visibility", "visible" );
	});
	//  *********************************************
	//  Tap and Hold
	//  *********************************************
	$("#selectVaapen-button").bind('taphold', function(event) {
		console.log("tapholdHandler");
		$.mobile.changePage("#vaapenOppsett", {
			transition : "none"
		});
	});
	//  *********************************************
	//  vaapenListClick
	//  *********************************************
    $("#vaapenList li").click(function() {
        console.log("vaapenListClick event");
            $("#vaapenList li").removeClass('ui-btn-icon-right ui-icon-check');     // Remove active icon, removes for all items
        $(this).addClass('ui-btn-icon-right ui-icon-check');
        activeVaapen = $(this).find("a").text();
		console.log($("#selectVaapen option:selected").text());                // The value of the selected value in selectVaapen
    });
});

//  ********************************************
//  TESTING
//  ********************************************
function sjekkBasic() {
	console.log("sjekkBasic");
	//get
	var bla = $('#basic').val();
	console.log("Value entered: " + bla);
	//set
	$('#basic').val('Skriv inn ny tekst');
}