// GIVEN a command-line application that accepts user input
const inquirer = require('inquirer');
const db = require('./db');
require('console.table');

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function init() {
    initialPrompt();
}

function initialPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "whatToDo",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
        }
    ]).then((data) => {
        let choice = data.whatToDo;
        switch(choice){
            case "View All Employees":
            viewAllEmployees();
            break;
            default:
                process.exit()
        }
    })
}


function viewAllEmployees(){
    db.findAllEmployees().then((data)=>{
        console.table(data)
    }).then(()=>initialPrompt());
}

init();