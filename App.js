const { name } = require('ejs');
const express = require('express');
const path = require("path");
const hbs = require('hbs');
const mysql = require('./data_base/connection').conn;
const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"))
//HOME PAGE
app.get('/', (req, res) => {
    res.render('index');
});
app.get('save_data', (req, res) => {

})
//REGISTRATION PAGE
app.get('/register', (req, res) => {
    res.render('register');
});
//LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login');
});
//USER PAGE
app.get('/display_user', (req, res) => {
    res.render('display_user');
});
//ADMIN PAGE
app.get('/admin_page', (req, res) => {
    res.render('admin_page');
});
//VIEW DATA
app.get('/view', (req, res) => {
    let qry = "select * from registration";
    mysql.query(qry, (err, result) => {
        if (err) throw err;
        res.render('view', { view_data: result });
    });

});
//Update data PAGE
app.get('/update_data', (req, res) => {
    res.render('update_data');
});
//DELETE DATA
app.get('/delete/(:id)', (req, res) => {
    console.log("id check=" + req.params.id);
    let id = req.params.id;
    var qry_delete = "DELETE FROM `registration` WHERE id = ?";
    mysql.query(qry_delete, (err, result) => {
        if (err) throw err;
        console.log("deleted successfully!");
        // res.send("deleted successfully! ID ="+id)
        res.redirect('/view');
    });

});
//edit data 
app.get('/update/:id', function (req, res, next) {
    var UserId = req.params.id;
    var sql = `SELECT * FROM registration WHERE id=${UserId}`;
    mysql.query(sql, function (err, data) {
        if (err) throw err;
        console.log("fetching data: ");
        console.log(data);
        res.render('update_data', { title: 'User List', new_data: data });
    });
});
//UPDATE DATA
app.get('/save_data', function (req, res, next) {
    const { id ,name, email, phone, address, password, c_password } = req.query;
    var UserId = req.query.id; 
    let qry = "select * from registration where phone = ? or email = ?";
    mysql.query(qry, [id, email, phone], (err, result) => {

        if (err) throw err;
        else {
            console.log("new data update email: " + req.query.email);
            console.log("new data update id: " + req.query.id);
            if (req.query.email == '' || req.query.phone == '' || req.query.name == '' || req.query.address == '' || req.query.password == '' || req.query.c_password == '') {
                console.log("enter complete requirements;");
                res.render('update_data', { require: true });
            }
            // else if (result.length > 0) {
            //     console.log("enter unique data;");
            //     return res.render('update_data', { mesg_repeat: true });
            // }
            else if (req.query.password !== req.query.c_password) {
                console.log('enter same password!');
            }
            else {
                console.log("update detect");
                let qry2 = `UPDATE registration SET id=?, Name=?,Email=?,Phone=?,Address=?,Password=? WHERE id=+${UserId}`;
                mysql.query(qry2, [id, name, email, phone, address, password], (err, result2) => {
                    if (err) throw err;
                    // console.log(result2);
                    console.log('update successfully!');   
                    res.redirect('/view');
                });
                
            }
        }

    });
});



//registration button
app.get('/resgiter_data', (req, res) => {
    const { name, email, phone, address, password, c_password } = req.query;
    let qry = "select * from registration where phone = ? or email = ?";
    mysql.query(qry, [email, phone], (err, result) => {

        if (err) throw err;
        else {
            console.log("new data: " + req.query.email);
            console.log("table data: " + result.email);
            if (req.query.email == '' || req.query.phone == '' || req.query.name == '' || req.query.address == '' || req.query.password == '' || req.query.c_password == '') {
                console.log("enter complete requirements;");
                res.render('register', { require: true });
            }
            else if (result.length > 0) {
                console.log("enter unique data;");
                return res.render('register', { mesg_repeat: true });
            }
            else if (req.query.password !== req.query.c_password) {
                console.log('enter same password!');
            }
            else {
                console.log("inserted detect");
                // inserted data
                let qry2 = "insert into registration values(?,?,?,?,?,?)";
                mysql.query(qry2, [, name, email, phone, address, password], (err, result2) => {
                    if (err) throw err;
                    console.log('inserted successfully!');
                    let userEmail = req.query.email;
                    res.render('login', { mesg: true, userEmail });
                })
            }
        }

    })
});

//login button 
app.get('/login_user', (req, res) => {
    const { email, password, security } = req.query;

    let qry = "select * from registration where email = ? and password = ?";
    mysql.query(qry, [email, password], (err, result) => {

        if (err) throw err;
        else {
            if (req.query.email == '' || req.query.password == '') {
                console.log("enter complete requirements;");
                res.render('login', { require: true });
            }
            // if user not found
            else if (result.length <= 0) {
                console.log("not match");
                res.render('login', { valid_e_p: true });
            }
            else { // if user found 
                console.log("login successfully!");
                let userEmail = req.query.email;
                if (req.query.security == 'admin') {
                    console.log("admin login successfully!");
                    res.render('admin_page', { mesg: true, userEmail });
                }
                else
                    res.render('display_user', { mesg: true, userEmail });
            }
        }
    })
});

//create server
app.listen(port, (err) => {
    if (err) throw err;
    console.log('listen successfully at port:  ', port)
})