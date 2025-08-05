import React, { useState } from 'react';
import './ChapterViewer.css';

const subjects = ['Physics', 'Chemistry', 'Mathematics'];
const chapters = [
  {
    title: 'Motion and Laws',
    topics: ["Newton's Laws", 'Inertia', 'Acceleration']
  },
  {
    title: 'Work, Energy and Power',
    topics: ['Kinetic Energy', 'Potential Energy', 'Conservation Laws']
  },
  {
    title: 'Oscillations',
    topics: ['Simple Harmonic Motion', 'Frequency & Amplitude', 'Damped Oscillations']
  }
];

export default function ChapterViewer() {
  const [activeSubject, setActiveSubject] = useState(0);
  const [puc, setPuc] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [slider1, setSlider1] = useState(33);
  const [slider2, setSlider2] = useState(66);
  const [showPUC, setShowPUC] = useState(false);

  const handleSliderChange = (index, value) => {
    if (index === 1) {
      const clamped = Math.min(value, slider2 - 1);
      setSlider1(clamped);
    } else {
      const clamped = Math.max(value, slider1 + 1);
      setSlider2(clamped);
    }
  };

  const getSliderValues = () => {
    const hard = slider1;
    const medium = slider2 - slider1;
    const low = 100 - slider2;
    return `Hard: ${hard}% | Medium: ${medium}% | Low: ${low}%`;
  };

  return (
    <div className="card-wrapper">
      <div className="card">
        {/* Subject Tabs */}
        <div className="tabs">
          {subjects.map((subj, i) => (
            <div
              key={i}
              className={`tab ${i === activeSubject ? 'active' : ''}`}
              onClick={() => {
                setActiveSubject(i);
                setPuc(null);
                setOpenChapter(null);
                setShowPUC(true);
              }}
            >
              {subj}
            </div>
          ))}
        </div>

        {/* Difficulty Slider */}
        <div id="difficulty-container" style={{ display: 'block' }}>
          <div className="label-row">
            <span>Hard</span>
            <span>Medium</span>
            <span>Low</span>
          </div>
          <div className="slider-container">
            <div className="bar"></div>
            <div
              className="fill-bar"
              style={{ left: `${slider1}%`, width: `${slider2 - slider1}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={slider1}
              onChange={(e) => handleSliderChange(1, +e.target.value)}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={slider2}
              onChange={(e) => handleSliderChange(2, +e.target.value)}
            />
          </div>
          <div className="values">{getSliderValues()}</div>
        </div>

        {/* PUC Selection */}
        <div className={`puc-container ${showPUC ? 'show' : ''}`}>
          <div className="puc-buttons">
            {['1st PUC', '2nd PUC'].map((val, i) => (
              <div
                key={i}
                className={`puc-button ${puc === i ? 'active' : ''}`}
                onClick={() => {
                  setPuc(i);
                  setOpenChapter(null);
                }}
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Accordion */}
        <div className={`chapter-container ${puc !== null ? 'show' : ''}`}>
          {chapters.map((ch, idx) => (
            <div className="chapter" key={idx}>
              <div
                className="chapter-header"
                onClick={() => setOpenChapter(openChapter === idx ? null : idx)}
              >
                {ch.title}
              </div>
              <div className={`topics ${openChapter === idx ? 'show' : ''}`}>
                {ch.topics.map((topic, i) => (
                  <div className="topic" key={i}>
                    <span>{topic}</span>
                    <input
                      type="number"
                      className="topic-input"
                      min="0"
                      defaultValue={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}