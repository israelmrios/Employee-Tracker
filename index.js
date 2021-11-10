const inquirer = require('inquirer');
const db = require('./db');
// I included this package to create a custom logo at the start of the application
const logo = require('asciiart-logo');
require('console.table');


function init() {
    const banner = logo({ name: "Employee Tracker" }).render();
    console.log(banner);
    initialPrompt();
}

// Included a "Quit" option to make it user friendly
function initialPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"]
        }
    ]).then((data) => {
        let choice = data.options;
        console.log(choice)
        // Switch statement being used to compare multiple possible conditions of an expression
        switch (choice) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            // When the "Quit" option is selected the default option is executed
            default:
                process.exit()
        }
    })
}

// The following functions will use the imported Business class in the db folder

// This function will format a table showing department names and department ids
function viewAllDepartments() {
    db.findAllDepartments().then(([data]) => {
        console.log('\n')
        console.table(data)
    }).then(() => initialPrompt());
}

// This function will format a table showing job titles, role ids, the department that roles belong to, and the salary for those roles
function viewAllRoles() {
    db.findAllRoles().then(([data]) => {
        console.log('\n')
        console.table(data)
    }).then(() => initialPrompt());
}

// This function will format a table showing employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    db.findAllEmployees().then(([data]) => {
        console.log('\n')
        console.table(data)
    }).then(() => initialPrompt());
}

// This function will prompt you to enter the name of the new department and then add it to the database
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

// This function will prompt you to enter the name, salary, and department for the new role and it to the database
function addRole() {
    db.findAllDepartments().then(([data]) => {
        const department = data.map((dept) => {
            return { name: dept.name, value: dept.id };
        });
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter the New Role Title?"
            },
            {
                type: "number",
                name: "salary",
                message: "Please enter the salary for this role?"
            },
            {
                type: "list",
                name: "department",
                message: "Which department does this new role belongs to?",
                choices: department
            }
        ]).then((data) => {
            db.newRole(data).then(() => {
                console.log(`\n You just added ${data.title} with a salary of ${data.salary} to the database. \n`);
                initialPrompt();
            })
        })
    })
}

// This function will prompt you to enter the new employee’s first name, last name, role, and manager then add it to the database
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
        }
    ]).then((data) => {
        let empFirst = data.first_name;
        let empLast = data.last_name;

        db.findAllRoles().then(([data]) => {

            const roleOptions = data.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Please enter employees Role?",
                    choices: roleOptions
                }
            ]).then(res => {
                let roleId = res.role;

                db.findAllEmployees().then(([data]) => {
                    const managerOptions = data.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Please enter employees Manager?",
                            choices: managerOptions
                        }
                    // Created an object out of the variables to pass through the query function
                    ]).then(res => {
                        let newEmployee = {
                            manager_id: res.manager,
                            role_id: roleId,
                            first_name: empFirst,
                            last_name: empLast
                        }
                        db.newEmployee(newEmployee);
                    }).then(() => {
                        console.log(`\n You just added ${empFirst} ${empLast} to database. \n`);
                        initialPrompt();
                    })
                })
            })
        })
    });
}

// This function will prompt you to select the employee you want to update and their new role then add it to the database 
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
                message: "Which employee would you like to update?",
                choices: names
            }
        ]).then((data) => {
            let empId = data.name;
            db.findAllRoles().then(([data]) => {

                const roleOptions = data.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "What is this employees new role/title? ",
                        choices: roleOptions
                    }
                ]).then(res => db.changeEmployeeRole(empId, res.roleId)).then(() => {
                    console.log(`\n This employee was just updated in the database. \n`);
                    initialPrompt();
                })
            })
        })
    })
}

init();