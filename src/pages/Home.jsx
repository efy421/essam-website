import React from 'react';
import Hero from '../components/sections/Hero';
import PhilosophyManifesto from '../components/sections/PhilosophyManifesto';
import AboutAndCapabilities from '../components/sections/AboutAndCapabilities';
import TrustpilotSection from '../components/sections/TrustpilotSection';
import CourseSection from '../components/sections/CourseSection';
import LatestWriting from '../components/sections/LatestWriting';

const Home = () => {
  return (
    <>
      <div id="home"><Hero /></div>
      <div id="about"><PhilosophyManifesto /></div>
      <AboutAndCapabilities />
      <div id="reviews"><TrustpilotSection /></div>
      <div id="course"><CourseSection /></div>
      <LatestWriting />
    </>
  );
};

export default Home;