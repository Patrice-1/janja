from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import logging

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def get_db_connection():
    conn = sqlite3.connect("school.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS students (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        first_name TEXT NOT NULL,
                        last_name TEXT NOT NULL,
                        class_name TEXT NOT NULL,
                        registration_number TEXT NOT NULL,
                        grades INTEGER,
                        attendance INTEGER,
                        teacher_id INTEGER,
                        FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE
                    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS teachers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    )''')
    conn.commit()
    conn.close()

# Students Routes
@app.post("/students/")
def add_student(student: dict):
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO students (first_name, last_name, class_name, registration_number, grades, attendance, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                     (student['first_name'], student['last_name'], student['class_name'], student['registration_number'], 0, 0, student.get('teacher_id')))  # Added teacher_id
        conn.commit()
        return {"message": "Student added successfully"}
    except Exception as e:
        logging.error(f"Error adding student: {e}")
        raise HTTPException(status_code=400, detail="Failed to add student")
    finally:
        conn.close()

@app.get("/students/")
def get_students(teacher_id: int = None):
    conn = get_db_connection()
    query = 'SELECT * FROM students'
    params = ()
    if teacher_id:
        query += ' WHERE teacher_id = ?'
        params = (teacher_id,)
    students = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(student) for student in students]

# Teachers Routes
@app.get("/teachers/")
def get_teachers():
    conn = get_db_connection()
    teachers = conn.execute('SELECT * FROM teachers').fetchall()
    conn.close()
    return [dict(teacher) for teacher in teachers]

@app.post("/teachers/")
def add_teacher(teacher: dict):
    conn = get_db_connection()
    conn.execute('INSERT INTO teachers (name) VALUES (?)', (teacher['name'],))
    conn.commit()
    conn.close()
    return {"message": "Teacher added successfully"}

@app.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int):
    conn = get_db_connection()
    conn.execute('DELETE FROM teachers WHERE id = ?', (teacher_id,))
    conn.commit()
    conn.close()
    return {"message": "Teacher deleted successfully"}
