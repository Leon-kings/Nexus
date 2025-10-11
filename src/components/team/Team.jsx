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
    { id: "all", name: "All Team", icon: People },
    { id: "leadership", name: "Leadership", icon: WorkspacePremium },
    { id: "development", name: "Development", icon: Code },
    { id: "design", name: "Design", icon: Palette },
    { id: "marketing", name: "Marketing", icon: Campaign },
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
      name: "Alex Thompson",
      role: "Senior Developer",
      department: "development",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Full-stack developer passionate about clean code, performance optimization, and mentoring.",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      location: "Remote",
      experience: "6 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alex@nexus.com",
        github: "#",
      },
    },
    {
      id: 5,
      name: "Jessica Kim",
      role: "Product Manager",
      department: "leadership",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      bio: "Product strategist focused on delivering exceptional user experiences and business value.",
      skills: ["Product Strategy", "Agile", "Data Analysis"],
      location: "Seattle, WA",
      experience: "9 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "jessica@nexus.com",
        github: "#",
      },
    },
    {
      id: 6,
      name: "David Park",
      role: "DevOps Engineer",
      department: "development",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "Infrastructure specialist ensuring smooth deployments and reliable systems.",
      skills: ["Docker", "Kubernetes", "CI/CD", "Monitoring"],
      location: "Chicago, IL",
      experience: "7 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@nexus.com",
        github: "#",
      },
    },
    {
      id: 7,
      name: "Lisa Wang",
      role: "UX Researcher",
      department: "design",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
      bio: "Research expert dedicated to understanding user needs and driving data-informed design decisions.",
      skills: ["User Research", "Usability Testing", "Analytics"],
      location: "Boston, MA",
      experience: "5 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "lisa@nexus.com",
        github: "#",
      },
    },
    {
      id: 8,
      name: "Ryan Cooper",
      role: "Marketing Director",
      department: "marketing",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      bio: "Growth marketing expert focused on building brand awareness and driving customer acquisition.",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      location: "Miami, FL",
      experience: "10 years",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ryan@nexus.com",
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
      <div className="w-full min-h-screen bg-gradient-to-br mt-2 mb-0.5 rounded-2xl from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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
                  className="bg-white rounded-2xl p-4 shadow-lg text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{dept}</div>
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
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleMemberClick(member)}
              >
                {/* Member Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
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
                        <motion.a
                          key={platform}
                          href={url}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSocialClick(platform, member.name);
                          }}
                          className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon className="w-4 h-4 text-gray-700" />
                        </motion.a>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Location & Experience */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <LocationOn className="w-4 h-4" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{member.experience}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our growing
              team. Check out our open positions and become part of something
              amazing.
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.info("🚀 Opening careers page...")}
            >
              View Open Positions
            </motion.button>
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedMember.name}
                </h2>
                <p className="text-blue-600 text-xl font-medium mb-4">
                  {selectedMember.role}
                </p>
                <p className="text-gray-700 mb-6">{selectedMember.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Details
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <LocationOn className="w-4 h-4" />
                        <span>{selectedMember.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Business className="w-4 h-4" />
                        <span className="capitalize">
                          {selectedMember.department}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
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
                        <motion.a
                          key={platform}
                          href={url}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleSocialClick(platform, selectedMember.name)
                          }
                        >
                          <Icon className="w-5 h-5" />
                          <span className="capitalize">{platform}</span>
                        </motion.a>
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
