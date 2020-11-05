const {response} = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');


const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try{
        // Comprobamos si existe el usuario
        let user = await User.findOne({ email });
        
        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con este correo'
            })
        }
        // Si no existe, lo grabamos en la BD
        user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Guardamos el usuario
        await user.save();

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    }catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Comprobamos si existe el usuario
        const user = await User.findOne({ email });

        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con este correo no existe'
            })
        }

        // Comprobamos si el password es correcto
        const validPassword = bcrypt.compareSync( password, user.password);

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Gerenar JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const revalidateToken = async (req, res = response) => {

    const {uid, name} = req;

    // Generar un nuevo JWT
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}