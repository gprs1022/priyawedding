import React, { useState } from 'react';
import Background3D from './components/Background3D';
import IntroModal from './components/IntroModal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TheCouple from './components/TheCouple';
import Ceremonies from './components/Ceremonies';
import MomentsGallery from './components/MomentsGallery';
import Blessings from './components/Blessings';
import Footer from './components/Footer';
import StoryPosterModal from './components/StoryPosterModal';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [unmuteVideo, setUnmuteVideo] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const handleEnterExperience = () => {
    setShowIntro(false);
    setUnmuteVideo(true);
  };

  const handleExploreScroll = () => {
    const coupleSec = document.getElementById('couple');
    if (coupleSec) {
      coupleSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="wedding-app-container">
      {/* Three.js Background Particle Canvas */}
      <Background3D />

      {/* Sacred Inception Preloader Modal */}
      {showIntro && <IntroModal onEnter={handleEnterExperience} />}

      {/* Main Experience Layout */}
      {!showIntro && (
        <>
          <Navbar onOpenStoryModal={() => setIsStoryModalOpen(true)} />
          <main>
            <Hero
              onExplore={handleExploreScroll}
              unmuted={unmuteVideo}
              onOpenStoryModal={() => setIsStoryModalOpen(true)}
            />
            <TheCouple />
            <Ceremonies />
            <MomentsGallery />
            <Blessings />
          </main>
          <Footer />

          {/* Interactive Wedding Story Poster Generator Modal */}
          <StoryPosterModal
            isOpen={isStoryModalOpen}
            onClose={() => setIsStoryModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}

