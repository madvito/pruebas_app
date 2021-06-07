# Proyecto para certificación del curso de Node.js de Escalab

## Proyecto: Aplicación de creación y aplicación de pruebas/examenes
## Por Víctor Madrid

## Pasos para ejecutar
### 1 paso: Descargar aplicación.
Descargar el proyecto y luego npm install.

### 2 paso: Levantar servidor.
Según se necesite, para development : npm run dev, o production : npm run start.

### 3 paso: Crear cuenta profesor.
En el endpoint http://localhost:8000/api/v1/admin/teacher con metodo POST se pueden crear profesores con el objeto JSON siguiente:
```
{
    "securityCode": "profe",
    "rut" : "7995352-0",
    "nombre": "Javier",
    "apepat": "Perez",
    "apemat": "Torres",
    "email": "profe1@test.com",
    "password": "prueb@"
}
```
preocupandose de ocupar rut válido chileno, password alfanumerica que puede incluir los signos "@","*" y ".", securityCode que para entorno de development es "profe" y en producción es "M45T3R".

### 4 paso: Login como profesor.
En el endpoint http://localhost:8000/api/v1/user/login con metodo POST se pueden crear profesores con el objeto JSON siguiente:
```
{
    "email": "profe1@test.com",
    "password": "prueb@"
}
```
que de ser correcto, retorna un token que habrá que ingresar como "Authorization" en el header de las peticiones que estén protegidas. 

### 5 paso: Crear cursos.
Ruta protegida, solo con acceso para profesores.
En el endpoint http://localhost:8000/api/v1/admin/grade con metodo POST se pueden crear cursos con el objeto JSON siguiente:
```
{
    "gradeName": "2° Basico A",
    "schoolYear": 2
}
```
donde "gradeName" es el nombre del curso específico y "schoolYear" es el nivel del curso (2 siendo segundo año de escuela básica)

### 6 paso: Crear asignatura y agregarla al profesor.
Ruta protegida, solo con acceso para profesores.
En el endpoint http://localhost:8000/api/v1/admin/subject con metodo POST se pueden crear asignaturas con el objeto JSON siguiente:
```
{
    "subjectName": "Matemáticas"
}
```
donde "subjectName" es el nombre de la asignatura.

Para agregar una asignatura a un profesor existe el endpoint http://localhost:8000/api/v1/admin/teacher/subject/:idProfesor con metodo PUT. 
donde se agrega al profesor el id de la asignatura con el objeto JSON siguiente:
```
{
    "subjectId": "60bdba772cd2222004ba1e24"
}
```

### 7 paso: Agregar niveles escolares al profesor.
Ruta protegida, solo con acceso para profesores.
Es importante tener creados los cursos antes, ya que se ocupan para validar la existencia del nivel.
En el endpoint http://localhost:8000/api/v1/admin/grade/:idProfesor con metodo PUT se pueden crear asignaturas con el objeto JSON siguiente:
```
{
    "grade": 1
}
```
Los niveles se ocuparan para validar el nivel al que creara pruebas el profesor.

### 8 paso: Crear pruebas.
Ruta protegida, solo con acceso para profesores.

En el endpoint http://localhost:8000/api/v1/test/ con metodo POST se pueden crear pruebas con el objeto JSON siguiente:
```
{
    "grade": "60bdaa8e6ec7754e28028cae",
    "subject":"60bdba772cd2222004ba1e24",
    "questions": [
        {
            "points": 2,
            "question_title": "¿Cuanto es 2 + 2?",
            "question_answers": [5, 4, 10, 7],
            "correct_answer": 1
        },
        {
            "points": 2,
            "question_title": "¿como se llama una variable que no puede cambiar su valor?",
            "question_answers": ["Constante", "Objeto", "Arreglo", "Ciclo"],
            "correct_answer": 0
        }
    ]
}
```
en el arreglo "questions" puede ir cualquier cantidad de preguntas, las respuestas deben ser al menos 2 y la respuesta correcta debe ser menor al largo del arreglo de posibles respuestas.

### 9 paso: Responder la prueba.
Ruta protegida, con acceso para estudiantes y profesores.

En el endpoint http://localhost:8000/api/v1/test/:idTest con metodo POST se pueden responder pruebas con el objeto JSON siguiente:
```
{
    "userId": "60bdaa8e6ec7754e28028cae",
    "answers": [3,3,1,4]
}
```
que se guardará con el id de la cuenta que este relacionada al token de Authorization.