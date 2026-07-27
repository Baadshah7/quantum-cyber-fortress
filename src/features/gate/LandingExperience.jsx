import HeroSection from './HeroSection';
import MissionBriefSection from './MissionBriefSection';
import FortressStatusSection from './FortressStatusSection';
import FortressOverviewSection from './FortressOverviewSection';
import SentinelJourneySection from './SentinelJourneySection';
import CoreExperienceSection from './CoreExperienceSection';
import MissionCompletionCTASection from './MissionCompletionCTASection';

export default function LandingExperience() {
  return (
    <div className="flex flex-col w-full relative z-10">
      <HeroSection />
      <MissionBriefSection />
      <FortressStatusSection />
      <FortressOverviewSection />
      <SentinelJourneySection />
      <CoreExperienceSection />
      <MissionCompletionCTASection />
    </div>
  );
}
