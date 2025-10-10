/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

export const About = () => {

  const values = [
    {
      title: "Innovation First",
      description:
        "We constantly explore emerging technologies to bring you the most advanced electronics solutions.",
      icon: "🚀",
    },
    {
      title: "Quality Assurance",
      description:
        "Every device undergoes rigorous testing to ensure reliability and peak performance.",
      icon: "✅",
    },
    {
      title: "Customer Focus",
      description:
        "Your satisfaction is our priority. We provide personalized solutions and exceptional support.",
      icon: "❤️",
    },
    {
      title: "Sustainability",
      description:
        "We are committed to eco-friendly practices and responsible electronic waste management.",
      icon: "🌱",
    },
  ];

  const certifications = [
    { name: "ISO 9001 Certified", description: "Quality Management System" },
    { name: "Energy Star Partner", description: "Energy Efficient Products" },
    { name: "EPEAT Registered", description: "Environmental Performance" },
    {
      name: "Microsoft Gold Partner",
      description: "Expertise in Microsoft Solutions",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              About TechNexus
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Leading the future of electronics with innovative computing
              solutions, premium devices, and unparalleled customer experience
              since 2010.
            </p>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </section>


      {/* Mission & Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our Journey
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Founded in 2010, TechNexus began as a small startup with a big
                  vision: to make cutting-edge technology accessible to
                  everyone. What started as a humble computer repair shop has
                  evolved into a leading electronics retailer and custom
                  solutions provider.
                </p>
                <p>
                  Over the years, we've helped over 10,000 customers find their
                  perfect computing solutions. From students needing their first
                  laptop to enterprises requiring complex server infrastructure,
                  we've been there every step of the way.
                </p>
                <p>
                  Today, we partner with 50+ leading technology brands and
                  maintain a 98% customer satisfaction rate. Our commitment to
                  quality, innovation, and customer service remains the
                  foundation of everything we do.
                </p>
              </div>
            </motion.div>

            {/* Mission & Values */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our Mission & Values
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{value.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};