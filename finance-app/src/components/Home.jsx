import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaPiggyBank,
  FaChartLine,
  FaBell,
  FaFileAlt,
} from "react-icons/fa";
import financeIllustration from "../assests/8432.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container grid grid-cols-1 md:grid-cols-2 gap-8 p-8 mt-16">
      <div className="intro flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">
          Welcome to Your Personal Finance Manager
        </h1>
        <p className="mb-6 text-lg text-gray-700">
          Track your expenses, manage budgets, set savings goals, and gain
          insights into your spending habits. Our intuitive dashboard and
          easy-to-use features help you take control of your finances.
        </p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (token) {
              navigate("/dashboard");
            } else {
              navigate("/sign-up");
            }
          }}
        >
          Get Started
        </button>
      </div>
      <div className="image flex justify-center items-center">
        <img
          src={financeIllustration}
          alt="Finance Illustration"
          className="w-full max-w-lg h-auto"
        />
      </div>
      {/* Features Section */}
      <div className="features-section md:col-span-2 mt-8">
        <h2 className="text-3xl font-semibold mb-4 text-blue-900">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(feature.route)}
            >
              <div className="flex items-center mb-4">
                <div className="text-blue-600 text-4xl mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Example feature data with routes
const featuresData = [
  {
    title: "Expense Tracking",
    description:
      "Easily track and categorize your expenses to see where your money goes.",
    icon: <FaMoneyBillWave />,
    route: "/expense-tracking",
  },
  {
    title: "Budget Management",
    description: "Set and manage budgets to help you save for your goals.",
    icon: <FaClipboardList />,
    route: "/budgeting",
  },
  {
    title: "Savings Goals",
    description: "Create savings goals and track your progress to reach them.",
    icon: <FaPiggyBank />,
    route: "/savings-goals",
  },
  {
    title: "Financial Insights",
    description:
      "Gain insights into your spending habits to improve your financial health.",
    icon: <FaChartLine />,
    route: "/dashboard",
  },
  {
    title: "Reports",
    description:
      "Generate detailed reports to analyze your financial data over time.",
    icon: <FaFileAlt />,
    route: "/reports",
  },
  {
    title: "Notifications",
    description: "Get notified about bill reminders and budget limits.",
    icon: <FaBell />,
    route: "/dashboard", // Or wherever your notifications are shown
  },
];

export default Home;
