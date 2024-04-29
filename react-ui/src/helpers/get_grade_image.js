import { gradeMap } from "./grade_map";

export const getGradeImage = (grade, width = 30) => {
    if (grade) {
        const massagedGrade = gradeMap[grade];

        if (massagedGrade === 'A') return <img width={width} src='/grades/a.svg' alt="grade a" />
        else if (massagedGrade === 'B') return <img width={width} src='/grades/b.svg' alt="grade b" />
        else if (massagedGrade === 'C') return <img width={width} src='/grades/c.svg' alt="grade c" />
        else if (massagedGrade === 'Grade Pending') return <img width={width} src='/grades/gp.svg' alt="grade pending" />
        else if (massagedGrade === 'Not Yet Graded') return <img width={width} src='/grades/nyg.svg' alt="not yet graded" />
        else if (massagedGrade === 'Just Re-opened') return <img width={width} src='/grades/gp.svg' alt="just re-opened" />
        else return grade;
    }
    else return grade;
}
