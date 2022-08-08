const jsonDB = require('../model/jsonDatabase');
const path = require('path');
const fs = require('fs');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = jsonDB('users');


controlador = {
    list: (req,res) =>{ 
        let users = userModel.readFile();     
        res.render('users/user-index',{users});
    },

    detail: (req,res) => { 
        const id = +req.params.id;
        const user = userModel.find(id);    
        res.render('users/userDetail', {user});
    },

    register: (req,res) => res.render('users/register'),

    store: (req,res) => {
        let user = req.body;
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let imagenes= []
            for(let i = 0 ; i<req.files.length;i++) {
                imagenes.push(req.files[i].filename)
            }
            user.profileimg = imagenes.length > 0 ? imagenes : ['default-user.png'];
            delete user["user-confirm-password"];
            user.password = bcrypt.hashSync(user.password,10);
            userModel.create(user);
            res.redirect('/');
        } else {
            res.render('users/register',{errors : errors.mapped(), oldData: req.body});
        };
    },

    login: (req,res) => res.render('users/login'),

    loginProcess: (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('users/login',{errors : errors.mapped(), oldData : req.body});
        }
        let user = userModel.findByField('email', req.body.username);
        if (user && (bcrypt.compareSync(req.body.password, user.password))) {
            return res.redirect('/');
        } else {
            let errors = {
                username : {
                    msg: 'Credenciales invalidas'
                },
                password : {
                    msg: 'Credenciales invalidas'
                }
            }
            return res.render('users/login',{errors , oldData : req.body});
        };
    },

    cart: (req,res) => res.render('users/product-cart'),

    edit: (req,res) => { 
        const id = +req.params.id;
        const user = userModel.find(id);    
        res.render('users/userEdit',{user});
    },

    update: (req,res) => {
        let idToUpdate = req.params.id;
        const user = userModel.find(idToUpdate);   
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let dataUpdate = req.body;
            let imagenes= []
            for(let i = 0 ; i<req.files.length;i++) {
                imagenes.push(req.files[i].filename)
            }
            dataUpdate.profileimg = imagenes.length > 0 ? imagenes : user.profileimg;

            if(dataUpdate.password != "") {
                    delete dataUpdate["user-confirm-password"];
                    let userUpdate = {
                        id: idToUpdate,
                        ...dataUpdate,
                    }
                    userUpdate.password = bcrypt.hashSync(userUpdate.password,10);
                    userModel.update(userUpdate);
                    res.redirect('/usuarios');
            } else {
                delete dataUpdate["user-confirm-password"];
                dataUpdate.password = user.password;
                let userUpdate = {
                    id: idToUpdate,
                    ...dataUpdate,
                }
                userModel.update(userUpdate);
                res.redirect('/usuarios');
            }
        }else {
            res.render('users/userEdit',{errors: errors.mapped(), oldData : req.body, idToUpdate, user});
        }

        
    },

    delete: (req,res) => {
        let idToDelete = req.params.id;
        let user = userModel.find(idToDelete);
        for (let i = 0; i < user.profileimg.length; i++) {
            let pathToImage = path.join(__dirname, '../../public/images/users/'+ user.profileimg[i]);
            fs.unlinkSync( pathToImage );
        }
        userModel.delete(idToDelete);
        res.redirect('/');
    },

};

module.exports = controlador;