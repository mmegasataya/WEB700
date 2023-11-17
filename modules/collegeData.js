const courses = require("../data/courses.json");
const students = require("../data/students.json");

class Data {
    students;
    courses;
    
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
    
}

var dataCollection = null;

function initialize () {
    return new Promise((res, rej)=>{
        dataCollection = new Data(students, courses);
        if(dataCollection != null){
            res("Operation was a success");
        } else {
            rej("Initialization is NOT a success");
        }
    });
}

function getAllStudents () {
    return new Promise((res2, rej2)=>{
        if(dataCollection?.students == null || dataCollection?.students.length == 0){
            rej2("no results");
        } else {
            res2(dataCollection.students);
        }
    });
}

function getCourses () {
    return new Promise((res4, rej4)=>{
        if(dataCollection?.courses == null || dataCollection?.courses.length == 0){
            rej4("no results");
        } else {
            res4(dataCollection.courses);
        }
    });
}

function getStudentsByCourse (course) {
    return new Promise((res5, rej5)=>{
        if(course == null || course == "" || dataCollection?.students == null || dataCollection?.students.length == 0){
            rej5("no results");
        } else {
            const filteredCoursesArr = dataCollection.students.filter(student => student.course == course);
            
            if(filteredCoursesArr == null || filteredCoursesArr == 0){
                rej5("no results");
            } else {
                res5(filteredCoursesArr);
            }
        }
    });
}

function getStudentsByNum (num) {
    return new Promise((res6, rej6)=>{
        if(dataCollection?.students == null || dataCollection?.students.length == 0){
            rej6("no results");
        } else {
         
            const filteredStudentsArrByNum = dataCollection.students.filter(student => student.studentNum == num);

            if(filteredStudentsArrByNum.length == 0){
                rej6("no results");
            } else {
                res6(filteredStudentsArrByNum[0]);
            }
        }
    });
}

function addStudent (studentData) {
    // function must return a promise
    return new Promise((res7, rej7)=>{
        try{
            let studentObj = {
                "studentNum": dataCollection.students?.length + 1,
                "firstName": studentData?.firstName,
                "lastName": studentData?.lastName,
                "email": studentData?.email,
                "addressStreet": studentData?.addressStreet,
                "addressCity": studentData?.addressCity,
                "addressProvince": studentData?.addressProvince,
                "TA": studentData?.TA ? studentData.TA : false, // Default is false when null or undefined
                "status": studentData?.status ? studentData.status : "Full Time", // Default is Full Time when null or undefined
                "course": studentData?.course
            }
            dataCollection.students.push(studentObj);
            res7();
        } catch(err) {
            rej7(err);
        }
    });
}

function getCourseById (courseCode) {
    return new Promise((res8, rej8)=>{
        if(dataCollection?.courses == null || dataCollection?.courses.length == 0){
            rej8("no results");
        } else {

             const filteredCoursesByCode = dataCollection.courses.filter(course => course.courseCode == courseCode);

            if(filteredCoursesByCode.length == 0){
                rej8("no results");
            } else {
                res8(filteredCoursesByCode[0]);
            }
        }
    });
}

function updateStudent (studentData) {
    return new Promise((res9, rej9)=>{
        if(dataCollection?.students == null || dataCollection?.students.length == 0){
            rej9("no results");
        } else {

            const foundIndex = dataCollection.students.findIndex((el)=>{ return el.studentNum == studentData.studentNum});

            if(foundIndex >= 0 && dataCollection?.students[foundIndex]){
                dataCollection.students[foundIndex] = studentData;
                dataCollection.students[foundIndex].TA = studentData.TA ? true : false; // : Do not forget to correctly handle the "TA" checkbox data
            }

            res9();
        }
    });
}

module.exports = {initialize, getAllStudents, getCourses, getStudentsByCourse, getStudentsByNum, addStudent, getCourseById, updateStudent};
