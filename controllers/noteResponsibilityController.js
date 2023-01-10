
const db = require('../models');
const { QueryTypes } = require('sequelize');
const { NotesResponsibilities } = require('../models');
const { Notes } = require('../models');


class NoteResponsibilityController {
    static async getAccessByNoteId(req, res) {
        try {
          const { noteId } = req.params;
            const records = await db.sequelize.query(`SELECT "id", get_user_name("userId") username, "createdAt", "updatedAt" FROM "NotesResponsibilities" WHERE "noteId" = $1;`, 
            {
                bind:[noteId],
                type: QueryTypes.SELECT
            });
            console.log("records: ",records.length)
            if(records.length < 1){
                return res.status(404).json({error:404,message: "no_data_found"});
            }
            res.status(200).json(records);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    }

    static async create(req, res) {
        try {
          const { noteId, userId } = req.body;
          const note = await Notes.findByPk(noteId)
          if (note.noteType === "PUBLIC"){
            return res.status(401).json({error:401,message: "cannot create access to public note"});
          };
          const query = await NotesResponsibilities.create({
            noteId,
            userId,
          });
          const response = {
            id: query.id,
            noteId: query.noteId,
            userId: query.userId
          };
          res.status(201).json(response);
        } catch (err) {            
          res.status(500).json(err);
        }
    }

    static async delete(req, res) {
        try {
            const { noteAccessId } = req.params;
            const query = await NotesResponsibilities.destroy({
                where: {
                    id:noteAccessId,
                },
            });
            if (!query){
                res.status(200).json({error:500,message:`Internal Server Error`});
            }
            res.status(200).json({error:200,message:`Successfully`});
        } catch (err) { 
          console.log(err)           
            res.status(500).json(err);
        }
    }

}

module.exports = NoteResponsibilityController;