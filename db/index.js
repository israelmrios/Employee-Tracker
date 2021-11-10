const connection = require('../config/connection');

// Using a class to be able to export all the functions
class Business {
    constructor(connection) {
        this.connection = connection;
    }

    findAllDepartments() {
        return this.connection.promise().query("SELECT name, id FROM department;")
    }

    findAllRoles() {
        return this.connection.promise().query("SELECT role.title, role.id, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;")
    }

    findAllEmployees() {
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;");
    }

    newDepartment(data) {
        return this.connection.promise().query(`INSERT INTO department(id, name) VALUES (id, "${data.department}");`)
    }

    newRole(data) {
        return this.connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.title}", "${data.salary}", ${data.department});`)
    }

    // Using single character wildcard to insert object data
    newEmployee(data) {
        return this.connection.promise().query('INSERT INTO employee SET ?', data);
    }

    // Using single character wildcard and two parameters to update two rows in a table
    changeEmployeeRole(eid, rid) {
        return this.connection.promise().query('UPDATE employee SET role_id =? WHERE employee.id =?;', [rid, eid])
    }
}

module.exports = new Business(connection);