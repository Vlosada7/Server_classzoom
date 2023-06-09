import { Request, Response } from 'express';
import { prisma } from '../database';

const createLesson = async (req: Request, res: Response) => {
  const name = req.body.name.toLowerCase().trim();
  const { subjectId, scheduledDate } = req.body;
  console.log(req.body);
  if (name && subjectId && scheduledDate) {
    try {
      const newLesson = await prisma.lesson.create({
        data: {
          name,
          subjectId,
          scheduledDate,
        },
      });
      res.status(201);
      res.send(newLesson);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  } else {
    res.status(400).send('Parameter missing to create a new lesson');
  }
};

const getLesson = async (req: Request, res: Response) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: req.params.lessonId,
    },
  });
  res.status(200).send(lesson);
};

const deleteLesson = async (req: Request, res: Response) => {
  const lessonId = req.params.lessonId;
  try {

    // const updateNote = await prisma.noteBook.updateMany({
    //   where: {
    //     lessonId: lessonId,
    //   },
    //   data: {
    //     lesson: {
    //       // disconnect: true
    //     }
    //   }
    // })
    // const updateLesson = await prisma.lesson.update({
    //   where: {
    //     id: lessonId,
    //   },
    //   data: {
    //     librarys: {
    //       set: []
    //     },
    //     notes: {
    //       set: []
    //     }
    //   }
    // });

    // console.log(updateLesson);

    // await prisma.noteBook.update({
    //   where: {
    //     lessonId: lessonId,
    //   },
    //   data:
    // });
    // await prisma.whiteboard.deleteMany({
    //   where: {
    //     lessonId: lessonId,
    //   },
    // });
    // const deletedLesson = await prisma.lesson.delete({
    //   where: {
    //     id: lessonId,
    //   },
    // });

    // const transaction = await prisma.$transaction([deletedLesson, deleteNotes]);
    // res.status(200).send(deletedLesson);
  } catch (error) {
    console.error(error);
    res.status(404).send('Couldnt delete the lesson');
  }
};

const updateLesson = async (req: Request, res: Response) => {
  const updatedLesson = await prisma.lesson.updateMany({
    where: {
      id: req.params.lessonId,
    },
    data: {
      video: req.body.video,
      drawing: req.body.drawing,
    },
  });
  res.status(201).send(updatedLesson);
};

const getAllLessons = async (req: Request, res: Response) => {
  try {
    const school = await prisma.school.findUnique({
      where: {
        id: req.params.schoolId,
      },
      select:
      {
        subjects: {
          select: {
            lessons:true
          }
        }
      }
    });
    res.status(200).send(school);
  } catch (error) {
    console.error(error);
    res.status(404).send('Couldnt find the lessons');
  }
}; 

export { createLesson, deleteLesson, getLesson, updateLesson, getAllLessons };
