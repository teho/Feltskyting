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
