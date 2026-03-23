import React from 'react'
import Navbar from '../../components/Navbar'
import { useForm } from "react-hook-form";

const Feedbacks = () => {
    const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

//   // Function to handle form submission
//   const onSubmit = (data) => {
//     console.log("Feedback submitted:", data);
//     alert("Thank you for your feedback!");
//     reset(); // clear form after submission
//   };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        studentId: "S123", // replace with logged-in user later
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
      } else {
        alert(result.message);
      }

    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-surface">
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Recommendation Feedback
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Rating */}
          <div>
            <label>Rating *</label>
            <select
              {...register("rating", {
                required: "Rating is required",
                min: 1,
                max: 5,
              })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>
            {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
          </div>

          {/* Comments */}
          <div>
            <label>Comments *</label>
            <textarea
              {...register("comments", {
                required: "Comments required",
                maxLength: {
                  value: 300,
                  message: "Max 300 characters",
                },
              })}
              className="w-full border p-2 rounded"
            />
            {errors.comments && <p className="text-red-500 text-xs">{errors.comments.message}</p>}
          </div>

          {/* Improvement Areas (MULTI SELECT) */}
          <div>
            <label>Improvement Areas</label>

            <div className="flex flex-col gap-2 mt-1">
              <label>
                <input type="checkbox" value="skills" {...register("improvementAreas")} />
                Skills Matching
              </label>

              <label>
                <input type="checkbox" value="availability" {...register("improvementAreas")} />
                Availability
              </label>

              <label>
                <input type="checkbox" value="interest" {...register("improvementAreas")} />
                Interest Alignment
              </label>

              <label>
                <input type="checkbox" value="other" {...register("improvementAreas")} />
                Other
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Submit Feedback
          </button>

        </form>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Feedbacks
