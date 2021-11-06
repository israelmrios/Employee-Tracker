const connection = require('../config/connection');

class Business {
    constructor(connection){
        this.connection = connection;
    }

    //should return employee id, first_name, last_name, role, department, salary, manager full name
    findAllEmployees(){
        return this.connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;");
    }
}

module.exports = new Business(connection);