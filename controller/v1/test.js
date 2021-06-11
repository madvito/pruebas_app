const TestModel = require('../../models/test_model');
const GradeModel = require('../../models/grade_model');
const SubjectModel = require('../../models/subject_model');
const AnsweredTestModel = require('../../models/answered_test_model');

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
            message: 'Prueba se creo correctamente'
        })
      
    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
    
}

const applyTest = async(req,res,next) => {
    try {
        const {studentId, studentGrade} = req.student;
        const {testId} = req.params;

        const testDoc = await TestModel.findById(testId);
        if (!testDoc){
            const err = new Error('La prueba no existe');
            err.statusCode = 400;
            throw err;
        }
        if (studentGrade.toString() != testDoc.grade.toString()){
            console.log('studentGrade',studentGrade);
            console.log('testDoc.grade',testDoc.grade);
            const err = new Error('El estudiante no tiene permiso para hacer esta prueba');
            err.statusCode = 401;
            throw err;
        }

        const {answers} = req.body;
        const {questions} = testDoc;

        if (answers.length != questions.length){
            const err = new Error('La cantidad de respuestas no corresponde a esta prueba');
            err.statusCode = 400;
            throw err;
        }

        if (answers.some(isNaN)){
            const err = new Error('Hay respuestas con formato equivocado');
            err.statusCode = 400;
            throw err;
        }

        let points = 0;

        questions.map((question, index) => {
            if (question.correct_answer == answers[index]){
                points += question.points;
            }
        })

        const answeredTest = {
            test_id: testId,
            student_id: studentId,
            answers,
            score: points,
            approvalPercentage: (parseFloat(points)/parseFloat(testDoc.max_points))*100
        }

        const answeredTestDoc = await AnsweredTestModel(answeredTest).save();

        res.status(200).json({
            data: answeredTestDoc,
            message: "Prueba respondida fue ingresada con exito"
        })
    } catch (e) {
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

const getAllTests = async (req, res, next) => {
    try {
        const testsDoc = await TestModel.find().populate('subject').populate('grade').populate('created_by');
        res.status(200).json({
            data: testsDoc
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

const getTestById = async (req, res, next) => {
    try {
        const {testId} = req.params;
        const testDoc = await TestModel.findById(testId).populate('subject').populate('grade').populate('created_by');

        if (!testDoc){
            const err = new Error('Prueba no existe');
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            data: testDoc
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

const getAnsweredTestById = async (req, res, next) => {
    try {
        const {testId} = req.params;
        const answeredTestDoc = await AnsweredTestModel.find({test_id: testId}).populate('student_id').populate('test_id');
        if (answeredTestDoc.length == 0){
            const err = new Error('Prueba no existe');
            err.statusCode = 404;
            throw err;
        }
        console.log(answeredTestDoc);
        res.status(200).json({
            data: answeredTestDoc
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

module.exports = {
    createTest,
    applyTest,
    getAllTests,
    getTestById,
    getAnsweredTestById
}