"use client";

import { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Course } from './types';

const Home = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const courses: Course[] = [
    { name: "Artificial Intelligence", price: 30000 },
    { name: "Machine Learning", price: 30000 },
    { name: "Python Development", price: 30000 },
    { name: "Flutter App Development & AI Integrations", price: 30000 },
    { name: "Frontend Development", price: 30000 },
    { name: "Graphic Designing", price: 30000 },
    { name: "C++", price: 30000 },
    { name: "Communication Skills", price: 20000 },
  ];

  const handleCourseChange = (course: Course) => {
    setSelectedCourses(prev =>
      prev.some(c => c.name === course.name)
        ? prev.filter(c => c.name !== course.name)
        : [...prev, course]
    );
  };

  const calculateSubtotal = (): number => selectedCourses.reduce((acc, course) => acc + course.price, 0);
  const calculateDiscountedTotal = (): number => calculateSubtotal() * 0.7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone || selectedCourses.length === 0 || !paymentProof) {
      alert("Please fill in all fields and upload payment proof.");
      return;
    }
    console.log(loading);
    setLoading(true);
    console.log(loading);
    setProgress(0); // Reset progress

    setTimeout(async () => {
      try {
        const imageRef = ref(storage, `payments/${Date.now()}_${paymentProof.name}`);
        const uploadTask = uploadBytesResumable(imageRef, paymentProof);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error("Error uploading file:", error);
            alert("Error uploading payment proof. Please try again.");
            setLoading(false);
          },
          async () => {
            const proofUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const totalPrice = calculateDiscountedTotal();

            await addDoc(collection(db, "students"), {
              email,
              name,
              phone,
              courses: selectedCourses,
              proofUrl,
              totalPrice,
              date: Timestamp.now(),
            });

            // Show success modal
            setShowSuccessModal(true);
            resetForm();
          }
        );
      } catch (error) {
        console.error("Error uploading data: ", error);
        alert("Error uploading data. Please try again.");
      }
    }, 0); // Delay execution to let UI update
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setPhone("");
    setSelectedCourses([]);
    setPaymentProof(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading && <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500" style={{ width: `${progress}%` }} />}
      <h1 className="text-3xl font-bold mb-6 text-center">Course Enrollment</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* User Information */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        {/* Course Selection */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Courses</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map(course => (
              <label key={course.name} className="flex items-center space-x-3">
                <input type="checkbox" onChange={() => handleCourseChange(course)}
                  checked={selectedCourses.some(c => c.name === course.name)}
                  className="form-checkbox text-blue-500" />
                <span>{course.name} - PKR {course.price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Selected Courses</h2>
          <ul className="space-y-3 mb-4">
            {selectedCourses.map(course => (
              <li key={course.name} className="flex justify-between">
                <span>{course.name}</span>
                <span>PKR {course.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold mb-2">
            <span>Subtotal:</span>
            <span>PKR {calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between font-semibold text-green-600 mb-2">
            <span>Total after 30% Discount:</span>
            <span>PKR {calculateDiscountedTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-green-600 mb-2">
            <span>Pay to Jazz Cash | Easypaisa:</span>
            <span>0322xxxxx33</span>
          </div>
        </div>

        {/* Payment Proof Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Payment Proof</label>
          <input type="file" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} required
            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading} // Disable button while loading
          className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Submit
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Successful</h2>
            <span className="text-green-500 text-4xl">✔️</span>
            <p className="mt-4">Submission successful! You will soon be added to your course group(s). For more information contact <a href="mailto:nexariza@gmail.com" className="text-blue-500">nexariza@gmail.com</a></p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={()=> { setShowSuccessModal(false); setLoading(false);}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
