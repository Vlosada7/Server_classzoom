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
exports.getAllUsers = exports.updateUser = exports.getUserByUsername = exports.getUserById = exports.createUser = void 0;
const database_1 = require("../database");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, firstName, lastName, email, student, schoolId, avatar } = req.body;
    const username = req.body.username.toLowerCase().trim();
    if (firstName && lastName && email && username && student !== undefined && schoolId && avatar) {
        try {
            const newUser = yield database_1.prisma.user.create({
                data: {
                    id,
                    firstName,
                    lastName,
                    email,
                    username,
                    student,
                    schoolId,
                    avatar
                }
            });
            const library = {
                userId: newUser === null || newUser === void 0 ? void 0 : newUser.id
            };
            yield database_1.prisma.library.create({ data: library });
            res.status(201);
            res.send(newUser);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: error });
        }
    }
    else {
        console.log('parameter missing');
        res.status(400).send({ error: 'Submitting form wrong' });
    }
});
exports.createUser = createUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.prisma.user.findUnique({
            where: {
                id: req.params.userId
            },
        });
        if (!user) {
            throw new Error();
        }
        res.send(user);
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'User not found' });
    }
});
exports.getUserById = getUserById;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.prisma.user.findUnique({
            where: {
                username: req.params.username
            },
        });
        if (!user) {
            throw new Error();
        }
        res.send({ username: req.params.username });
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'User not found' });
    }
});
exports.getUserByUsername = getUserByUsername;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, firstName, lastName, username, avatar } = req.body;
        const user = yield database_1.prisma.user.update({
            where: { id: String(id) },
            data: {
                firstName,
                lastName,
                username,
                avatar
            }
        });
        res.status(200);
        res.send(user);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'Could not update the user' });
    }
});
exports.updateUser = updateUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schoolId } = req.params;
    try {
        const users = yield database_1.prisma.user.findMany({
            where: {
                schoolId: schoolId
            },
        });
        if (!users) {
            throw new Error();
        }
        res.send(users);
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ error: 'School not found' });
    }
});
exports.getAllUsers = getAllUsers;
