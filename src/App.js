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

const SparkleIcon = ({ className = '', size = 48 }) => (
  <span className={`material-icons ${className}`} style={{ fontSize: size }}>
    auto_awesome
  </span>
);

export default function ChapterViewer() {
  const [activeSubject, setActiveSubject] = useState(null);
  const [pucs, setPucs] = useState([]);
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

  const subjectTotals = topicCounts.map((subj) =>
    subj.reduce((sum, ch) => sum + ch.reduce((s, t) => s + t, 0), 0)
  );

  const canGenerate = subjectTotals.every((total) => total === TOTAL_QUESTIONS);

  return (
    <div className="card-wrapper">
      <div className="card glass">
        <div className={`card-content ${generating ? 'blur' : ''}`}>
        {/* Subject Tabs */}
        <div className="tabs">
          {subjects.map((subj, i) => (
            <div
              key={i}
              className={`tab glass ${i === activeSubject ? 'active' : ''}`}
              onClick={() => {
                setActiveSubject(i);
                setPucs([]);
                setOpenChapter(null);
                setShowPUC(true);
              }}
            >
              {subj}
            </div>
          ))}
        </div>

        {/* Difficulty Slider */}
        <div
          className={`difficulty-container ${
            activeSubject !== null ? 'show' : ''
          }`}
        >
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
                className={`puc-button glass ${pucs.includes(i) ? 'active' : ''}`}
                onClick={() => {
                  setPucs((prev) =>
                    prev.includes(i)
                      ? prev.filter((idx) => idx !== i)
                      : [...prev, i]
                  );
                  setOpenChapter(null);
                }}
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Accordion */}
        <div className={`chapter-container ${pucs.length > 0 ? 'show' : ''}`}>
          {chapters.map((ch, idx) => (
            <div className="chapter glass" key={idx}>
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
                      className="topic-input glass"
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
            className="ai-generate-btn glass"
            onClick={handleGenerate}
            disabled={generating}
          >
            <SparkleIcon className="btn-icon" size={20} /> AI Generate
          </button>
        )}
      </div>
      {generating && (
        <div className="sparkle-overlay">
          <SparkleIcon className="sparkle-icon" size={48} />
        </div>
      )}
    </div>
  </div>
  );
}
