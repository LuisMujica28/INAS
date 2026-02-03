
const SCHEDULE_DB = {
    "transicion": {
        name: "Transición",
        blocks: [
            ["Lenguaje", "Ed. Física", "Inglés", "Biología", "Lenguaje"],
            ["Matemáticas", "Tecnología", "Matemáticas", "Artes", "Biología"],
            ["Inglés", "Inglés", "Lenguaje", "Lenguaje", "Inglés"],
            ["Sociales", "Matemáticas", "Ética–Religión", "Matemáticas", "Sociales"]
        ]
    },
    // ... I will copy the minimal needed or just read the file. 
    // Actually, it's better to just import the existing file if I can, but it's not a module.
    // I'll just read the file and paste the relevant parts or write a script that duplicates the data for checking.
    // Copying the data from generate_teacher_report.js is safer.
    "101": {
        blocks: [
            ["Matemáticas", "Inglés", "Matemáticas", "Lenguaje", "Sociales"],
            ["Inglés", "Biología", "Inglés", "Geometría", "Inglés"],
            ["Ed. Física", "Ética-Religión", "Sociales", "Artes", "Biología"],
            ["Lenguaje", "Lenguaje", "Lenguaje", "Tecnología", "Matemáticas"]
        ]
    },
    "201": {
        blocks: [
            ["Sociales", "Geometría", "Lenguaje", "Matemáticas", "Inglés"],
            ["Lenguaje", "Inglés", "Ética-Religión", "Lenguaje", "Lenguaje"],
            ["Biología", "Artes", "Inglés", "Ed. Física", "Tecnología"],
            ["Matemáticas", "Sociales", "Matemáticas", "Sociales", "Biología"]
        ]
    },
    "301": {
        blocks: [
            ["Inglés", "Lenguaje", "Biología", "Ed. Física", "Geometría"],
            ["Artes", "Ética-Religión", "Lenguaje", "Tecnología", "Matemáticas"],
            ["Matemáticas", "Sociales", "Matemáticas", "Sociales", "Lenguaje"],
            ["Biología", "Química", "Inglés", "Inglés", "Sociales"]
        ]
    },
    "401": {
        blocks: [
            ["Biología", "Química", "Ed. Física", "Tecnología", "Sociales"],
            ["Matemáticas", "Lenguaje", "Biología", "Sociales", "Matemáticas"],
            ["Sociales", "Matemáticas", "Geometría", "Inglés", "Ética-Religión"],
            ["Inglés", "Inglés", "Artes", "Lenguaje", "Lenguaje"] // Friday last block: Lenguaje
        ]
    },
    "501": {
        blocks: [
            ["Inglés", "Biología", "Química", "Ética-Religión", "Biología"],
            ["Lenguaje", "Ed. Física", "Lenguaje", "Inglés", "Lenguaje"],
            ["Tecnología", "Matemáticas", "Inglés", "Matemáticas", "Matemáticas"],
            ["Artes", "Geometría", "Sociales", "Sociales", "Sociales"]
        ]
    },
    "601": {
        blocks: [
            ["Matemáticas", "Matemáticas", "Lenguaje", "Lenguaje", "Biología"],
            ["Sociales", "Sociales", "Geometría", "Química", "Sociales"],
            ["Artes", "Biología", "Ed. Física", "Ética-Religión", "Inglés"],
            ["Lenguaje", "Inglés", "Inglés", "Matemáticas", "Tecnología"]
        ]
    },
    "602": {
        blocks: [
            ["Lenguaje", "Sociales", "Tecnología", "Inglés", "Lenguaje"],
            ["Biología", "Geometría", "Sociales", "Ética-Religión", "Inglés"],
            ["Inglés", "Ed. Física", "Química", "Matemáticas", "Sociales"],
            ["Matemáticas", "Artes", "Lenguaje", "Biología", "Matemáticas"]
        ]
    },
    "701": {
        blocks: [
            ["Lenguaje", "Sociales", "Matemáticas", "Matemáticas", "Tecnología"],
            ["Matemáticas", "Inglés", "Sociales", "Ed. Física", "Biología"],
            ["Sociales", "Lenguaje", "Geometría", "Inglés", "Artes"],
            ["Biología", "Ética-Religión", "Lenguaje", "Química", "Inglés"]
        ]
    },
    "801": {
        blocks: [
            ["Ed. Física", "Lenguaje", "Inglés", "Física", "Inglés"],
            ["Biología", "Matemáticas", "Artes", "Sociales", "Lenguaje"],
            ["Lenguaje", "Geometría", "Química", "Tecnología", "Matemáticas"],
            ["Inglés", "Sociales", "Sociales", "Ética-Religión", "Biología"]
        ]
    },
    "802": {
        blocks: [
            ["Biología", "Inglés", "Ética-Religión", "Biología", "Ed. Física"],
            ["Sociales", "Lenguaje", "Inglés", "Lenguaje", "Artes"],
            ["Matemáticas", "Química", "Geometría", "Sociales", "Sociales"],
            ["Lenguaje", "Física", "Tecnología", "Inglés", "Matemáticas"]
        ]
    },
    "901": {
        blocks: [
            ["Sociales", "Ética-Religión", "Inglés", "Inglés", "Sociales"],
            ["Ed. Física", "Lenguaje", "Tecnología", "Geometría", "Matemáticas"],
            ["Lenguaje", "Sociales", "Lenguaje", "Inglés", "Química"],
            ["Física", "Biología", "Matemáticas", "Artes", "Inglés"]
        ]
    },
    "1001": {
        blocks: [
            ["Matemáticas", "Lenguaje", "Sociales", "Filosofía", "Matemáticas"],
            ["Inglés", "Artes", "Matemáticas", "Lenguaje", "Ed. Física"],
            ["Ética-Religión", "Física", "Inglés", "Química", "Inglés"],
            ["Sociales", "Tecnología", "Química", "Física", "Lenguaje"]
        ]
    },
    "1101": {
        blocks: [
            ["Ética-Religión", "Física", "Filosofía", "Sociales", "Inglés"],
            ["Matemáticas", "Química", "Ed. Física", "Física", "Matemáticas"],
            ["Química", "Lenguaje", "Sociales", "Lenguaje", "Lenguaje"],
            ["Tecnología", "Inglés", "Matemáticas", "Inglés", "Artes"]
        ]
    }
};

const TEACHER_ASSIGNMENTS = {
    "inglés": {
        "transicion": "Sonia Agudelo", "101": "Sonia Agudelo", "201": "Sonia Agudelo", "301": "Sonia Agudelo", "401": "Sonia Agudelo",
        "501": "Laura Carolina Bernal", "601": "Laura Carolina Bernal", "602": "Laura Carolina Bernal", "701": "Laura Carolina Bernal", "801": "Laura Carolina Bernal", "802": "Laura Carolina Bernal",
        "901": {
            "default": "Maritza Triana",
            "exceptions": [
                { day: 3, block: 0, teacher: "Sonia Agudelo" } // Thursday (3), Block 0
            ]
        },
        "1001": "Maritza Triana", "1101": "Maritza Triana"
    }
};

function getTeacher(subject, grade, dayIndex, blockIndex) {
    if (!subject || subject === "DESCANSO" || subject === "---") return "";
    const subjKey = subject.toLowerCase().trim();
    const assignment = TEACHER_ASSIGNMENTS[subjKey];

    if (assignment) {
        let gradeConfig = assignment[grade];
        if (typeof gradeConfig === 'string') return gradeConfig;
        if (typeof gradeConfig === 'object' && gradeConfig !== null) {
            if (gradeConfig.exceptions) {
                const exception = gradeConfig.exceptions.find(ex => ex.day === dayIndex && ex.block === blockIndex);
                if (exception) return exception.teacher;
            }
            return gradeConfig.default || "Desconocido";
        }
        return assignment["default"] || "Desconocido";
    }
    return "";
}

console.log("Checking Sonia Agudelo for Friday (Day 4 in 0-based index) Last Block (Block 3 in 0-based index)...");
const DAY_INDEX = 4; // Friday
const BLOCK_INDEX = 3; // Last Block

Object.keys(SCHEDULE_DB).forEach(grade => {
    const blocks = SCHEDULE_DB[grade].blocks;
    if (blocks[BLOCK_INDEX]) {
        const subject = blocks[BLOCK_INDEX][DAY_INDEX];
        const teacher = getTeacher(subject, grade, DAY_INDEX, BLOCK_INDEX);
        if (teacher === "Sonia Agudelo") {
            console.log(`- Sonia is teaching ${subject} in Grade ${grade} on Friday Last Block.`);
        }
    }
});
console.log("Check complete.");
