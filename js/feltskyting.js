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
function oppdaterSelect(tx, res, selId) {
	console.log("oppdaterSelect");
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
//  Oppdater ListView fra resultatsett
// 	********************************************
function oppdaterListView(tx, res, selId) {
	console.log("oppdaterListView");
	var rec, i;

	// Løp gjennom resultatene og fyll opp listen
	for ( i = 0; i < res.rows.length; i++) {
		rec = res.rows.item(i);
		// selId.append($("<li>test</li>"));
		//		selId.append($("<li/>").val(rec.id).text(rec.navn));			// OK, lage <li><a>xxx</a></li>  mangler href

		selId.append($("<li/>").append($('<a/>', {
			'href' : 'test.html',
			'text' : 'hello'
		})));

		// selId.append($("<li/>", {
		// 'data-role' : "list-divider"
		// }).append($('<a/>', {
		// 'href' : '#',
		// 'text' : 'hello'
		// })));

	};

	// $('ul').append($('<li/>', {    //here appending `<li>`
	//    'data-role': "list-divider"
	//	}).append($('<a/>', {    //here appending `<a>` into `<li>`
	//    'href': 'test.html',
	//    'data-transition': 'slide',
	//    'text': 'hello'
	//   })));

	// Sett fokus på første element (index 0 er første) og oppdater skjerm
	// selId.prop('selectedIndex', 0).selectmenu('refresh');
	console.log(" ***************************");
	console.log($("#vaapenList").html());
	console.log(" ***************************");
}

//  ********************************************
//  Initier Liste
// 	********************************************
function initierListe(tx, tbl, selId, fOppdater) {
	console.log("initierListe: " + tbl);
	tx.executeSql('SELECT id, navn FROM ' + tbl + " order by navn", [], function(tx, res) {
		fOppdater(tx, res, selId);
	}, DbErrorHandler);
}

//  ********************************************
//  Initier DropDown
// 	********************************************
function initierDropDown(tbl, selId) {
	// Fyll inn dropdown
	db.transaction(function(tx) {
		initierListe(tx, tbl, selId, oppdaterSelect);
	}, DbErrorHandler);
}

//  ********************************************
//  Initier ListView
// 	********************************************
function initierListView(tbl, selId) {
	// Fyll inn listView
	db.transaction(function(tx) {
		initierListe(tx, tbl, selId, oppdaterListView);
	}, DbErrorHandler);
}

//  ********************************************
//  Initier Objects (dropdowns, listview, etc.)
// 	********************************************
function initierDropDowns() {
	console.log("initierDropDowns");
	// Fyll inn dropdown for våpen
	initierDropDown("VAAPEN", $("#selectVaapen"));
	initierListView("VAAPEN", $("#vaapenList"));
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
			initierDropDown("KULE", $("#selectKule"));
			isVaapenOppsettLoaded = true;
			console.log("\tloaded KULE");
		}
		// console.log($("#selectVaapen").html());
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
		$("#vaapenList li").removeClass('ui-btn-icon-right ui-icon-check');
		// Remove active icon, removes for all items
		$(this).addClass('ui-btn-icon-right ui-icon-check');
		activeVaapen = $(this).find("a").text();
		console.log($("#selectVaapen option:selected").text());
		// The value of the selected value in selectVaapen
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