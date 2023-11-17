/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Marvie Maria E Gasataya Student     ID: 133055228     Date: Nov 16, 2023
*
* Online (Cyclic) Link: 
*
********************************************************************************/


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require("express-handlebars");
var path = require("path");
var collegeData = require("./modules/collegeData.js");
var app = express();

// Configure handlebars
app.engine('.hbs', exphbs.engine({
    extname:'.hbs',
    helpers: {
        navLink: function(url, options){
            return `<li class="nav-item">
            <a class="nav-link ${url == app.locals.activeRoute ? "active" : "" }"
            href="${url}">${options.fn(this)}</a>
            </li>`;
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        },
           
    }
}));
app.set('view engine', '.hbs');

// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

// adds activeRoute property your app.locals
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/,"") : route.replace(/\/(.*)/,""));
    next();
})

app.get("/students", (req, res) => {
    if(req.query.course){
        collegeData.getStudentsByCourse(req.query.course)
        .then((colDataRes)=>{
            res.render("students",{layout:"main", students: colDataRes});
        })
        .catch((colDataErr)=>{
            res.render("students",{layout:"main", message: colDataErr});
        });
    } else {
        collegeData.getAllStudents()
        .then((colDataRes)=>{
            res.render("students",{layout:"main", students: colDataRes});
        })
        .catch((colDataErr)=>{
            res.render("students",{layout:"main", message: colDataErr});
        });
    }
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
    .then((colDataRes)=>{
        res.render("courses",{layout:"main", courses: colDataRes});
    })
    .catch((colDataErr)=>{
        res.render("courses",{layout:"main", message: colDataErr});
    });
});

app.get("/course/:code", (req, res) => {
    collegeData.getCourseById(req.params.code)
    .then((colDataRes)=>{
        res.render("course",{layout:"main", course: colDataRes});
    })
    .catch((colDataErr)=>{
        res.render("courses",{layout:"main", message: colDataErr});
    });
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentsByNum(req.params.num)
    .then((colDataRes)=>{
        res.render("student",{layout:"main", student: colDataRes});
    })
    .catch((colDataErr)=>{
        res.render("student",{layout:"main", message: colDataErr});
    });
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
    .then((colDataRes)=>{
        res.redirect("/students/");
    })
    .catch((colDataErr)=>{
        res.send({message: colDataErr});
    });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
    .then((colDataRes)=>{
        res.redirect("/students/");
    })
    .catch((colDataErr)=>{
        res.send({message: colDataErr});
    });
});

app.get("/", (req, res) => {
    res.render("home",{layout:"main"});
});

app.get("/about", (req, res) => {
    res.render("about",{layout:"main"});
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo",{layout:"main"});
});

app.get("/students/add", (req, res) => {
    res.render("addStudent",{layout:"main"});
});

// No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

collegeData.initialize()
.then((result)=>{
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on port: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
})

