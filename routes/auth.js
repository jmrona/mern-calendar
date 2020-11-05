/*
    Rutas de auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator')
const fieldValidator = require('../middlewares/fieldValidator');
const { validateJWT } = require('../middlewares/validate-jwt')
const {
    createUser, 
    loginUser, 
    revalidateToken
} = require('../controllers/auth');


const router = Router();


router.post(
    '/', 
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must have 6 characters').isLength({ min: 6}),
        fieldValidator
    ],
    loginUser 
);

router.post(
    '/new', // path
    [ // middlewares
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must have 6 characters').isLength({ min: 6}),
        fieldValidator
    ], 
    createUser // controller
);

router.get('/renew', validateJWT, revalidateToken)




module.exports = router;