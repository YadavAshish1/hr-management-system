from typing import Optional, List
from datetime import date
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, Integer, ForeignKey

class EmployeeBase(SQLModel):
    employee_id: str = Field(index=True, unique=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    department: str

class Employee(EmployeeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    attendances: List["Attendance"] = Relationship(back_populates="employee", sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
            "passive_deletes": True
        })

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase):
    id: int

class AttendanceBase(SQLModel):
    date: date
    status: str  # "Present" or "Absent"
    employee_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("employee.id", ondelete="CASCADE"),
            nullable=False
        )
    )

class Attendance(AttendanceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee: Optional[Employee] = Relationship(back_populates="attendances")

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceRead(AttendanceBase):
    id: int
