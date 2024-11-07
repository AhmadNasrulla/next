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
    { name: "Communication Skills", price: 20000 },
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
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Course Enrollment</h1>

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold">Unlock Your Potential with Nexariza!</h2>
        <p className="text-sm">Invest in yourself and boost your career with industry-relevant skills.</p>
        <p className="mt-2 font-bold text-lg">Get a 30% Discount on all courses!</p>
      </div>

      {/* Course Details Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Course Details</h3>
        <p className="text-sm text-gray-700">⏳ <strong>Course Duration:</strong> 3 Months (12 Weeks)</p>
        <p className="text-sm text-gray-700">🗓️ <strong>Class Schedule:</strong> Weekend Classes Starting From 16-Nov-2024</p>
        <p className="text-sm text-gray-700">💰 <strong>Registration Fee:</strong> 8,000 PKR</p>
      </div>

      {/* Reasons to Choose Nexariza */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 Why Choose Nexariza?</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li className="mb-2">
            🎖️ <strong>Top Recognition for Outstanding Students:</strong> The Top 3 performers in each course will receive a Free Internship Letter 📝 — a valuable addition to boost your professional profile!
          </li>
          <li className="mb-2">
            💼 <strong>Flexible Weekend Learning:</strong> Perfect for students who are busy or budget-conscious 💸, our weekend schedule allows you to develop in-demand skills without interrupting your weekday work or studies.
          </li>
          <li className="mb-2">
            🏛️ <strong>University-Style Learning System:</strong> Nexariza follows a university-style credit hour system for structured and in-depth education, just like academic institutions.
          </li>
          <li className="mb-2">
            💵 <strong>High-Quality Courses at an Affordable Price:</strong> Get industry-relevant skills with our premium courses at an unmatched price. With a 30% discount, we make skill development accessible to everyone.
          </li>
        </ul>
      </div>

      {/* Enrollment Form */}
      <form onSubmit={(e) => e.preventDefault()} className="bg-white shadow-md rounded-lg p-6">
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Discounted Pricing Section */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Course Fees</h3>
          <p className="text-sm text-gray-700">Discounted prices after 30% off.</p>
        </div>

        {/* Course Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select Courses</h2>
          {courses.map((course) => {
            const discountedPrice = course.price * 0.7;
            return (
              <div key={course.name} className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id={course.name}
                  onChange={() => handleCourseChange(course)}
                  className="mr-2"
                />
                <label htmlFor={course.name} className="text-sm flex-1">
                  <span>{course.name}</span>
                  <div className="flex items-center mt-1">
                    <span className="line-through text-gray-500 mr-2">PKR {course.price}</span>
                    <span className="text-green-500 font-semibold">PKR {discountedPrice.toFixed(2)}</span>
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Step1; //
