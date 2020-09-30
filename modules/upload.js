'use strict';
const formidable = require('formidable'),
    fs = require('fs'),
    path = require('path')

module.exports = function Upload(req,res) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFieldsSize = 1024;
    form.uploadDir = path.join(__dirname, '../uploads/avatars');
    //Se dispara cuando el archivo llegó al servidor.
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });
    //Se dispara antes de guardar el archivo.
    form.on('fileBegin', function (field, file) {
        if (file.name) {
            file.path += '_' + file.name;
        }
    });
    // log any errors that occur
    form.on('error', function (err) {
        console.log(`\x1b[31m An error has occured:\n \x1b[37m ${err}`);
    });
    //Se dispara una vez que los archivos fueron guardados.
    form.on('end', function () {
        res.end('success');
    });
    // parse the incoming request containing the form data
    form.parse(req)
}