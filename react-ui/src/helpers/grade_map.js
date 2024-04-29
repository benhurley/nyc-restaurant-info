export const gradeMap = {
    'A': "A",
    'B': "B",
    'C': "C",
    'Z': 'Grade Pending',
    'N': 'Not Yet Graded',
    'P': 'Just Re-opened'
};

export const reverseGradeMap = {
    "A": 'A',
    "B": 'B',
    "C": 'C',
    'Grade Pending': 'Z',
    'Not Yet Graded': 'N',
    'Just Re-opened': 'P',
};

export const getGrades = () => [
    {grade: 'A'},
    {grade: 'B'},
    {grade: 'C'},
    {grade: 'Grade Pending'},
    {grade: 'Not Yet Graded'},
    {grade: 'Just Re-opened'},
]