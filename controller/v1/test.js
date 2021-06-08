const TestModel = require('../../models/test_model');
const GradeModel = require('../../models/grade_model');
const SubjectModel = require('../../models/subject_model');

const createTest = async (req, res, next) =>{
    try {
        const {teacherId, teacherSubject, teacherSchoolYear} = req.teacher;
        console.log("PRUEBA","teacherId:", teacherId, "teacherSubject:",teacherSubject, "teacherSchoolyear:", teacherSchoolYear);
        
        const {questions, subject, grade} = req.body;

        const subjectDoc = await SubjectModel.findById(subject);

        if (!subjectDoc){
            const err = new Error('La asignatura no existe');
            err.statusCode = 400;
            throw err;
        }

        if (!teacherSubject.includes(subject)){
            const err = new Error('Profesor no tiene acceso a crear pruebas de esta asignatura');
            err.statusCode = 401;
            throw err;
        }
        const gradeDoc = await GradeModel.findById(grade);
        if (!gradeDoc){
            const err = new Error('El curso no existe');
            err.statusCode = 400;
            throw err;
        }
        if (!teacherSchoolYear.includes(gradeDoc.school_year)){
            const err = new Error('Profesor no tiene acceso a crear pruebas de este nivel escolar');
            err.statusCode = 401;
            throw err;
        }

        let totalPoints = 0;
        let formatData = {questions: []};
        const questionError = {};
        console.log("preguntas",questions);

        questions.map((question, index) => {
            console.log('--------------------------------');
            console.log(question);
            console.log('question.points',question.points);
            console.log('question.question_title',question.question_title);
            console.log('question.question_answers',question.question_answers);
            console.log('question.correct_answer',question.correct_answer);
            
            
            if (isNaN(question.points) || question.points < 1){
                questionError.message =`Error en "puntos" de la pregunta: ${index +1}`;
                questionError.statusCode = 400;
                return;
            }
            if (!isNaN(question.question_title) ||question.question_title.length < 10){
                questionError.message =`Error en "titulo" de la pregunta: ${index +1}`;
                questionError.statusCode = 400;
                return;
            }
            if (question.question_answers.length < 2){
                questionError.message =`Error en "respuestas" de la pregunta: ${index +1}`;
                questionError.statusCode = 400;
                return;
                
            }
            if (question.correct_answer === undefined ||
                question.correct_answer < 0 ||
                question.correct_answer >= question.question_answers.length){
                questionError.message =`Error en "respuesta correcta" de la pregunta: ${index +1}`;
                questionError.statusCode = 400;
                return;
            }

            
            totalPoints += parseInt(question.points);
            
            let questionData = {
                points: question.points,
                question_title: question.question_title,
                question_answers: question.question_answers,
                correct_answer: question.correct_answer
            }
            formatData.questions.push(questionData);
        });

        if(questionError.message){
            const err = new Error(questionError.message);
            err.statusCode = questionError.statusCode;
            throw err;
        }

        formatData.subject = subject;
        formatData.grade = grade;
        formatData.max_points = totalPoints;
        formatData.created_by = teacherId;
        const testDoc = TestModel( formatData);
        const savedTest = await testDoc.save();

        res.status(201).json({
            data: savedTest,
            totalPoints
        })
      
    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
    
}

const applyTest = (req,res,next) => {
    console.log('applyTest');
    res.status(200).json({
        data: 'apply test'
    })
}

module.exports = {
    createTest,
    applyTest
}