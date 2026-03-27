import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Feedbacks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        rating,
        studentId: "S123",
      };

      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Feedback submitted!");
        reset();
        setRating(0);
      } else {
        alert(result.message);
      }

    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-xl">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-surface">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textPrimary">Feedback Center</h1>
          <p className="text-textSecondary">Help us improve your project recommendations</p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT: FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* ⭐ STAR RATING */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={`cursor-pointer transition ${
                        (hover || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => {
                        setRating(star);
                        setValue("rating", star);
                      }}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    />
                  ))}
                </div>

                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">Rating is required</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  rows="4"
                  {...register("comments", {
                    required: "Comments required",
                    maxLength: {
                      value: 300,
                      message: "Max 300 characters",
                    },
                  })}
                  placeholder="Share your thoughts about the recommendations..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>
                )}
              </div>

              {/* Improvement Areas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What can we improve?
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {["skills", "availability", "interest", "other"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 bg-gray-50 border p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        {...register("improvementAreas")}
                        className="accent-blue-600"
                      />
                      <span className="capitalize text-gray-700">
                        {item === "skills" && "Skills Matching"}
                        {item === "availability" && "Availability"}
                        {item === "interest" && "Interest Alignment"}
                        {item === "other" && "Other"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Submit Feedback
              </motion.button>

            </form>
          </motion.div>

          {/* RIGHT: INSIGHTS PANEL */}
          <div className="space-y-4">

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm font-semibold">This Week</p>
              <h2 className="text-2xl font-bold text-blue-600">20 Projects</h2>
              <p className="text-gray-600 text-sm">You appeared as a top match</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm font-semibold">Success Rate</p>
              <h2 className="text-2xl font-bold text-accent">85%</h2>
              <p className="text-gray-600 text-sm">Students accepted recommendations</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500 text-sm font-semibold">Your Strength</p>
              <h2 className="text-lg font-bold text-secondary">AI & Web Dev</h2>
              <p className="text-gray-600 text-sm">Most matched skill areas</p>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary
               shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105
               text-sm text-center text-white p-5 rounded-xl shadow">
              <p className="text-xl font-semibold">Tip💡</p>
              <p className="text-sm mt-1 font-semibold">Updating your skills increases match accuracy</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Feedbacks;
