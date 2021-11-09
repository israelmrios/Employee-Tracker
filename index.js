const inquirer = require('inquirer');
const db = require('./db');
const logo = require('asciiart-logo');
require('console.table');


function init() {
    const banner = logo({ name: "Employee Tracker" }).render();
    console.log(banner);
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
        console.log(choice)
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
    })
}

function viewAllEmployees() {
    db.findAllEmployees().then(([data]) => {
        console.log('\n')
        console.table(data)
    }).then(() => initialPrompt());
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter employees First Name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter employees Last Name?"
        },
    ]).then((data) => {
        let empFirst = data.first_name;
        let empLast = data.last_name;

        db.getAllRoles().then(([data]) => {

            const roleOptions = data.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            inquirer.prompt([{
                type: "list",
                name: "role",
                message: "Please enter employees Role?",
                choices: roleOptions
            }]).then(res => {
                let roleId = res.role;

                db.findAllEmployees().then(([data]) => {
                    const managerOptions = data.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    inquirer.prompt([{
                        type: "list",
                        name: "manager",
                        message: "Please enter employees Manager?",
                        choices: managerOptions
                    }]).then(res => {
                        let newEmployee = {
                            manager_id: res.manager,
                            role_id: roleId,
                            first_name: empFirst,
                            last_name: empLast
                        }

                        db.newEmployee(newEmployee);
                    }).then(() => console.log(`added ${empFirst} ${empLast}`)).then(() => initialPrompt())
                })
            })
        })
    });





}

function updateEmployeeRole() {
    db.findAllEmployees().then(([data]) => {


        const names = data.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Which employee would you like to change",
                choices: names,
            },

        ]).then((data) => {
            let empId = data.name;
            db.getAllRoles().then(([data]) => {

                const roleOptions = data.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt([{
                    type: "list",
                    name: "roleId",
                    message: "What is the new role for the employee? ",
                    choices: roleOptions,
                }]).then(res => db.changeEmployeeRole(empId, res.roleId)).then(() => console.log('updated the role')).then(() => initialPrompt())
            })
        })
    })
}

function viewAllRoles() {
    db.getAllRoles().then(([data]) => {
        console.table(data)
    }).then(() => initialPrompt());
}

function addRole() {
    db.getJustDepartment().then(([data]) => {
        const department = data.map((dept) => {
            return { name: dept.name, value: dept.id };
        });
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter the New Role?"
            },
            {
                type: "number",
                name: "salary",
                message: "Please enter the salary for this role?"
            },
            {
                type: "list",
                name: "department",
                message: "Please select which department this role belongs to?",
                choices: department,
            },
        ]).then((data) => {
            db.newRole(data).then(() => {
                console.log(`\n You just added ${data.title} with a salary of ${data.salary} to the database. \n`);
                initialPrompt();
            })
        })


    })

}

function viewAllDepartments() {
    db.getJustDepartment().then(([data]) => {
        console.log('\n')
        console.table(data)
    }).then(() => initialPrompt());
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the new department name?"
        }
    ]).then((data) => {
        db.newDepartment(data).then(() => {
            console.log(`\n You just added a ${data.department} department to the database. \n`);
            initialPrompt();
        })
    });
}

init();