/* eslint-disable no-unused-vars */
// components/Team.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  People,
  Diversity3,
  LinkedIn,
  Twitter,
  Email,
  GitHub,
  Business,
  Star,
  WorkspacePremium,
  LocationOn,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Team = () => {
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const departments = [
    {
      id: "all",
      name: "All Team",
      icon: People,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "leadership",
      name: "Leadership",
      icon: WorkspacePremium,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "development",
      name: "Development",
      icon: Code,
      color: "from-green-500 to-green-600",
    },
    {
      id: "design",
      name: "Design",
      icon: Palette,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: Campaign,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "CEO & Founder",
      department: "leadership",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Visionary leader with 10+ years of experience in tech entrepreneurship. Passionate about innovation and team growth.",
      skills: ["Leadership", "Strategy", "Product Development"],
      location: "San Francisco, CA",
      experience: "12 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@nexus.com",
        github: "#",
      },
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "CTO",
      department: "leadership",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Technology expert specializing in scalable architecture and cutting-edge development practices.",
      skills: ["System Architecture", "Cloud Computing", "DevOps"],
      location: "New York, NY",
      experience: "15 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "marcus@nexus.com",
        github: "#",
      },
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Lead Designer",
      department: "design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Creative designer with a passion for user-centered design and beautiful, functional interfaces.",
      skills: ["UI/UX Design", "Design Systems", "User Research"],
      location: "Austin, TX",
      experience: "8 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@nexus.com",
        github: "#",
      },
    },
    {
      id: 4,
      name: "Emily Watson",
      role: "Lead Designer",
      department: "design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Creative designer with a passion for user-centered design and beautiful, functional interfaces.",
      skills: ["UI/UX Design", "Design Systems", "User Research"],
      location: "Austin, TX",
      experience: "8 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@nexus.com",
        github: "#",
      },
    },
  ];

  const filteredMembers =
    activeDepartment === "all"
      ? teamMembers
      : teamMembers.filter((member) => member.department === activeDepartment);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    toast.info(`👋 Learning more about ${member.name}`);
  };

  const handleSocialClick = (platform, memberName) => {
    toast.success(`🔗 Opening ${platform} for ${memberName}`);
  };

  const departmentStats = {
    leadership: teamMembers.filter((m) => m.department === "leadership").length,
    development: teamMembers.filter((m) => m.department === "development")
      .length,
    design: teamMembers.filter((m) => m.department === "design").length,
    marketing: teamMembers.filter((m) => m.department === "marketing").length,
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br mt-2 mb-0.5 rounded-2xl from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" />
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Diversity3 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-blue-500 mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Talented professionals dedicated to delivering exceptional
              results. Get to know the brilliant minds behind Nexus.
            </p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {Object.entries(departmentStats).map(([dept, count]) => (
                <motion.div
                  key={dept}
                  className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 shadow-lg text-center border border-gray-200 dark:border-gray-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {dept}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Department Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            {departments.map((dept) => (
              <motion.button
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeDepartment === dept.id
                    ? `bg-gradient-to-b ${dept.color} text-white shadow-lg`
                    : "bg-gradient-to-b from-blue-300 to-indigo-400 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-gray-50 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-md border border-gray-300 dark:border-gray-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <dept.icon className="w-5 h-5" />
                <span>{dept.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Team Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-600"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleMemberClick(member)}
              >
                {/* Member Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt=""
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Social Links */}
                  <motion.div
                    className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: 20 }}
                    whileHover={{ x: 0 }}
                  >
                    {Object.entries(member.social).map(([platform, url]) => {
                      const Icon =
                        platform === "linkedin"
                          ? LinkedIn
                          : platform === "twitter"
                          ? Twitter
                          : platform === "github"
                          ? GitHub
                          : Email;
                      return (
                        <motion.button
                          key={platform}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSocialClick(platform, member.name);
                          }}
                          className="bg-gradient-to-b from-white to-gray-500 p-2 rounded-full hover:from-white hover:to-gray-200 dark:hover:from-gray-500 dark:hover:to-gray-600 transition-all shadow-md border border-gray-300 dark:border-gray-500"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-indigo-500 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-500 text-sm mb-4 line-clamp-2">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-b from-gray-100 to-gray-200  text-black  text-xs rounded-full border border-gray-300 dark:border-gray-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Location & Experience */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex text-blue-500 items-center space-x-1">
                      <LocationOn className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex text-green-500 items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{member.experience}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-600"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedMember.image}
                  alt=''
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 bg-gradient-to-b from-red-500 to-red-700 p-2 rounded-full text-white transition-all shadow-md border border-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-indigo-500  mb-2">
                  {selectedMember.name}
                </h2>
                <p className="text-blue-600 text-xl font-medium mb-4">
                  {selectedMember.role}
                </p>
                <p className="text-black mb-6">
                  {selectedMember.bio}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-200 rounded-full text-sm border border-blue-300 dark:border-blue-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Details
                    </h4>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <div className="flex text-blue-300 items-center space-x-2">
                        <LocationOn className="w-4 h-4" />
                        <span>{selectedMember.location}</span>
                      </div>
                      <div className="flex text-blue-200 items-center space-x-2">
                        <Business className="w-4 h-4" />
                        <span className="capitalize">
                          {selectedMember.department}
                        </span>
                      </div>
                      <div className="flex text-blue-300 items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>{selectedMember.experience} experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {Object.entries(selectedMember.social).map(
                    ([platform, url]) => {
                      const Icon =
                        platform === "linkedin"
                          ? LinkedIn
                          : platform === "twitter"
                          ? Twitter
                          : platform === "github"
                          ? GitHub
                          : Email;
                      return (
                        <motion.button
                          key={platform}
                          onClick={() =>
                            handleSocialClick(platform, selectedMember.name)
                          }
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-b from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 text-white rounded-lg transition-all border border-gray-400 dark:border-gray-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="capitalize">{platform}</span>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

// Add missing icons
const Code = ({ className }) => <span className={className}>💻</span>;
const Palette = ({ className }) => <span className={className}>🎨</span>;
const Campaign = ({ className }) => <span className={className}>📢</span>;
