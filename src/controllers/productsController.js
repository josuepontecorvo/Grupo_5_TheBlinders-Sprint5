const fs = require('fs');
const path = require('path');
const jsonDB = require('../model/jsonDatabase');
const  {validationResult} = require('express-validator');
const productModel = jsonDB('products');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

controller = {

    products: (req,res) => {
        const products = productModel.readFile();
        res.render('products/products', {products,toThousand})
    },

    detail: (req,res) => { 
        const id = +req.params.id;
        const product = productModel.find(id);    
        res.render('products/productDetail', {product,toThousand})
    },

    create: (req,res) => res.render('products/productCreate'),

    store: (req, res) => {
        let product = req.body;

        // Validaciones de productos

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let imagenes= []
            for(let i = 0 ; i<req.files.length;i++) {
            imagenes.push(req.files[i].filename)
            }
            product.image = imagenes.length > 0 ? imagenes : ['default-product-image.png'];
            productModel.create(product);
            res.redirect('/productos')
        }else {
            res.render('products/productCreate',{errors: errors.mapped(), oldData: req.body});
        }

        
    },

    edit: (req,res) => { 
        const id = +req.params.id;
        const product = productModel.find(id);    
        res.render('products/productEdit',{product});
    },

    delete: (req,res) => {
        let idToDelete = req.params.id;
        let product = productModel.find(idToDelete);
        let pathToImage = path.join(__dirname, '../../public/images/'+ product.image[0]);
        fs.unlinkSync( pathToImage );
        productModel.delete(idToDelete);
        res.redirect('/productos');
    },

    update: (req,res) => {
        let idToUpdate = req.params.id;
        let dataUpdate = req.body;

        // Validaciones de productos

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const product = productModel.find(idToUpdate);  
            let imagenes= []
            for(let i = 0 ; i<req.files.length;i++){
                imagenes.push(req.files[i].filename)
            }
            dataUpdate.image =imagenes.length > 0 ? imagenes : product.image;
            let productUpdate = {
                id: idToUpdate,
                ...dataUpdate,
            }
            productModel.update(productUpdate);
            res.redirect('/productos');
        }else {
            res.render('products/productEdit',{errors: errors.mapped(), oldData: req.body});
        }

        
    },
    
    filter: (req,res) => {
        let filtro = req.query;
        const products = productModel.readFile();
        res.render('products/products', {products,toThousand,filtro})
    },

};

module.exports = controller;