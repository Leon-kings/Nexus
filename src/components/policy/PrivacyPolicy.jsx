/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  PrivacyTip,
  Security,
  DataUsage,
  Visibility,
} from "@mui/icons-material";

export const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const sections = [
    {
      icon: PrivacyTip,
      title: "Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.",
    },
    {
      icon: DataUsage,
      title: "How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.",
    },
    {
      icon: Security,
      title: "Information Sharing",
      content:
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.",
    },
    {
      icon: Visibility,
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.",
    },
  ];

  return (
    <>
      <div className="w-full mt-2 mb-0.5 rounded-2xl min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PrivacyTip className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Nexus, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our website and services. Please read
              this privacy policy carefully.
            </p>
          </motion.div>

          {/* Main Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Information */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mt-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Detailed Information
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Data Collection
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Personal identification information (Name, email address,
                    phone number)
                  </li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and tracking technologies</li>
                  <li>Device information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Data Protection
                </h3>
                <p className="text-gray-700 mb-3">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Data encryption at rest</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Contact Us
                </h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please
                  contact us at:{" "}
                  <a
                    href="mailto:privacy@nexus.com"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    privacy@nexus.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Update Notice */}
          <motion.div
            className="bg-blue-50 rounded-2xl p-6 mt-8 border border-blue-200"
            variants={itemVariants}
          >
            <div className="flex items-start">
              <PrivacyTip className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Policy Updates
                </h3>
                <p className="text-blue-800">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new privacy policy on
                  this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
