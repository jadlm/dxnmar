const TestimonialCard = ({ text }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-700">“{text}”</p>
    </div>
  );
};

export default TestimonialCard;
