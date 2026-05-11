import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import DuoButton from '../../components/ui/DuoButton';
import ProgressBar from '../../components/ui/ProgressBar';
import SectionLabel from '../../components/ui/SectionLabel';
import Toggle from '../../components/ui/Toggle';

const HomePage = () => {
  const [toggles, setToggles] = useState({ sound: true, anim: false });
  const [activeLang, setActiveLang] = useState('Spanish');

  return (
    <div>
      {/* Hero Section */}
      <header className="pt-[32px] px-[20px] pb-[32px] text-center flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, rgba(88, 204, 2, 0.08), white)' }}>
        <h1 className="feather text-[28px] text-[#58CC02] mb-[16px]">Learn English by Zen</h1>
        <p className="text-[15px] text-[#777777] leading-[1.5] mb-[32px]">
          A comprehensive visual reference for the Learn English design system covering colors, typography, button variants, cards, and UI components.
        </p>
        <div className="flex flex-col gap-[12px] w-full max-w-[280px] justify-center">
          <DuoButton variant="primary">Get Started</DuoButton>
          <DuoButton variant="secondary">I already have an account</DuoButton>
        </div>
      </header>

      {/* Main Grid */}
      <main className="w-full grid grid-cols-1">

        {/* Panel 1: Colors */}
        <div className="grid-panel p-[28px_20px]" id="colors">
          <SectionLabel text="Color Palette" />
          <div className="grid grid-cols-3 gap-[12px]">
            {[
              { name: 'Green', hex: '#58CC02', rgb: 'rgb(88, 204, 2)' },
              { name: 'Green Hover', hex: '#4BB200', rgb: 'rgb(75, 178, 0)' },
              { name: 'Blue', hex: '#1CB0F6', rgb: 'rgb(28, 176, 246)' },
              { name: 'Dark Blue', hex: '#100F3E', rgb: 'rgb(16, 15, 62)' },
              { name: 'Red', hex: '#FF4B4B', rgb: '#FF4B4B' },
              { name: 'Orange', hex: '#FF9600', rgb: '#FF9600' },
              { name: 'Golden', hex: '#FFC800', rgb: '#FFC800' },
              { name: 'Footer Green', hex: '#4EC604', rgb: '#4EC604' },
              { name: 'Gray Text', hex: '#4B4B4B', rgb: 'rgb(75, 75, 75)' },
              { name: 'Gray Light', hex: '#777777', rgb: 'rgb(119, 119, 119)' },
              { name: 'Nav Text', hex: '#AFAFAF', rgb: 'rgb(175, 175, 175)' },
              { name: 'Border', hex: '#E5E5E5', rgb: 'rgb(229, 229, 229)' },
            ].map((color) => (
              <div key={color.name} className="flex flex-col gap-[8px] group">
                <div
                  className="w-full aspect-square rounded-[12px] border border-black/5 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  style={{ backgroundColor: color.rgb }}
                ></div>
                <div>
                  <div className="text-[12px] font-bold text-[#4B4B4B]">{color.name}</div>
                  <div className="text-[10px] font-semibold text-[#777777] uppercase">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Typography */}
        <div className="grid-panel p-[28px_20px]" id="type">
          <SectionLabel text="Typography" />
          <div className="flex flex-col gap-[20px]">
            {[
              { size: '32px', weight: 'Feather', text: 'Display', className: 'text-[#58CC02] feather text-[32px]' },
              { size: '28px', weight: 'Bold 700', text: 'Heading One', className: 'text-[#4B4B4B] font-bold text-[28px]' },
              { size: '24px', weight: 'Feather', text: 'heading two', className: 'text-[#58CC02] feather text-[24px]' },
              { size: '16px', weight: 'Medium 500', text: 'Body text for paragraphs and descriptions with comfortable reading line-height.', className: 'text-[#777777] font-medium text-[16px] leading-[1.6]' },
              { size: '14px', weight: 'Bold 700', text: 'CAPTION LABEL', className: 'text-[#AFAFAF] font-bold text-[14px] uppercase tracking-[0.5px]' },
              { size: '12px', weight: 'Semi 600', text: 'Small utility text for metadata and hints', className: 'text-[#777777] font-semibold text-[12px]' },
            ].map((type, i) => (
              <div key={i} className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px] mb-[4px]">
                  <div className="text-[#1CB0F6] text-[11px] font-bold">{type.size}</div>
                  <div className="text-[#AFAFAF] text-[10px]">{type.weight}</div>
                </div>
                <div className={type.className}>{type.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Button Variants */}
        <div className="grid-panel p-[28px_20px]" id="buttons">
          <SectionLabel text="Button Variants" />
          <div className="flex flex-col gap-[24px]">
            {[
              { label: 'Primary', buttons: [{ text: 'Get Started', var: 'primary' }, { text: 'Small', var: 'primary', size: 'small' }, { text: 'Disabled', var: 'primary', disabled: true }] },
              { label: 'Secondary', buttons: [{ text: 'Learn More', var: 'secondary' }, { text: 'Small', var: 'secondary', size: 'small' }, { text: 'Disabled', var: 'secondary', disabled: true }] },
              { label: 'Danger', buttons: [{ text: 'Delete', var: 'danger' }, { text: 'Remove', var: 'danger', size: 'small' }] },
              { label: 'Ghost', buttons: [{ text: 'View All', var: 'ghost' }] },
            ].map((row, i) => (
              <div key={i} className="flex flex-col gap-[8px]">
                <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] shrink-0">{row.label}</div>
                <div className="flex flex-wrap gap-[12px] w-full">
                  {row.buttons.map((btn, j) => (
                    <DuoButton key={j} variant={btn.var} size={btn.size} disabled={btn.disabled} className={btn.size === 'small' ? 'flex-none w-auto' : ''}>{btn.text}</DuoButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Dark Theme Buttons */}
        <div className="grid-panel p-[28px_20px] bg-[#100F3E]">
          <SectionLabel text="Dark Theme" dark />
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-white/35 shrink-0">Primary</div>
              <div className="flex flex-col gap-[12px] w-full">
                <DuoButton variant="dark-primary">Get Started</DuoButton>
                <DuoButton variant="dark-primary">Try 1 Week Free</DuoButton>
              </div>
            </div>
            <div className="flex flex-wrap gap-[12px] w-full">
              <DuoButton variant="dark-primary" size="small" className="flex-none w-auto">Get Started</DuoButton>
              <DuoButton variant="dark-primary" size="small" className="flex-none w-auto">Try 1 Week Free</DuoButton>
            </div>
          </div>
        </div>

        {/* Panel 5: Cards */}
        <div className="grid-panel p-[28px_20px]" id="cards">
          <SectionLabel text="Cards" />
          <div className="grid grid-cols-1 gap-[16px]">
            {/* Card 1 */}
            <div className="bg-white border-2 border-[#E5E5E5] rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex flex-col">
              <img src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" alt="Spanish" className="h-[120px] w-full object-cover" />
              <div className="p-[16px] flex-1">
                <div className="inline-block px-[8px] py-[3px] bg-[#58CC02]/10 text-[#58CC02] text-[11px] font-[800] uppercase rounded-[6px] mb-[8px]">New</div>
                <h4 className="text-[16px] font-bold text-[#4B4B4B] mb-[4px]">Spanish for Beginners</h4>
                <p className="text-[13px] text-[#777777] leading-[1.5]">Start your language journey with interactive lessons designed to build fluency.</p>
              </div>
              <div className="border-t-2 border-[#E5E5E5] px-[16px] py-[12px] flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase text-[#AFAFAF]">12 Units</span>
                <button className="text-[12px] font-bold uppercase text-[#1CB0F6] hover:opacity-70 transition-opacity">Start</button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white border-2 border-[#E5E5E5] rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex flex-col">
              <img src="https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" alt="French" className="h-[120px] w-full object-cover" />
              <div className="p-[16px] flex-1">
                <div className="inline-block px-[8px] py-[3px] bg-[#1CB0F6]/10 text-[#1CB0F6] text-[11px] font-[800] uppercase rounded-[6px] mb-[8px]">Popular</div>
                <h4 className="text-[16px] font-bold text-[#4B4B4B] mb-[4px]">French Conversations</h4>
                <p className="text-[13px] text-[#777777] leading-[1.5]">Practice real-world dialogue and improve pronunciation with native speakers.</p>
              </div>
              <div className="border-t-2 border-[#E5E5E5] px-[16px] py-[12px] flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase text-[#AFAFAF]">8 Units</span>
                <button className="text-[12px] font-bold uppercase text-[#1CB0F6] hover:opacity-70 transition-opacity">Continue</button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 6: Dark Theme Cards */}
        <div className="grid-panel p-[28px_20px] bg-[#100F3E]">
          <SectionLabel text="Dark Cards" dark />
          <div className="grid grid-cols-1 gap-[16px]">
            {/* Dark Card 1 */}
            <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] flex flex-col">
              <div className="p-[20px] flex-1">
                <div className="inline-block px-[8px] py-[3px] bg-[#FFC800]/15 text-[#FFC800] text-[11px] font-[800] uppercase rounded-[6px] mb-[12px]">Super</div>
                <h4 className="text-[16px] font-bold text-white mb-[8px]">Unlimited Hearts</h4>
                <p className="text-[13px] text-white/50 leading-[1.5]">Keep learning without interruption with Zen Premium benefits.</p>
              </div>
              <div className="border-t border-white/10 px-[20px] py-[16px] flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase text-white/30">Premium</span>
                <button className="text-[12px] font-bold uppercase text-white hover:text-[#FFC800] transition-colors">Upgrade</button>
              </div>
            </div>
            {/* Dark Card 2 */}
            <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-[4px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] flex flex-col">
              <div className="p-[20px] flex-1">
                <div className="inline-block px-[8px] py-[3px] bg-[#FF9600]/15 text-[#FF9600] text-[11px] font-[800] uppercase rounded-[6px] mb-[12px]">Pro</div>
                <h4 className="text-[16px] font-bold text-white mb-[8px]">Mastery Quizzes</h4>
                <p className="text-[13px] text-white/50 leading-[1.5]">Challenge yourself with advanced assessments to test your skill level.</p>
              </div>
              <div className="border-t border-white/10 px-[20px] py-[16px] flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase text-white/30">Advanced</span>
                <button className="text-[12px] font-bold uppercase text-white hover:text-[#FF9600] transition-colors">Try Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 7: Components */}
        <div className="grid-panel p-[28px_20px]" id="components">
          <SectionLabel text="Components" />
          <div className="flex flex-col gap-[28px]">

            {/* Badges */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] mb-[12px]">Badges</div>
              <div className="flex flex-wrap gap-[8px]">
                <Badge text="Completed" colorHex="green" />
                <Badge text="In Progress" colorHex="blue" />
                <Badge text="Failed" colorHex="red" />
                <Badge text="Streak" colorHex="orange" />
                <Badge text="Premium" colorHex="golden" />
              </div>
            </div>

            {/* Input + Button */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] mb-[12px]">Form Elements</div>
              <div className="flex flex-col gap-[12px]">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full h-[48px] px-[16px] border-2 border-[#E5E5E5] rounded-[12px] text-[15px] font-[600] text-[#4B4B4B] placeholder:text-[#AFAFAF] placeholder:font-[500] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                />
                <DuoButton variant="primary">Subscribe</DuoButton>
              </div>
            </div>

            {/* Toggles */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] mb-[12px]">Toggles</div>
              <div className="flex flex-col gap-[16px]">
                <Toggle checked={toggles.sound} onChange={() => setToggles(p => ({ ...p, sound: !p.sound }))} label="Sound effects" />
                <Toggle checked={toggles.anim} onChange={() => setToggles(p => ({ ...p, anim: !p.anim }))} label="Animations" />
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] mb-[12px]">Progress Bars</div>
              <div className="flex flex-col gap-[16px]">
                <ProgressBar progress={85} colorClass="bg-[#58CC02]" />
                <ProgressBar progress={60} colorClass="bg-[#1CB0F6]" />
                <ProgressBar progress={35} colorClass="bg-[#FF9600]" />
              </div>
            </div>

            {/* Tooltip & Streak */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#AFAFAF] mb-[12px]">Interactions & Meta</div>
              <div className="flex items-center gap-[24px]">

                {/* Tooltip */}
                <div className="relative group cursor-pointer">
                  <div className="text-[13px] font-bold text-[#58CC02] bg-[#58CC02]/10 px-[16px] py-[8px] rounded-[8px]">
                    Hover me
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[10px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 w-max">
                    <div className="bg-[#100F3E] text-white text-[12px] font-[600] px-[12px] py-[6px] rounded-[8px] tooltip-arrow">
                      I am a tooltip!
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="inline-flex items-center gap-[6px] bg-[#FF9600]/10 px-[14px] py-[6px] rounded-[20px]">
                  <span className="text-[18px]">🔥</span>
                  <span className="text-[16px] font-[800] text-[#FF9600]">42</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Panel 8: Dark Components */}
        <div className="grid-panel p-[28px_20px] bg-[#100F3E]">
          <SectionLabel text="Dark Components" dark />
          <div className="flex flex-col gap-[28px]">

            {/* Language Pills */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-white/30 mb-[12px]">Language Selection</div>
              <div className="flex flex-wrap gap-[8px]">
                {[
                  { name: 'Spanish', flag: '59a90a2cedd48b751a8fd22014768fd7.svg' },
                  { name: 'French', flag: '482fda142ee4abd728ebf4ccce5d3307.svg' },
                  { name: 'German', flag: 'c71db846ffab7e0a74bc6971e34ad82e.svg' },
                  { name: 'Japanese', flag: 'edea4fa18ff3e7d8c0282de3f102aaed.svg' }
                ].map((lang) => {
                  const isActive = activeLang === lang.name;
                  return (
                    <div
                      key={lang.name}
                      onClick={() => setActiveLang(lang.name)}
                      className={`inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-[12px] border-2 cursor-pointer transition-colors ${isActive ? 'border-[#58CC02] bg-[#58CC02]/10 text-white' : 'border-white/10 text-white/70 hover:border-[#58CC02] hover:bg-[#58CC02]/5'
                        }`}
                    >
                      <img src={`https://d35aaqx5ub95lt.cloudfront.net/vendor/${lang.flag}`} alt={lang.name} className="w-[24px] h-[18px] object-contain rounded-[2px]" />
                      <span className="text-[13px] font-bold">{lang.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Avatar Group */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-white/30 mb-[12px]">Leaderboard Avatars</div>
              <div className="flex items-center">
                <div className="flex">
                  <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop" className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover" alt="User 1" />
                  <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop" className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover -ml-[8px]" alt="User 2" />
                  <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop" className="w-[36px] h-[36px] rounded-full border-2 border-white object-cover -ml-[8px]" alt="User 3" />
                  <div className="w-[36px] h-[36px] rounded-full border-2 border-white bg-[#f0f0f0] flex items-center justify-center text-[11px] font-[800] text-[#777777] -ml-[8px] z-10">
                    +5
                  </div>
                </div>
                <span className="ml-[12px] text-[13px] font-[600] text-white/50">8 learners</span>
              </div>
            </div>

            {/* Progress Dark */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-white/30 mb-[12px]">Stats Progress</div>
              <div className="flex flex-col gap-[16px]">
                <ProgressBar progress={72} colorClass="bg-[#FFC800]" dark />
                <ProgressBar progress={45} colorClass="bg-[#58CC02]" dark />
              </div>
            </div>

            {/* Badges Dark */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[1px] text-white/30 mb-[12px]">Achievements</div>
              <div className="flex flex-wrap gap-[8px]">
                <Badge text="Mastered" colorHex="green" dark />
                <Badge text="Review" colorHex="blue" dark />
                <Badge text="Crown" colorHex="golden" dark />
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default HomePage;
