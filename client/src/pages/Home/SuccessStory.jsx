import Rating from "react-rating";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "motion/react";

const SuccessStory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["topStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories/top");
      return res.data;
    },
  });

  if (!isLoading && !isError) {
    return (
      <motion.section className="w-11/12 md:w-8/12 mx-auto p-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: "easeOut" }}>
        <h2 className="text-2xl md:text-4xl font-bold text-center text-neutral mb-8">
          Our <span className="text-primary">Success</span> Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <motion.div key={story._id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.3,
                ease: "easeOut",
              }}>
              <img src={story.coupleImage} alt="Couple" className="w-full h-48 object-cover" />

              <div className="p-5">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  Married on:{" "}
                  <time dateTime={story.dateOfMarriage}>
                    {new Date(story.dateOfMarriage).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </p>

                <Rating initialRating={story.rating} fractions={2} readonly
                  emptySymbol={<FaRegStar className="text-pink-300" size={20} />}
                  fullSymbol={<FaStar className="text-pink-500" size={20} />}
                  placeholderSymbol={<FaStarHalfAlt className="text-pink-500" size={20} />}
                />

                <p className="mt-4 text-gray-700 italic text-sm line-clamp-4 overflow-hidden">{story.review}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }
};

export default SuccessStory;