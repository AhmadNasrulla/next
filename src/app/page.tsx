"use client"; // This enables client-side rendering

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from './types';

const Step1 = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const courses: Course[] = [
    { name: "Artificial Intelligence", price: 30000 },
    { name: "Machine Learning", price: 30000 },
    { name: "Python Development", price: 30000 },
    { name: "App Development & AI Integration", price: 30000 },
    { name: "Web (Front-End) Development", price: 30000 },
    { name: "C++ Programming", price: 30000 },
    { name: "Graphic Designing", price: 30000 },
    { name: "Communication Skill", price: 20000 },


    // Other courses...
  ];

  const handleCourseChange = (course: Course) => {
    setSelectedCourses(prev =>
      prev.some(c => c.name === course.name)
        ? prev.filter(c => c.name !== course.name)
        : [...prev, course]
    );
  };

  const handleContinue = () => {
    if (!email || !name || !phone || selectedCourses.length === 0) {
      alert("Please fill in all fields and select at least one course.");
      return;
    }
    const selectedCoursesParam = encodeURIComponent(JSON.stringify(selectedCourses));
    router.push(`/step2?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&selectedCourses=${selectedCoursesParam}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Enrollment</h1>
      <form onSubmit={(e) => e.preventDefault()} className="bg-white shadow-md rounded-lg p-6">
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-semibold">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Course Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select Courses</h2>
          {courses.map((course) => (
            <div key={course.name} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={course.name}
                onChange={() => handleCourseChange(course)}
                className="mr-2"
              />
              <label htmlFor={course.name} className="text-sm">{course.name} - PKR {course.price}</label>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Step1;
