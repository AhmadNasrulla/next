"use client";  // Make sure this is at the top of the file

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db, storage } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Course } from '../types';

// Discount Calculation Function
const calculateDiscountedPrice = (course: Course, discountRate: number): number => {
  return course.price * (1 - discountRate);  // Applying the discount to the price
};

const calculateRegistrationFee = (discountRate: number): number => {
  const originalFee = 8000;
  return originalFee * (1 - discountRate);  // Discounted registration fee
};

// Main Step2 Component
const Step2 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get query parameters from the URL
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const selectedCourses = JSON.parse(decodeURIComponent(searchParams.get("selectedCourses") || "[]")) as Course[];

  const calculateSubtotal = (): number =>
    selectedCourses.reduce((acc, course) => acc + course.price, 0);

  const calculateDiscountedTotal = () => {
    const courseSubtotal = calculateSubtotal();
    const registrationFee = calculateRegistrationFee(0.3);  // 30% discount on registration fee
    return courseSubtotal * 0.7 + registrationFee;  // Adding the discounted registration fee to the total
  };

  const handleSubmit = async () => {
    if (!paymentProof) {
      alert("Please upload payment proof.");
      return;
    }
    setLoading(true);

    const imageRef = ref(storage, `payments/${Date.now()}_${paymentProof.name}`);
    const uploadTask = uploadBytesResumable(imageRef, paymentProof);

    uploadTask.on(
      "state_changed",
      (snapshot) => setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading payment proof.");
        setLoading(false);
      },
      async () => {
        const proofUrl = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "students"), {
          email,
          name,
          phone,
          courses: selectedCourses,
          proofUrl,
          totalPrice: calculateDiscountedTotal(),
          date: Timestamp.now(),
        });
        setShowSuccessModal(true);
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Cart Summary</h2>

      {/* Discounted Price Label */}
      <div className="mb-6 flex justify-end text-lg font-semibold text-gray-800">
        <span>Discounted Price</span>
      </div>

      {/* Course List */}
      <ul className="space-y-4 mb-6">
        {selectedCourses.map((course) => {
          const discountedPrice = calculateDiscountedPrice(course, 0.3); // Assuming 30% discount
          return (
            <li key={course.name} className="flex justify-between items-center text-gray-700">
              <div className="flex flex-col">
                <span className="font-medium">{course.name}</span>
                <span className="text-sm text-gray-500">Original Price: PKR {course.price}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-green-500">PKR {discountedPrice.toFixed(2)}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Registration Fee */}
      <div className="flex justify-between items-center mb-6 text-gray-700">
        <div className="flex flex-col">
          <span className="font-medium">Registration Fee</span>
          <span className="text-sm text-gray-500">Original Fee: PKR 8,000</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-green-500">PKR {calculateRegistrationFee(0.3).toFixed(2)}</span>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-6 flex justify-between text-xl font-semibold text-gray-900">
        <span>Total:</span>
        <span>PKR {calculateDiscountedTotal().toFixed(2)}</span>
      </div>

      {/* Payment Methods */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Methods</h3>
        <p className="text-gray-600 mb-2">You can make your payment via the following methods:</p>
        <ul className="list-disc pl-6 text-gray-600">
          <li><strong>Easypaisa:</strong> 03363474545 (Ahmadi saaan)</li>
          <li><strong>Jazz Cash:</strong> 03017073739 (Muhammad Qamar Ayub)</li>
        </ul>
        <p className="text-gray-600 mt-4">Alternatively, you can transfer directly to our bank account:</p>
        <ul className="list-disc pl-6 text-gray-600">
          <li><strong>Bank Name:</strong> MCB</li>
          <li><strong>Account Name:</strong> Muhammad Qamar Ayub</li>
          <li><strong>Account Number:</strong> 0971738301010683</li>
        </ul>
      </div>

      {/* Payment Proof */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="paymentProof">
          Upload Payment Proof
        </label>
        <input
          type="file"
          id="paymentProof"
          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 rounded-lg"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg 
                      ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} transition-colors`}
        >
          {loading ? `Uploading... ${Math.round(progress)}%` : 'Submit Payment'}
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="relative mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute top-0 left-0 right-0 text-center text-sm text-gray-600">{Math.round(progress)}%</div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold text-green-500 mb-4">Submission Successful!</h3>
            <p className="text-gray-700 mb-4">Thank you for your payment. We will process your enrollment shortly.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap Step2 component with Suspenses
const Step2WithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Step2 />
  </Suspense>
);

export default Step2WithSuspense;
