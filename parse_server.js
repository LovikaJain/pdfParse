var Hapi = require('hapi');
var fs = require('fs');
// var pdf = require('pdf.js');
// var script = require('../pdfjs/script.js');

var server = new Hapi.Server();
server.connection({host: 'localhost', port: Number(process.argv[2] || 8080)});

server.route({
    method: 'POST',
    path: '/submit',
    config: {

        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },

        handler: function (request, reply) {
            var data = request.payload;
            if (data.file) {
                    var name = data.file.hapi.filename;
                    console.log(name);
                    var ext = name.split('.');
                    var extension = ext[1];
                    if(extension == "pdf"){
                        var path = __dirname + "/uploads/" + name;
                        checkFileExist();
                        var file = fs.createWriteStream(path);
                        file.on('error', function (err) { 
                            console.error(err) 
                        });
                        data.file.pipe(file);
                        data.file.on('end', function (err) { 
                        var ret = {
                            filename: data.file.hapi.filename,
                            headers: data.file.hapi.headers
                        }
                        reply(JSON.stringify(ret));
                    })
                    }
                    else{
                        console.log("Invalid fileType");
                        reply(JSON.stringify("Invalid FileType"));
                    }         
            }
        }    
    }
});

var checkFileExist = function() {
    var Path = __dirname + '/uploads'
    fs.exists(Path, function(exists) {
        console.log(Path)
        if (exists === false) fs.mkdirSync(Path);
    });
};

server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});