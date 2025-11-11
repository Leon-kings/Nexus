/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Cookie, Analytics, Security, Settings } from "@mui/icons-material";

export const CookiePolicy = () => {
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

  const cookieTypes = [
    {
      icon: Cookie,
      name: "Essential Cookies",
      description: "Required for the website to function properly",
      duration: "Session",
      purpose: "Authentication, security, and basic functionality",
    },
    {
      icon: Analytics,
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      duration: "2 years",
      purpose: "Website analytics and performance monitoring",
    },
    {
      icon: Settings,
      name: "Preference Cookies",
      description: "Remember your settings and preferences",
      duration: "1 year",
      purpose: "Language settings, theme preferences, and customized content",
    },
    {
      icon: Security,
      name: "Security Cookies",
      description: "Help identify and prevent security risks",
      duration: "Session",
      purpose: "Fraud prevention and security monitoring",
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen mt-2 mb-0.5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Cookie className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-blue-500 mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding how we use cookies and similar technologies
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
              About Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and understanding how
              you use our site.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains what cookies are, how we use them, and
              how you can manage your cookie preferences.
            </p>
          </motion.div>

          {/* Cookie Types Grid */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Types of Cookies We Use
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6"
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <cookie.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {cookie.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {cookie.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">
                        {cookie.duration}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Purpose:</span>
                      <p className="text-gray-900 mt-1">{cookie.purpose}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cookie Management */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Managing Your Cookie Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Browser Settings
                </h3>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies through your browser
                  settings. Most browsers allow you to refuse cookies or delete
                  existing ones. However, disabling essential cookies may affect
                  the functionality of our website.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Google Chrome: Settings → Privacy and security → Cookies and
                    other site data
                  </li>
                  <li>
                    Mozilla Firefox: Options → Privacy & Security → Cookies and
                    Site Data
                  </li>
                  <li>
                    Safari: Preferences → Privacy → Cookies and website data
                  </li>
                  <li>
                    Microsoft Edge: Settings → Cookies and site permissions →
                    Cookies and site data
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Third-Party Cookies
                </h3>
                <p className="text-gray-700">
                  Some cookies are placed by third-party services that appear on
                  our pages. We have no control over these third-party cookies
                  and you should check the respective privacy policies of these
                  third parties for more information.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Consent Section */}
          <motion.div
            className="bg-green-50 rounded-2xl p-6 border border-green-200"
            variants={itemVariants}
          >
            <div className="flex items-start">
              <Settings className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Your Consent
                </h3>
                <p className="text-green-800 mb-4">
                  By continuing to use our website, you consent to our use of
                  cookies as described in this policy. You can withdraw your
                  consent at any time by managing your cookie preferences.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="bg-gray-50 rounded-2xl p-6 mt-8"
            variants={itemVariants}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Questions About Our Cookie Policy?
            </h3>
            <p className="text-gray-700">
              If you have any questions about how we use cookies, please contact
              us at:{" "}
              <button
                href="mailto:cookies@nexus.com"
                className="bg-gradient-to-b from-blue-500 to-indigo-400"
              >
                leon@nexuselectronics.com
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
