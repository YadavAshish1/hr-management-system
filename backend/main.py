from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database import create_db_and_tables, get_session
from models import Employee, EmployeeCreate, EmployeeRead, Attendance, AttendanceCreate, AttendanceRead
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan, title="HRMS Lite API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*" # For development simplicity
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Employee Endpoints

@app.post("/employees/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(*, session: Session = Depends(get_session), employee: EmployeeCreate):
    # Check for duplicate Employee ID or Email
    statement = select(Employee).where((Employee.employee_id == employee.employee_id) | (Employee.email == employee.email))
    results = session.exec(statement).first()
    if results:
        raise HTTPException(status_code=400, detail="Employee with this ID or Email already exists")
    
    db_employee = Employee.model_validate(employee)
    session.add(db_employee)
    session.commit()
    session.refresh(db_employee)
    return db_employee

@app.get("/employees/", response_model=List[EmployeeRead])
def read_employees(*, session: Session = Depends(get_session), offset: int = 0, limit: int = 100):
    employees = session.exec(select(Employee).offset(offset).limit(limit)).all()
    return employees

@app.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(*, session: Session = Depends(get_session), employee_id: int):
    employee = session.get(Employee, employee_id)
    print(employee_id, "employee id to be deleted--", employee)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    session.delete(employee)
    session.commit()
    return None

# Attendance Endpoints

@app.post("/attendance/", response_model=AttendanceRead, status_code=status.HTTP_201_CREATED)
def create_attendance(*, session: Session = Depends(get_session), attendance: AttendanceCreate):
    # Check if employee exists
    employee = session.get(Employee, attendance.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if attendance already marked for this employee on this date (Optional but good)
    statement = select(Attendance).where(Attendance.employee_id == attendance.employee_id).where(Attendance.date == attendance.date)
    existing_attendance = session.exec(statement).first()
    if existing_attendance:
        raise HTTPException(status_code=400, detail="Attendance already marked for this employee on this date")

    db_attendance = Attendance.model_validate(attendance)
    session.add(db_attendance)
    session.commit()
    session.refresh(db_attendance)
    return db_attendance

@app.get("/attendance/{employee_id}", response_model=List[AttendanceRead])
def read_attendance_for_employee(*, session: Session = Depends(get_session), employee_id: int):
    statement = select(Attendance).where(Attendance.employee_id == employee_id)
    attendances = session.exec(statement).all()
    return attendances

@app.get("/attendance/", response_model=List[AttendanceRead])
def read_all_attendance(*, session: Session = Depends(get_session)):
    attendances = session.exec(select(Attendance)).all()
    return attendances
