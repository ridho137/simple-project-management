const { Notes,NotesResponsibilities } = require('../models')

class Authorization {
  static noteReadAuthorization = async (req, res, next) => {
    try {
      const noteId = req.params.id;
      const authenticatedUser = res.locals.user
      const note = await Notes.findOne({
        where: {
          id: noteId,
        }
      })
      if (!note) {
        return res.status(404).json({
          name: "Data Not found",
          message: `Note with id ${noteId} not found`
        })
      }
      if (note.noteType == "PRIVATE" && note.userId != authenticatedUser.id) {
        if (await Authorization.checkNotePermissionByUserId(authenticatedUser.id)){
          return next()
        }else{
          return res.status(403).json({
            name: "Authorization error",
            message: `User with id ${authenticatedUser.id} doesnt have permission to access note with id ${noteId}`
          })
        }
      } else {
        return next()
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  }

  static noteChangeAuthorization = async (req, res, next) => {
    try {
      const noteId = req.params.id;
      const authenticatedUser = res.locals.user
      const note = await Notes.findOne({
        where: {
          id: noteId
        }
      })
      if (!note) {
        return res.status(404).json({
          name: "Data Not found",
          message: `Note with id ${noteId} not found`
        })
      }
      if (await Authorization.checkNoteOwner(noteId, authenticatedUser.id)){
        return next()
      }else{
        return res.status(403).json({
          name: "Authorization error",
          message: `User with id ${authenticatedUser.id} doesnt have permission to access note with id ${noteId}`
        })
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  static noteAccessReadAuthorization = async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const authenticatedUser = res.locals.user
      const note = await Notes.findOne({
        where: {
          id: noteId,
        }
      })
      if (!note) {
        return res.status(404).json({
          name: "Data Not found",
          message: `Note with id ${noteId} not found`
        })
      }
      if (await Authorization.checkNoteOwner(noteId, authenticatedUser.id)){
        return next()
      }else{
        return res.status(403).json({
          name: "Authorization error",
          message: `User with id ${authenticatedUser.id} doesnt have permission to access note with id ${noteId}`
        })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  }

  static noteAccessCreateAuthorization = async (req, res, next) => {
    try {
      const { noteId, userId } = req.body;
      const authenticatedUser = res.locals.user
      const note = await Notes.findOne({
        where: {
          id: noteId
        }
      })
      if (!note) {
        return res.status(404).json({
          name: "Data Not found",
          message: `Note with id ${noteId} not found`
        })
      }
      console.log("checkPermission: ", await Authorization.checkNoteOwner(noteId, authenticatedUser.id))
      if (await Authorization.checkNoteOwner(noteId, authenticatedUser.id)){
        return next()
      }else{
        return res.status(403).json({
          name: "Authorization error",
          message: `User with id ${authenticatedUser.id} doesnt have permission to access note with id ${noteId}`
        })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  }

  static noteAccessRevokeAuthorization = async (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      const authenticatedUser = res.locals.user
      const note = await Notes.findOne({
        where: {
          id: noteId
        }
      })
      if (!note) {
        return res.status(404).json({
          name: "Data Not found",
          message: `Note with id ${noteId} not found`
        })
      }
      console.log("checkPermission: ", await Authorization.checkNoteOwner(noteId, authenticatedUser.id))
      if (await Authorization.checkNoteOwner(noteId, authenticatedUser.id)){
        return next()
      }else{
        return res.status(403).json({
          name: "Authorization error",
          message: `User with id ${authenticatedUser.id} doesnt have permission to access note with id ${noteId}`
        })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  }

  static checkNoteOwner = async (noteId, userId) => {
    try {
      const note = await Notes.findOne({
        where: {
          id: noteId
        }
      })
      if (note.userId != userId){
        return false
      }
      return true
    }catch (err) {
      return false
    }
  }

  static checkNotePermissionByUserId = async (userId) => {
    try {
      const noteResponsibility = await NotesResponsibilities.findOne({
        where: {
          userId: userId
        }
      })
      if (!noteResponsibility){
        return false
      }
      return true
    }catch (err) {
      return false
    }
  }
}
module.exports = Authorization