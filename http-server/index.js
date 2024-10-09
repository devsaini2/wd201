/*const fs = require("fs");
fs.writeFile(
    "sample.txt",
    "Hello World. Welcome to Node.js File System module.",
    (err) => {
      if (err) throw err;
      console.log("File created!");
    }
  );
  fs.readFile("sample.txt", (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });
  //appendFile() to add more content to the file already created
  fs.appendFile("sample.txt", " This is my updated content", (err) => {
    if (err) throw err;
    console.log("File updated!");
  });
  //rename() to rename an existing file.
  fs.rename("sample.txt", "test.txt", (err) => {
    if (err) throw err;
    console.log("File name updated!");
  });
  //the unlink() to delete the files in the file system.
  fs.unlink("test.txt", (err) => {
  if (err) throw err;
  console.log("File test.txt deleted successfully!");
});*/
/*const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) =>{
    const stream = fs.createReadStream("sample.txt");
    stream.pipe(res);
    //fs.readFile("sample.txt", (err, data) =>{
 //       res.end(data);
  //  })
});
server.listen(3000);*/
/*const http = require("http");
const fs = require("fs");

fs.readFile("home.html", (err, home) => {
  console.log(home.toString());
});

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  http
    .createServer((request, response) => {
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(home);
      response.end();
    })
    .listen(3000);
});*/
const args = require("minimist")(process.argv.slice(2));
const a = parseInt(args.port);

const http = require("http");
const fs = require("fs");

let projectContent = "";
let homeContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});
fs.readFile("registration.html", (err, project) => {
  if (err) {
    throw err;
  }
  registrationContent = registration;
});

http.createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
        case "/registration":
        response.write(registrationContent);
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(a);