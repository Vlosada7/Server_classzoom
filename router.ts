import { Router } from 'express';
import * as userController from './controllers/user.controller';
import * as schoolController from './controllers/school.controller';
import * as subjectController from './controllers/subject.controller';
import * as lessonController from './controllers/lesson.controller';
import * as libraryController from './controllers/library.controller';
import * as noteBookController from './controllers/noteBook.controller';
import * as roomTokenController from './controllers/interactiveWhiteboard/roomToken.controller';

import { generateDatabase } from './populate';

const router = Router();

//user routes
router.post('/user', userController.createUser);
router.get('/user/userId/:userId', userController.getUserById);
router.get('/user/username/:username', userController.getUserByUsername);
router.put('/user', userController.updateUser);
router.get('/user/:schoolId', userController.getAllUsers);

//school routes
router.post('/school', schoolController.createSchool);
router.get('/school/:schoolId', schoolController.getSchool);

//subject routes
router.post('/subject', subjectController.createSubject);
router.get('/subject/:schoolId', subjectController.getSubjects);
router.delete('/subject/:subjectId', subjectController.deleteSubject);

//lessons routes
router.post('/lesson', lessonController.createLesson);
router.get('/lesson/:lessonId', lessonController.getLesson);
router.delete('/lesson/:lessonId', lessonController.deleteLesson);
router.put('/lesson/:lessonId', lessonController.updateLesson);

//library routes - post library automatically created when user is created
router.get('/library/:userId', libraryController.getLessons);
router.get('/library/:userId/:lessonId', libraryController.getLesson);
router.delete('/library/:userId/:lessonId', libraryController.deleteLessonFromLibrary);
router.put('/library/:userId/:lessonId', libraryController.addLessonId);
router.get('/lesson/school/:schoolId', lessonController.getAllLessons);

//noteBook routes
router.post('/noteBook', noteBookController.createNote);
router.get('/noteBook/:userId/:lessonId', noteBookController.getOneLessonNote);
router.get('/noteBook/:userId', noteBookController.getAllUserNotes);
router.delete('/noteBook/:userId/:lessonId', noteBookController.deleteNote);
router.put('/noteBook', noteBookController.updateNote);

//Agora Whiteboardroom Token
router.get('/roomToken/teacher/:lessonId', roomTokenController.createOrGetToken); // for the teacher
router.get('/roomToken/student/:lessonId', roomTokenController.getTokenForStudent); // for the student
router.delete('/roomToken/:lessonId', roomTokenController.deleteWhiteboard);


router.post('/populate', generateDatabase);

export default router;
