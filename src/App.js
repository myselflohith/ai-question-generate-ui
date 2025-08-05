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

const TOTAL_QUESTIONS = 10;

const Sparkle = ({ className, size = 48 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91 4 9.27l5.91-1.01L12 2z" />
  </svg>
);

export default function ChapterViewer() {
  const [activeSubject, setActiveSubject] = useState(null);
  const [puc, setPuc] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [slider1, setSlider1] = useState(33);
  const [slider2, setSlider2] = useState(66);
  const [showPUC, setShowPUC] = useState(false);
  const [generating, setGenerating] = useState(false);
  const initialCounts = subjects.map(() =>
    chapters.map((ch) => ch.topics.map(() => 0))
  );
  const [topicCounts, setTopicCounts] = useState(initialCounts);

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

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const handleTopicCountChange = (chIdx, topicIdx, value) => {
    if (activeSubject === null) return;
    setTopicCounts((prev) => {
      const copy = prev.map((subj) => subj.map((ch) => [...ch]));
      copy[activeSubject][chIdx][topicIdx] = value;
      return copy;
    });
  };

  const totalCount =
    activeSubject !== null
      ? topicCounts[activeSubject].reduce(
          (sum, ch) => sum + ch.reduce((s, t) => s + t, 0),
          0
        )
      : 0;

  const canGenerate =
    activeSubject !== null && totalCount === TOTAL_QUESTIONS;

  return (
    <div className="card-wrapper">
      <div className="card">
        <div className={`card-content ${generating ? 'blur' : ''}`}>
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
        {activeSubject !== null && (
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
        )}

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
                      max={TOTAL_QUESTIONS}
                      value={
                        activeSubject !== null
                          ? topicCounts[activeSubject][idx][i]
                          : 0
                      }
                      onChange={(e) =>
                        handleTopicCountChange(idx, i, +e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {canGenerate && (
          <button
            className="ai-generate-btn"
            onClick={handleGenerate}
            disabled={generating}
          >
            <Sparkle className="btn-icon" size={20} /> AI Generate
          </button>
        )}
      </div>
      {generating && (
        <div className="sparkle-overlay">
          <Sparkle />
        </div>
      )}
    </div>
  </div>
  );
}