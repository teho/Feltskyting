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
      tableExists(tx, "sikte", function() {
         tx.executeSql('create table if not exists sikte (id unique, navn, gjenge, antKnepp)');
         tx.executeSql('insert into sikte (id, navn, gjenge, antKnepp) values (1, "Busk Standard", 1.0, 12)');
         tx.executeSql('insert into sikte (id, navn, gjenge, antKnepp) values (2, "Busk Finknepp", 1.0, 24)');
      }, function() {
         return;
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
      tableExists(tx, "kule", function() {
         tx.executeSql('create table if not exists kule (id unique, navn, balC)');
         tx.executeSql('insert into kule (id, navn, balC) values (1, "Lapua 108gr 6.6mm", .60)');
         tx.executeSql('insert into kule (id, navn, balC) values (2, "Sierra 109gr 6.5mm", .61)');
         tx.executeSql('insert into kule (id, navn, balC) values (3, "Sierra 123gr 6.5mm", .62)');
         tx.executeSql('insert into kule (id, navn, balC) values (4, "Sierra 144gr 6.5mm", .63)');
      }, function() {
         return;
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
      tableExists(tx, "vaapen", function() {
         tx.executeSql('create table if not exists vaapen (id unique, navn, kuleId, sikteId)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (1, "FeltSauer", 2, 1)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (2, "BaneSauer", 1, 1)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (3, "Stian Sauer", 2, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (4, "Våpen 4 Sauer", 3, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (5, "Våpen 5 Sauer", 3, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (6, "Våpen 6 Sauer", 3, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (7, "Våpen 7 Sauer", 3, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (8, "Våpen 8 Sauer", 3, 2)');
         tx.executeSql('insert into vaapen (id, navn, kuleId, sikteId) values (9, "Våpen 9 Sauer", 3, 2)');
      }, function() {
         return;
      });
   } catch (err) {
      alert("initierTabellVaapen: " + err.message);
   }
}

// **********************************************
// Init last table for last used data
// **********************************************
function initierTabellcurrentRecord(tx) {
   console.log("initierTabellcurrentRecord");
   // tx.executeSql('drop table if exists currentRecord');
   try {
      tableExists(tx, "currentRecord", function() {
         console.log("Oppretter ny currentRecord");
         tx.executeSql('create table currentRecord (vaapenId, vaapenName)');
         tx.executeSql('insert into currentRecord (vaapenId, vaapenName) values (1, "FeltSauer")');
      }, function() {
         console.log("currentRecord already exists");
         return;
      });
   } catch (err) {
      alert("initierTabellcurrentRecord" + err.message);
   }
}

// **********************************************
// Reset all tables
// **********************************************
function dropAllTables(tx) {
   console.log("dropAllTables");
   try {
      tx.executeSql('drop table if exists sikte');
      tx.executeSql('drop table if exists kule');
      tx.executeSql('drop table if exists vaapen');
      tx.executeSql('drop table if exists currentRecord');
   } catch(err) {
      alert("dropAllTables: " + err);
   }
}

// **********************************************
// Get current record
// **********************************************
function getCurrentRecord() {
   try {
      db.transaction(function(tx) {
         console.log("getCurrentRecord");
         tx.executeSql('select * from currentRecord', undefined, function(tx, res) {
            currentRecord.vaapenId = res.rows.item(0).vaapenId;
            currentRecord.vaapenName = res.rows.item(0).vaapenName;
            console.log(currentRecord.vaapenId);
            console.log(currentRecord.vaapenName);
         });
      });
   } catch(err) {
      alert("getCurrentRecord: " + err.message);
   }
}

// **********************************************
// Update current record
// **********************************************
function updateCurrentRecord() {
   try {
      db.transaction(function(tx) {
         console.log("updateCurrentRecord");
         tx.executeSql('delete from currentRecord');
         tx.executeSql('insert into currentRecord (vaapenId, vaapenName) values (?, ?);', [currentRecord.vaapenId, currentRecord.vaapenName], undefined, DbErrorHandler);
         console.log("updateCurrentRecord stored");
      });
   } catch(err) {
      alert("updateCurrentRecord: " + err.message);
   }
}

// **********************************************
// Error
// **********************************************
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
