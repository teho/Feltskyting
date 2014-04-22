//
// Feltskyting - Javascript rutiner
//
// **************************
// Globale variable
// **************************

var db;
var isVaapenOppsettLoaded = false;
var vaapenSelectedId;

var currentRecord = {
   vaapenId : null,
   vaapenName : null
};

console.log("\n\n\n************** Starting application **************");

//  =========================================
//  = Wait for device API libraries to load =
//  =========================================
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
   // db.transaction(initierDatabase, DbErrorHandler, initierDropDowns);
   /*
    * Initier dropdowns og hent sist brukte våpen
    */
   initierDropDowns();
   // getCurrentRecord();
}

//  =================
//  = WINDOW EVENTS =
//  =================

//  ==================
//  = onBeforeUnload =
//  ==================
window.onBeforeUnload = function() {
   console.log("window.onBeforeUnload");
};

//  ============
//  = onUnload =
//  ============
window.onUnload = function() {
   console.log("window.onUnload");
};

//  ====================
//  = addEventListener =
//  ====================
document.addEventListener("resume", onResume, false);
function onResume() {
   console.log("Resume event");
};

//  =========
//  = pause =
//  =========
document.addEventListener("pause", onPause, false);
function onPause() {
   console.log("Pause event");
   // updateCurrentRecord();
};

//  ====================
//  = Parameter endret =
//  ====================
function parameterEndring(obj) {
   vaapenSelectedId = $(obj).prop('selectedIndex');
   // Selected index!!!!!
   console.log(vaapenSelectedId);
   console.log("parameterEndring: " + $(obj).val(3).text(3));
   console.log(obj.options[obj.selectedIndex].innerHTML);
}

//  ======================================
//  = Oppdater Dropdown fra resultatsett =
//  ======================================
function oppdaterSelect(tx, res, selId) {
   var rec, i;
   /*
    * Løp gjennom resultatene og legg til elementer til dropdown
    */
   for ( i = 0; i < res.rows.length; i++) {
      rec = res.rows.item(i);
      $(selId).append($("<option />").val(rec.id).text(rec.navn));
   };
   /*
    * Sett fokus på første element (index 0 er første) og oppdater skjerm
    */
   $(selId).prop('selectedIndex', 0).selectmenu('refresh');
}

//  ======================================
//  = Oppdater ListView fra resultatsett =
//  ======================================
function oppdaterListView(tx, res, selId) {
   console.log("oppdaterListView");
   var rec, i;
   /*
    * Løp gjennom resultatene og fyll opp listview
    */
   for ( i = 0; i < res.rows.length; i++) {
      rec = res.rows.item(i);
      $(selId).append($("<li/>").append($("<a/>", {
         "href" : "#",
         "text" : rec.navn
      })));
   };
}

//  =================
//  = Initier Liste =
//  =================
function initierListe(tx, tbl, selId, fOppdater) {
   console.log("initierListe: " + selId);
   tx.executeSql('select id, navn from ' + tbl + " order by navn", [], function(tx, res) {
      fOppdater(tx, res, selId);
   }, DbErrorHandler);
}

//  ====================
//  = Initier DropDown =
//  ====================
function initierDropDown(tbl, selId) {
   // Fyll inn dropdown
   db.transaction(function(tx) {
      initierListe(tx, tbl, selId, oppdaterSelect);
   }, DbErrorHandler);
}

//  ====================
//  = Initier ListView =
//  ====================
function initierListView(tbl, selId) {
   // Fyll inn listView
   db.transaction(function(tx) {
      initierListe(tx, tbl, selId, oppdaterListView);
   }, DbErrorHandler);
}

//  ===============================================
//  = Initier Objects (dropdowns, listview, etc.) =
//  ===============================================
function initierDropDowns() {
   console.log("initierDropDowns");
   // Fyll inn dropdown for våpen
   initierDropDown("vaapen", "#selectVaapen");
   initierListView("vaapen", "#vaapenList");

}

//  =========================
//  = Populate the database =
//  =========================
function initierDatabase(tx) {
   console.log("initierDatabase");
   dropAllTables(tx);
   initierTabellSikte(tx);
   initierTabellKule(tx);
   initierTabellVaapen(tx);
   // initierTabellcurrentRecord(tx);
   /*
   * For some reasons a new transaction must be made
   * to be able to get current record without fail
   */
   //db.transaction(function(tx) {
   //   getCurrentRecord(tx);
   // });

}

//  =======================================================
//  = EVENT HANDLERS =
//  =======================================================

$(function() {

   //  ============================
   //  = HOVEDSIDE EVENT HANDLERS =
   //  ============================
   $('#hovedside').on('pagebeforeshow', function() {
      console.log("hovedside: pagebeforeshow");
   });

   //  ============
   //  = pageshow =
   //  ============
   $('#hovedside').on('pageshow', function() {
      console.log("hovedside: pageshow");
      /*
      * Find id of vaapenName in current record
      */
      // vaapenSelectedId = getIdOfCurrentRecord("#selectVaapen option");
      /*
       * set the current vaapen as selected in the dropdown
       */
      $("#selectVaapen").prop('selectedIndex', vaapenSelectedId).selectmenu('refresh');
   });

   //  ==================
   //  = pagebeforehide =
   //  ==================
   $('#hovedside').on('pagebeforehide', function() {
      /*
       * find the id of the selected element in the dropdown
       */
      vaapenSelectedId = $("#selectVaapen option:selected").closest("option").index();
   });

   //  ==========
   //  = change =
   //  ==========
   $("#selectVaapen").on('change', function() {
      console.log("hovedside: change");
      console.log($("#selectVaapen option:selected").closest("option").index());
      console.log($(this).val());
      console.log($("#selectVaapen option:selected").text());
   });
   //  =========
   //  = click =
   //  =========
   /*   $('#hovedside').on('click', function() {
   console.log($(".main-page").html());
   });
   */
   //  ================================
   //  = VAAPENOPPSETT EVENT HANDLERS =
   //  ================================

   //  ==================
   //  = pagebeforeshow =
   //  ==================
   $('#vaapenOppsett').on('pagebeforeshow', function() {
      /*
       * load dropdown first time page is show
       */
      if (!isVaapenOppsettLoaded) {
         initierDropDown("kule", $("#selectKule"));
         initierDropDown("sikte", $("#selectSikte"));
         isVaapenOppsettLoaded = true;
      }
   });

   //  ============
   //  = pageshow =
   //  ============
   $('#vaapenOppsett').on('pageshow', function() {
      console.log("vaapenOppsett.pageshow");
      vo_setActiveElement("#vaapenList li a:eq(" + vaapenSelectedId + ")");
      $("#vaapenList").scrollTop($("#vaapenList li:eq(" + vaapenSelectedId + ")").position().top - $("#vaapenList li:eq(0)").position().top);
   });

   //  ==================
   //  = pagebeforehide =
   //  ==================
   $('#vaapenOppsett').on('pagebeforehide', function() {
      console.log("vaapenOppsett: pagebeforehide");
   });

   //  ===========
   //  = taphold =
   //  ===========
   // $("#selectVaapen-button").bind('taphold', function(event) {
   // console.log("tapholdHandler");
   // $.mobile.changePage("#vaapenOppsett", {
   // transition : "none"
   // });
   // });

   //  =========
   //  = click =
   //  =========
   $(document).on('click', "#vaapenList li a", function() {
      console.log("#vaapenList li a : click event");
      vo_setActiveElement(this);
      /*
       *  find the id of the element in the listview
       */
      vaapenSelectedId = $(this).closest("li").index();
   });

   //  =============================
   //  = VAAPENEDIT EVENT HANDLERS =
   //  =============================

   //  ==================
   //  = pagebeforeshow =
   //  ==================
   $('#vaapenEdit').on('pagebeforeshow', function() {
      console.log("vaapenEdit: pagebeforeshow");
   });

   //  ==================
   //  = pagebeforehide =
   //  ==================
   $('#vaapenEdit').on('pagebeforehide', function() {
      console.log("vaapenEdit: pagebeforehide");
   });

   //  ===========
   //  = taphold =
   //  ===========
   //   $("#vaapenList").bind('taphold', function(event) {
   //      console.log("tapholdHandler");
   //      $.mobile.changePage("#vaapenEdit", {
   //         transition : "slide"
   //      });
   //   });
});

// ###########################################################################
//                                  VAAPENOPPSETT FUNCTIONS
// ###########################################################################

// ============================
// Set Active element in list
// ============================
//function vo_setActiveElement(lv, elem) {
function vo_setActiveElement(elem) {
   console.log("vo_setActiveElement called");
   $("#vaapenList li a").removeClass('ui-btn-icon-right vaapenListSelected');
   $(elem).addClass('ui-btn-icon-right vaapenListSelected');
}

//  =============================================
//  = Get id of vaapenName in a select/listview
//  =============================================
function getIdOfCurrentRecord(list) {
   var ant = 0;
   console.log("Searching:" + currentRecord.vaapenName + ":");
   console.log("antall elementer: " + $(list).length);
   $(list).each(function() {
      console.log(ant + ": " + $(this).val() + ":" + $(this).text() + ":");
      if (currentRecord.vaapenName == $(this).text())
         return false;
      ++ant;
   });
   console.log(ant + " found");
   return ($(list).length == ant) ? 0 : ant;
}

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