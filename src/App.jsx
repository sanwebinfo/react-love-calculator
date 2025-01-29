import { useState } from 'react';
import confetti from 'canvas-confetti';
import * as bulmaToast from 'bulma-toast';
import sanitizeHtml from 'sanitize-html';
import './App.css';

const App = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loveScore, setLoveScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('');

  const validateInput = (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return false;
    }
    // Check if the input contains only letters and spaces
    //const regex = /^[A-Za-z\s]+$/;
    return trimmedInput;
  };

  const calculateLoveScore = (name1, name2) => {
    const sanitizedName1 = sanitizeHtml(name1);
    const sanitizedName2 = sanitizeHtml(name2);
    const combinedNames = (sanitizedName1 + sanitizedName2).toLowerCase().replace(/\s/g, '');
    let hash = 0;
    for (let char of combinedNames) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      hash |= 0;
    }
    return Math.abs(hash) % 101;
  };

  const updateProgressBar = (targetScore, setScore) => {
    let currentScore = 0;
    const interval = setInterval(() => {
      if (currentScore >= targetScore) {
        clearInterval(interval);
      } else {
        currentScore += 1;
        setScore(currentScore);
      }
    }, 20);
  };

  const getMessage = (score) => {
    if (score >= 90) return "You're soulmates! 💖";
    if (score >= 70) return "You're a perfect match! 💕";
    if (score >= 50) return "You're a good match! 😊";
    if (score >= 30) return "There's potential! 🤔";
    return "Maybe it's not meant to be... 😢";
  };

  const handleCalculate = () => {
    if (!validateInput(name1) || !validateInput(name2)) {
      bulmaToast.toast({
        message: 'Please enter valid names',
        type: 'is-warning',
        position: 'bottom-center',
        pauseOnHover: true,
      });
      return;
    }

    const score = calculateLoveScore(name1, name2);
    setShowResult(true);
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.6 },
    });
    updateProgressBar(score, setLoveScore);
    setMessage(getMessage(score));

  };

  const handleShare = () => {
    const shareText = `Our love score is ${loveScore}%! 💖 Check it out: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Love Calculator',
        text: shareText,
      }).catch(() => {
        bulmaToast.toast({
          message: 'Failed to share',
          type: 'is-danger',
          position: 'bottom-center',
          pauseOnHover: true,
        });
      });
    } else {
      bulmaToast.toast({
        message: shareText,
        type: 'is-info',
        position: 'bottom-center',
        pauseOnHover: true,
      });
    }
  };

  const handleCopy = () => {
    const shareText = `Our love score is ${loveScore}%! 💖 Check it out: ${window.location.href}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        bulmaToast.toast({
          message: 'Copied to clipboard',
          type: 'is-success',
          position: 'bottom-center',
          pauseOnHover: true,
        });
      }).catch(() => {
        bulmaToast.toast({
          message: 'Failed to copy to clipboard',
          type: 'is-danger',
          position: 'bottom-center',
          pauseOnHover: true,
        });
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        bulmaToast.toast({
          message: 'Copied to clipboard',
          type: 'is-success',
          position: 'bottom-center',
          pauseOnHover: true,
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        bulmaToast.toast({
          message: 'Failed to copy to clipboard',
          type: 'is-danger',
          position: 'bottom-center',
          pauseOnHover: true,
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="card">
          <div className="card-content">
            <h1 className="title is-4 mb-4 has-text-dark">💖 Love Calculator</h1>
            <p className="subtitle is-5">Find out how much you and your partner are meant to be!</p>
            <div className="field">
              <label className="label has-text-dark">Your Name</label>
              <div className="control">
                <input
                  id="name1"
                  className="input"
                  type="text"
                  placeholder="Enter your name"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  maxLength="50"
                />
              </div>
            </div>
            <div className="field">
              <label className="label has-text-dark">Your Partner&apos;s Name</label>
              <div className="control">
                <input
                  id="name2"
                  className="input"
                  type="text"
                  placeholder="Enter your partner's name"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  maxLength="50"
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button
                  id="calculate"
                  className="button is-warning"
                  onClick={handleCalculate}
                >
                  Calculate Love 💖
                </button>
              </div>
            </div>
            {showResult && (
              <div id="result" className="has-text-centered mt-6 fade-in">
                <span className="heart">❤️</span>
                <h2 className="title is-2">Your Love Score:</h2>
                <p id="score" className="subtitle is-3">{loveScore}%</p>
                <progress
                  id="progress-bar"
                  className={`progress ${loveScore >= 70 ? 'is-success' : loveScore >= 40 ? 'is-warning' : 'is-danger'}`}
                  value={loveScore}
                  max="100"
                >
                  {loveScore}%
                </progress>
                <p id="message" className="subtitle is-5 mt-3">{message}</p>
                <button
                  id="share-button"
                  className="button is-info mt-3"
                  onClick={handleShare}
                >
                  Share 🚀
                </button>
                <hr />
                <button
                  id="copy-button"
                  className="button is-success mt-3 copy-button"
                  onClick={handleCopy}
                >
                  📝 Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div id="confetti-container" className="confetti"></div>
    </section>
  );
};

export default App;