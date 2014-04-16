/**
 * @author Terje Hopsø
 *
 * Contains code for database handling
 */

//  ********************************************
//  Opprett og initier tabell Sikter
//  ********************************************
function initierTabellSikte(tx) {
   console.log("initierTabellSikte");
   try {
      tableExists(tx, "SIKTE", function() {
         log("Opprett tabell SIKTE");
         tx.executeSql('CREATE TABLE IF NOT EXISTS SIKTE (id unique, navn, gjenge, antKnepp)', undefined, function() {
            console.log("Create table sikte success ...");
         }, function() {
            console.log("Create table sikte failed ... ");
         });
         tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (1, "Busk Standard", 1.0, 12)');
         tx.executeSql('INSERT INTO SIKTE (id, navn, gjenge, antKnepp) VALUES (2, "Busk Finknepp", 1.0, 24)');
      }, function() {
         log("Table SIKTE found");
      });
   } catch(err) {
      alert("initierTabellSikte: " + err.message);
   }
}

//  ********************************************
//  Opprett og initier tabell Kuler
//  ********************************************
function initierTabellKule(tx) {
   console.log("initierTabellKule");
   try {
      tableExists(tx, "KULE", function() {
         tx.executeSql('CREATE TABLE IF NOT EXISTS KULE (id unique, navn, balC)');
         tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (1, "Lapua 108gr 6.6mm", .60)');
         tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (2, "Sierra 109gr 6.5mm", .61)');
         tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (3, "Sierra 123gr 6.5mm", .62)');
         tx.executeSql('INSERT INTO KULE (id, navn, balC) VALUES (4, "Sierra 144gr 6.5mm", .63)');
      }, function() {
         log("Table KULE found");
      });
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
      tableExists(tx, "VAAPEN", function() {
         tx.executeSql('CREATE TABLE IF NOT EXISTS VAAPEN (id unique, navn, kuleId, sikteId)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (1, "Terje FeltSauer", 2, 1)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (2, "Terje BaneSauer", 1, 1)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (3, "Stian Sauer", 2, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (4, "Våpen 4 Sauer", 3, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (5, "Våpen 5 Sauer", 3, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (6, "Våpen 6 Sauer", 3, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (7, "Våpen 7 Sauer", 3, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (8, "Våpen 8 Sauer", 3, 2)');
         tx.executeSql('INSERT INTO VAAPEN (id, navn, kuleId, sikteId) VALUES (9, "Våpen 9 Sauer", 3, 2)');
      }, function() {
         log("Table VAAPEN found");
      });
   } catch (err) {
      alert("initierTabellVaapen: " + err.message);
   }
}

// **********************************************
// Reset all tables
// **********************************************
function dropAllTables(tx) {
   console.log("dropAllTables");
   try {
      tx.executeSql('DROP TABLE IF EXISTS SIKTE');
      tx.executeSql('DROP TABLE IF EXISTS KULE');
      tx.executeSql('DROP TABLE IF EXISTS VAAPEN');
   } catch(err) {
      alert("dropAllTables: " + err);
   }
}

function error(transaction, err) {
   alert("DB error : " + err.message);
   return false;
}

// **********************************************
// Check if table exists
// **********************************************
function tableExists(tx, name, missingTable, foundTable) {
   try {
      tx.executeSql("SELECT count(*) ant FROM sqlite_master WHERE type='table' and name='" + name + "';", undefined, function(tx, res) {
         (res.rows.item(0).ant == 1) ? foundTable() : missingTable();
      });
   } catch(err) {
      alert("tableExists error: " + err);
   }
}

//  ********************************************
//  Transaction error callback
//  ********************************************
function DbErrorHandler(err) {
   console.log("DbErrorHandler");
   console.log("Error processing SQL: " + err.message);
}

function testing(tx) {
   log("line1");
   te(tx, "SIKTE", function() {
      return;
   }, function() {
      log("te: feil");
   });
}

function t1() {
   log("line2");
}

function te(tx, name, ok, feil) {
   log("te");
   try {
      tx.executeSql("SELECT count(*) ant FROM sqlite_master WHERE type='table' and name='" + name + "';", undefined, function(tx, res) {
         if (res.rows.item(0).ant == 1)
            ok();
         else
            feil();
      });
   } catch(err) {
      alert("tableExists error: " + err);
   }
}
