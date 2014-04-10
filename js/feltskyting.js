//
// Feltskyting - Javascript rutiner
//
// **************************
// Globale variable
// **************************

var db;
var isVaapenOppsettLoaded = false;

function log(text) {
   console.log(text);
}

log("\n\n\n************** Starting application **************");

//  ********************************************
//  Wait for device API libraries to load
//  ********************************************
document.addEventListener("deviceready", onDeviceReady, false);

//  ********************************************
//  onDeviceReady - Device is ready for use
//  ********************************************
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
};

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
      selId.append($("<li/>").append($("<a/>", {
         "href" : "#",
         "text" : rec.navn
      })));
   };
}

//  ********************************************
//  Initier Liste
//  ********************************************
function initierListe(tx, tbl, selId, fOppdater) {
   console.log("initierListe: " + tbl);
   tx.executeSql('SELECT id, navn FROM ' + tbl + " order by navn", [], function(tx, res) {
      fOppdater(tx, res, selId);
   }, DbErrorHandler);
}

//  ********************************************
//  Initier DropDown
//  ********************************************
function initierDropDown(tbl, selId) {
   // Fyll inn dropdown
   db.transaction(function(tx) {
      initierListe(tx, tbl, selId, oppdaterSelect);
   }, DbErrorHandler);
}

//  ********************************************
//  Initier ListView
//  ********************************************
function initierListView(tbl, selId) {
   // Fyll inn listView
   db.transaction(function(tx) {
      initierListe(tx, tbl, selId, oppdaterListView);
   }, DbErrorHandler);
}

//  ********************************************
//  Initier Objects (dropdowns, listview, etc.)
//  ********************************************
function initierDropDowns() {
   console.log("initierDropDowns");
   // Fyll inn dropdown for våpen
   initierDropDown("VAAPEN", $("#selectVaapen"));
   initierListView("VAAPEN", $("#vaapenList"));

}

//  ********************************************
//  Populate the database
//  ********************************************
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

// ***************************************
// Set Active element in list
// ***************************************
function vo_setActiveElement(lv, elem) {
   console.log("vo_setActiveElement called");
   $(lv).removeClass('ui-btn-icon-right ui-icon-check vaapenListSelected');
   $(elem).addClass('ui-btn-icon-right ui-icon-check vaapenListSelected');
}

$(function() {
   //  ********************************************
   //  hovedside event handlers
   //  ********************************************
   $('#hovedside').on('pagebeforeshow', function() {
      log("hovedside: pagebeforeshow");
   });
   $('#hovedside').on('pagebeforehide', function() {
      log("hovedside: pagebeforehide");
   });
   //  ********************************************
   //  vaapenOppsett event handlers
   //  ********************************************
   $('#vaapenOppsett').on('pagebeforeshow', function() {
      console.log("vaapenOppsett: pagebeforeshow");
      if (!isVaapenOppsettLoaded) {
         initierDropDown("KULE", $("#selectKule"));
         isVaapenOppsettLoaded = true;
      }
      // start ----------------------------------- finn valgt våpen
      console.log("Forsøk å finne valgte våpen fra hovedside");
      console.log($("#selectVaapen option:selected").text());
      // console.log($("#selectVaapen").html());
      var exists = false;
      $('#vaapenList li a').each(function() {
         if (this.text == $("#selectVaapen option:selected").text()) {
            console.log("Yes!!!  Vi fant den.");
            console.log(this.text);
            console.log(this.value);
            exists = true;
            vo_setActiveElement("#vaapenList li a", this);
            return false;
         }
      });
      // ferdig ----------------------------------- finn valgt våpen
   });
   $('#vaapenOppsett').on('pagebeforehide', function() {
      console.log("vaapenOppsett: pagebeforehide");
   });

   //  Tap and Hold
   $("#selectVaapen-button").bind('taphold', function(event) {
      console.log("tapholdHandler");
      $.mobile.changePage("#vaapenOppsett", {
         transition : "none"
      });
   });

   //  vaapenListClick
   $(document).on('click', "#vaapenList li a", function() {
      console.log("#vaapenList li a : click event");
      vo_setActiveElement("#vaapenList li a", this);
      // Remove icon and background from active selection
      // $("#vaapenList li a").removeClass('ui-btn-icon-right ui-icon-check vaapenListSelected');
      // Add icon and background for new active selection
      // $(this).addClass('ui-btn-icon-right ui-icon-check vaapenListSelected');
      activeVaapen = $(this).text();
   });
   //  ********************************************
   //  vaapenEdit event handlers
   //  ********************************************
   $('#vaapenEdit').on('pagebeforeshow', function() {
      log("vaapenEdit: pagebeforeshow");
   });
   $('#vaapenEdit').on('pagebeforehide', function() {
      log("vaapenEdit: pagebeforehide");
   });
   //  Tap and Hold
   $("#vaapenList").bind('taphold', function(event) {
      console.log("tapholdHandler");
      $.mobile.changePage("#vaapenEdit", {
         transition : "slide"
      });
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