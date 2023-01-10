const router = require('express').Router();
const NoteController = require('../controllers/noteController');
const UserController = require('../controllers/userController');
const NoteResponsibilityController = require('../controllers/noteResponsibilityController');
const RequestValidator = require('../middlewares/validator')
const authentication = require('../middlewares/authentication');
const Authorization = require('../middlewares/authorization');

router.post('/users/register', RequestValidator.validateRegisterUser, UserController.register);
router.post('/users/login', RequestValidator.validateLoginUser, UserController.login);

router.get('/notes', authentication, NoteController.getAllNotes);
router.get('/notes/:id', authentication, RequestValidator.validateNoteGetOneById, Authorization.noteReadAuthorization, NoteController.getOneNoteByID);
router.post('/notes', authentication, RequestValidator.validateNoteCreate, NoteController.create);
router.put('/notes/:id', authentication, RequestValidator.validateNoteUpdate, Authorization.noteChangeAuthorization, NoteController.update);
router.delete('/notes/:id', authentication, RequestValidator.validateNoteDelete, Authorization.noteChangeAuthorization, NoteController.delete);

router.get('/notes-access/:noteId', authentication, RequestValidator.validateAccessByNoteId, Authorization.noteAccessReadAuthorization, NoteResponsibilityController.getAccessByNoteId);
router.post('/notes-access', authentication, RequestValidator.validateNoteAccessCreate, Authorization.noteAccessCreateAuthorization, NoteResponsibilityController.create);
router.delete('/notes-access/:noteId/:noteAccessId', authentication, RequestValidator.validateNoteAccessDelete, Authorization.noteAccessRevokeAuthorization, NoteResponsibilityController.delete);
module.exports = router;
