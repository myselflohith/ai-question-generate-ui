import React, { useState, useEffect } from 'react';
import './ChapterViewer.css';
import { fetchYears, fetchSubjects, fetchChapters } from './api';

const TOTAL_QUESTIONS = 10;

const SparkleIcon = ({ className = '', size = 48 }) => (
  <span className={`material-icons ${className}`} style={{ fontSize: size }}>
    auto_awesome
  </span>
);

export default function ChapterViewer() {
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [chapterIndexMap, setChapterIndexMap] = useState({});
  const [activeSubject, setActiveSubject] = useState(null);
  const [pucs, setPucs] = useState([]);
  const [openChapter, setOpenChapter] = useState(null);
  const [slider1, setSlider1] = useState(33);
  const [slider2, setSlider2] = useState(66);
  const [showPUC, setShowPUC] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [showTopics, setShowTopics] = useState(false);
  const [topicCounts, setTopicCounts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [yearRes, subjRes, chapRes] = await Promise.all([
        fetchYears(),
        fetchSubjects(),
        fetchChapters(),
      ]);
      const subjNames = subjRes.data.slice(0, 3).map((s) => s.subject_name);
      setSubjects(subjNames);
      setYears(yearRes.data);
      const chaps = chapRes.data.map((ch) => ({
        ...ch,
        topics: ['Topic 1', 'Topic 2', 'Topic 3'],
      }));
      setChapters(chaps);
      const indexMap = {};
      chaps.forEach((ch, idx) => {
        indexMap[ch.chapter_id] = idx;
      });
      setChapterIndexMap(indexMap);
      const counts = subjNames.map(() => chaps.map(() => Array(3).fill(0)));
      setTopicCounts(counts);
    }
    loadData();
  }, []);

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
    return `Hard: ${hard}% Medium: ${medium}% Low: ${low}%`;
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const handleTopicCountChange = (chapterId, topicIdx, value) => {
    if (activeSubject === null) return;
    const chIdx = chapterIndexMap[chapterId];
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
                setPucs([]);
                setOpenChapter(null);
                setSelectedChapters([]);
                setShowTopics(false);
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
            {years.map((year) => (
              <div
                key={year.year_id}
                className={`puc-button ${
                  pucs.includes(year.year_id) ? 'active' : ''
                }`}
                onClick={() => {
                  setPucs((prev) =>
                    prev.includes(year.year_id)
                      ? prev.filter((id) => id !== year.year_id)
                      : [...prev, year.year_id]
                  );
                  setSelectedChapters([]);
                  setShowTopics(false);
                  setOpenChapter(null);
                }}
              >
                {year.year_name}
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Selection */}
        {!showTopics && (
          <div className={`chapter-container ${pucs.length > 0 ? 'show' : ''}`}>
            <div className="chapter-buttons">
              {chapters
                .filter((ch) => pucs.includes(ch.year_id))
                .map((ch) => (
                  <div
                    key={ch.chapter_id}
                    className={`chapter-button ${
                      selectedChapters.includes(ch.chapter_id) ? 'active' : ''
                    }`}
                    onClick={() =>
                      setSelectedChapters((prev) =>
                        prev.includes(ch.chapter_id)
                          ? prev.filter((c) => c !== ch.chapter_id)
                          : [...prev, ch.chapter_id]
                      )
                    }
                  >
                    {ch.chapter_name}
                  </div>
                ))}
            </div>
            {selectedChapters.length > 0 && (
              <button
                className="continue-btn"
                onClick={() => setShowTopics(true)}
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Chapter Accordion */}
        {showTopics && (
          <div className={`chapter-container show`}>
            {selectedChapters.map((id) => {
              const chIdx = chapterIndexMap[id];
              const chapter = chapters[chIdx];
              return (
                <div className="chapter" key={id}>
                  <div
                    className="chapter-header"
                    onClick={() =>
                      setOpenChapter(openChapter === id ? null : id)
                    }
                  >
                    <span>{chapter.chapter_name}</span>
                    <span className="material-icons arrow-icon">
                      {openChapter === id ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  <div className={`topics ${openChapter === id ? 'show' : ''}`}>
                    {chapter.topics.map((topic, i) => (
                      <div className="topic" key={i}>
                        <span>{topic}</span>
                        <input
                          type="number"
                          className="topic-input"
                          min="0"
                          max={TOTAL_QUESTIONS}
                          value={
                            activeSubject !== null
                              ? topicCounts[activeSubject][chIdx][i]
                              : 0
                          }
                          onChange={(e) =>
                            handleTopicCountChange(id, i, +e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {canGenerate && (
          <button
            className="ai-generate-btn"
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