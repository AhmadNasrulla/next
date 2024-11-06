// CourseSelection.tsx
import React from 'react';
import { Course } from './types';

interface CourseSelectionProps {
  courses: Course[];
  selectedCourses: Course[];
  handleCourseChange: (course: Course) => void;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({ courses, selectedCourses, handleCourseChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">Select Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map(course => (
          <label key={course.name} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              onChange={() => handleCourseChange(course)}
              checked={selectedCourses.some(c => c.name === course.name)}
              className="form-checkbox text-blue-500" 
            />
            <span>{course.name} - PKR {course.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;
