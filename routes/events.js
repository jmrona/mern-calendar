/*
    Event routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT } = require('../middlewares/validate-jwt');
const fieldValidator = require('../middlewares/fieldValidator');
const { isDate } = require('../helpers/isDate');

const {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/events');


const router = Router();




//Todas tienen que pasar por la validación del JWT
router.use( validateJWT);

// Obtener eventos - GET
router.get('/', getEvent);


// Crear un nuevo evento - POST
router.post('/', 
    [
        check('title','Title is required').not().isEmpty(),
        check('start','Date start is required').custom( isDate ),
        check('end','Date end is required').custom( isDate ),
        fieldValidator
    ], 
    createEvent
);


// Actualizar evento - PUT
router.put('/:id', updateEvent);


// Borrar evento
router.delete('/:id', deleteEvent);



module.exports = router;