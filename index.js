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
        switch (choice) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Quit":
                process.exit()
            default:
                process.exit()
        }
        // WHEN I choose to add an employee 
        // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    })
}


function viewAllEmployees() {
    db.findAllEmployees().then(([data]) => {
        console.table(data)
    }).then(() => initialPrompt());
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please enter employees First Name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "Please enter employees Last Name?"
        },
        {
            type: "list",
            name: "role",
            message: "Please enter employees Role?",
            choices: [1, 2]
        },
        {
            type: "list",
            name: "manager",
            message: "Please enter employees First Name?",
            choices: [1, 2]
        }
    ]).then((data) => {
        console.log(data);
        db.newEmployee().then(() => {
            console.log(`\n You just added ${data.firstName} ${data.lastName} to database.`);
            initialPrompt();
        })
    })
}

init();