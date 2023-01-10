
const db = require('../models');
const { QueryTypes } = require('sequelize');
const { Notes } = require('../models');

class NoteController {
    static async getAllNotes(req, res) {
        try {
            const authenticatedUser = res.locals.user;
            const records = await db.sequelize.query(`SELECT "id", "title", "detail", "noteType", get_user_name("userId") "createdBy", "createdAt", "updatedAt" FROM "Notes" WHERE "noteType" = 'PUBLIC' OR ("noteType" = 'PRIVATE' and "userId" = $1) OR ("noteType" = 'PRIVATE' and EXISTS (SELECT 1 FROM "NotesResponsibilities" WHERE "noteId" = "Notes"."id" AND "userId" = $2));`, 
            {
                bind:[authenticatedUser.id,authenticatedUser.id],
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
    
    static async getOneNoteByID(req, res) {
        try {
            const { id } = req.params;
            const query = await Notes.findByPk(id);
            if (!query){
            return res.status(500).json({error:500,message: "bad_request"});
            }
            res.status(200).json(query);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static async create(req, res) {
        try {
          const { title, detail, noteType } = req.body;
          const authenticatedUser = res.locals.user;
          const query = await Notes.create({
            title,
            detail,
            noteType,
            userId: authenticatedUser.id,
          });
          const response = {
            id: query.id,
            title: query.title,
            detail: query.detail,
            noteType: query.noteType,
          };
          res.status(201).json(response);
        } catch (err) {            
          res.status(500).json(err);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { title, detail, noteType } = req.body;
            const data = {
                title,
                detail,
                noteType,
            };
            if (noteType === "PUBLIC"){
                const records = await db.sequelize.query(`DELETE FROM "NotesResponsibilities" WHERE "noteId" = $1;`,
                {
                    bind:[id],
                    type: QueryTypes.SELECT
                })
                console.log(records)
            }
            const query = await Notes.update(data, {
              where: {
                id,
              },
              returning: true,
            });
            if (!query){
                res.status(200).json({error:500,message:`Internal Server Error`});
            }
            res.status(200).json({error:200,message:`Successfully`});
        } catch (err) {            
          res.status(500).json(err);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const query = await Notes.destroy({
                where: {
                    id,
                },
            });
            if (!query){
                res.status(200).json({error:500,message:`Internal Server Error`});
            }
            res.status(200).json({error:200,message:`Successfully`});
        } catch (err) {            
            res.status(500).json(err);
        }
    }

}

module.exports = NoteController;