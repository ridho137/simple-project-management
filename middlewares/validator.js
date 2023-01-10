const { Notes, NotesResponsibilities } = require('../models');

class RequestValidator{
    static validateRegisterUser = async (req, res, next) => {
        try {
            const { email, password, username } = req.body;
            email ??= ""
            password ??= ""
            username ??= ""
            if (email === "" || password === "" || username === ""){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }
      
    static validateLoginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            email ??= ""
            password ??= ""
            if (email === "" || password === ""){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteCreate = async (req, res, next) => {
        try {
            const { title, detail, noteType } = req.body;
            title ??= ""
            noteType ??= ""
            if (title === "" || noteType === ""){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            if (noteType === "PUBLIC" || noteType === "PRIVATE"){
                return next()
            }
            return res.status(400).json({error:400,message:"bad_request"})
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteUpdate = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, detail, noteType } = req.body;
            id ??= 0
            title ??= ""
            noteType ??= ""
            if (id ===0 || title === "" || noteType === ""){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            const note = await Notes.findOne({
            where: {
                id,
                },
            });
            if (!note){
                return res.status(404).json({error:404,message:`note id ${id} not found`});
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            id ??= 0
            if (id ===0){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            const note = await Notes.findOne({
            where: {
                id,
                },
            });
            if (!note){
                return res.status(404).json({error:404,message:`note id ${id} not found`});
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteGetOneById = async (req, res, next) => {
        try {
            const { id } = req.params;
            id ??= 0
            if (id ===0){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            const note = await Notes.findOne({
            where: {
                id,
                },
            });
            if (!note){
                return res.status(404).json({error:404,message:`note id ${id} not found`});
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteAccessCreate = async (req, res, next) => {
        try {
            const { noteId, userId } = req.body;
            noteId ??= 0
            userId ??= 0
            if (noteId === 0 || userId === 0){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateNoteAccessDelete = async (req, res, next) => {
        try {
            const noteId = req.params.noteId;
            const noteAccessId = req.params.noteAccessId;
            noteId ??= 0
            noteAccessId ??= 0
            if (noteAccessId ===0 || noteId === 0){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            const note = await Notes.findOne({
                where: {
                    id : noteId,
                    },
                });
                if (!note){
                    return res.status(404).json({error:404,message:`note id ${noteId} not found`});
                }
            const noteAccess = await NotesResponsibilities.findOne({
            where: {
                id : noteAccessId,
                },
            });
            if (!noteAccess){
                return res.status(404).json({error:404,message:`note access id ${noteAccessId} not found`});
            }
            return next()
        } catch (err) {
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }

    static validateAccessByNoteId = async (req, res, next) => {
        try {
            const { noteId } = req.params;
            noteId ??= 0
            if (noteId ===0){
                return res.status(400).json({error:400,message:"bad_request"})
            }
            const note = await Notes.findOne({
            where: {
                id : noteId,
                },
            });
            if (!note){
                return res.status(404).json({error:404,message:`note id ${noteId} not found`});
            }
            return next()
        } catch (err) {
            console.log(err)
            return res.status(400).json({error:400,message:"bad_request"})
        }
    }
}


module.exports = RequestValidator
