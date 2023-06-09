"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLesson = exports.deleteLessonFromLibrary = exports.getLessons = exports.addLessonId = void 0;
const database_1 = require("../database");
const addLessonId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, lessonId } = req.params;
    const { name } = req.body;
    try {
        const library = yield database_1.prisma.library.findUnique({
            where: {
                userId: userId,
            },
            select: {
                lessons: true,
            },
        });
        if (!library) {
            throw new Error('library or user doesnt exist');
        }
        const filterLessons = library.lessons.filter((lesson) => lesson.id === lessonId);
        if (filterLessons.length) {
            throw new Error('lesson already exists');
        }
        const lessonIds = library.lessons.map((el) => ({ id: el.id }));
        yield database_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                lessons: {
                    set: [...lessonIds, { id: lessonId }],
                },
            },
        });
        const updatedLibrary = yield database_1.prisma.library.update({
            where: {
                userId: userId,
            },
            data: {
                lessons: {
                    set: [...lessonIds, { id: lessonId }],
                },
            },
        });
        //----------------- create a noteBook ----------------------------
        console.log(updatedLibrary);
        const library2 = yield database_1.prisma.library.findUnique({
            where: {
                userId: userId,
            },
            include: {
                lessons: true,
            },
        });
        if (!library2) {
            throw new Error('library or user doesnt exist');
        }
        const hasLesson = library2.lessons.some((noteBook) => noteBook.id === lessonId);
        if (!hasLesson) {
            throw new Error('user doesnt have this lesson');
        }
        yield database_1.prisma.noteBook.create({
            data: {
                libraryId: library2.id,
                lessonId,
                name
            },
        });
        //----------------------------------------------------------------
        res.status(201).send(updatedLibrary);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(`${error}`);
    }
});
exports.addLessonId = addLessonId;
const getLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const library = yield database_1.prisma.library.findUnique({
            where: {
                userId: req.params.userId,
            },
            include: {
                lessons: true,
            },
        });
        res.status(200).send(library === null || library === void 0 ? void 0 : library.lessons);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Library doesnt find');
    }
});
exports.getLessons = getLessons;
const getLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessonInLibrary = yield database_1.prisma.library.findUnique({
            where: {
                userId: req.params.userId,
            },
            include: {
                lessons: {
                    where: {
                        id: req.params.lessonId,
                    },
                },
            },
        });
        res.status(200).send(lessonInLibrary);
    }
    catch (error) {
        console.error(error);
        res.status(404).send('Lesson not found');
    }
});
exports.getLesson = getLesson;
const deleteLessonFromLibrary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const library = yield database_1.prisma.library.findUnique({
            where: {
                userId: req.params.userId,
            },
            include: {
                lessons: true,
            },
        });
        if (!library) {
            res.status(404).send(`User with ID ${req.params.userId} not found`);
        }
        const updatedLibrary = yield database_1.prisma.library.update({
            where: {
                userId: req.params.userId,
            },
            data: {
                lessons: {
                    disconnect: {
                        id: req.params.lessonId,
                    },
                },
            },
        });
        yield database_1.prisma.noteBook.deleteMany({
            where: {
                lessonId: req.params.lessonId,
            },
        });
        res.status(200).send(updatedLibrary);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server problem');
    }
});
exports.deleteLessonFromLibrary = deleteLessonFromLibrary;
