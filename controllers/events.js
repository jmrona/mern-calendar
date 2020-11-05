const {response} = require('express');
const Event = require('../models/Event')



const getEvent = async(req, res = response) => {

    const events = await Event.find().populate('user', 'name');

    return res.status(200).json({
        ok: true,
        events
    })
}

const createEvent = async(req, res = response) => {
    const event = new Event(req.body)
    try {

        event.user = req.uid;

        const eventSaved = await event.save();

        res.status(201).json({
            ok: true,
            event: eventSaved
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        })
    }
    return res.status(200).json({
        ok: true,
        msg: 'createEvent'
    })
}

const updateEvent = async(req, res = response) => {

    // Obtenemos el ID del evento enviado por parámetro
    const eventId = req.params.id;

    //Obtenemos el ID del usuario
    const uid = req.uid;

    try {
        // Comprobamos si existe el evento
        const event = await Event.findById(eventId);

        if(!event){
            res.status(404).json({
                ok: false,
                msg: "Evento no existe"
            })
        }

        // Comprobamos si el evento fue creado por el mismo usuario
        // que está logeado
        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'No tiene permiso para editar este evento'
            })
        }

        // Modificamos y devolvemos el evento si pasa las 
        // comprobaciones anteriores
        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.status(200).json({
            ok:true,
            event: eventUpdated
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        })
    }
}

const deleteEvent = async(req, res = response) => {

    // Obtenemos el ID del evento enviado por parámetro
    const eventId = req.params.id;

    //Obtenemos el ID del usuario
    const uid = req.uid;

    try {
        // Comprobamos si existe el evento
        const event = await Event.findById(eventId);

        if(!event){
            res.status(404).json({
                ok: false,
                msg: "Evento no existe"
            })
        }

        // Comprobamos si el evento fue creado por el mismo usuario
        // que está logeado
        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: 'No tiene permiso para eliminar este evento'
            })
        }

        // Elimino el evento y actualizo la lista de eventos - FUNCIONA
        // await Event.findByIdAndDelete(eventId, async () =>{
        //     const events = await Event.find().populate('user', 'name');
        //     return res.status(200).json({
        //         ok: true,
        //         events 
        //     })
        // });

        // IGUAL QUE EN EL CURSO
        await Event.findByIdAndDelete(eventId);

        return res.status(200).json({
            ok: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        })
    }
    
}

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}