const connection = require('../config/connection');

class Business {
    constructor(connection){
        this.connection = connection;
    }

    //should return employee id, first_name, last_name, role, department, salary, manager full name
    findAllEmployees(){
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.manager_id = employee.id;");
    }

    newEmployee(){
        return this.connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${data.role}, ${data.manager});`);
    }
}

module.exports = new Business(connection);