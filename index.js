// GIVEN a command-line application that accepts user input
const inquirer = require('inquirer');
const db = require('./db');
const figlet = require('figlet');
const { getEmployees, getRoles } = require('./db');
require('console.table');

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function init() {
    // openingBanner();
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
        db.newEmployee(data).then(() => {
            console.log(`\n You just added ${data.firstName} ${data.lastName} to database. \n`);
            initialPrompt();
        })
    })
}

function updateEmployeeRole() {
    let names = []
    let roles = []
    let i =;

    db.getEmployees().then(([data]) => {
        // console.log(data);
        const firstName = Object.keys(data[0])[1];
        const lastName = Object.keys(data[0])[2];

        for (let i = 0; i < data.length; i++) {
            let name = [data[i][firstName], data[i][lastName]].join(" ");
            // console.log(name);
            names.push(name)
        }
        // console.log(names);
        // console.log(employeeOptions);
        return names
    }).then(() => {
        db.getRoles().then(([data]) => {
            const title = Object.keys(data[0])[1];

            for (let i = 0; i < data.length; i++) {
                roles.push(data[i][title])
            }
            // console.log(roles);
            // console.log(names);
            return roles
        })
    }).then(() => {
        inquirer.prompt([
            {
                type: "list",
                name: "employeeList",
                message: "Please select which employee you would like to update?",
                choices: names
            },
            {
                type: "list",
                name: "roleOptions",
                message: "Please select employees New Role?",
                choices: roles
            }
        ]).then((data) => {
            // console.log(data)
            indexOf(roles, data.roleOptions);
            function indexOf(array, value) {
                for (let i = 0; i < array.length; i++) {
                    if (array[i] === value) {
                        console.log(i);
                        return i;
                    }
                }
            }
        })
    })

}

// const updateEmployeeRole = async () => {
//     let names = []
//     let roles = []

//     const employeeOptions = () => {
//         db.getEmployees().then(([data]) => {
//             // console.log(data);
//             const firstName = Object.keys(data[0])[1];
//             const lastName = Object.keys(data[0])[2];

//             for (let i = 0; i < data.length; i++) {
//                 let name = [data[i][firstName], data[i][lastName]].join(" ");
//                 // console.log(name);
//                 names.push(name)
//             }
//             // console.log(names);
//             // console.log(employeeOptions);
//             return names
//         })
//     }

//     const roleOptions = () => {
//         db.getRoles().then(([data]) => {
//             const title = Object.keys(data[0])[1];

//             for (let i = 0; i < data.length; i++) {
//                 roles.push(data[i][title])
//             }
//             // console.log(roles);
//             // console.log(names);
//             return roles
//         })
//     }

//     const runPrompt = (names, roles) => {
//         return inquirer.prompt([
//             {
//                 type: "list",
//                 name: "employeeList",
//                 message: "Please select which employee you would like to update?",
//                 choices: names
//             },
//             {
//                 type: "list",
//                 name: "roleOptions",
//                 message: "Please select employees New Role?",
//                 choices: roles
//             }
//         ]).then((data) => {
//             console.log(data);
//         })
//     }
// }



function openingBanner() {
    figlet.text('EMPLOYEE TRACKER', {
        font: 'DOS Rebel',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 150,
        whitespaceBreak: true
    }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
    });
}

init();