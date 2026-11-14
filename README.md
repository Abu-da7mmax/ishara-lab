# Ishara | Digital Communications Lab

Ishara is a bilingual educational website for learning digital communications through interactive plots, short quizzes, and Python exercises.

[Open the live lab](https://ishara-lab.pages.dev)

## Explore the lab

- Study 16 open lessons, from waveforms and sampling to BPSK and bit error rate.
- Adjust amplitude, frequency, phase, sampling rate, and noise in the interactive signal lab.
- Compare measured and theoretical BER for BPSK over an AWGN channel.
- Identify waveform changes in Signal Detective and track your progress locally.

The interface supports English, Arabic, and dark mode. Progress and notes are stored in the browser.

## Run the website locally

Run this command from the repository root, then visit http://localhost:8000.

```sh
python -m http.server 8000
```

## Run the Python simulation

```sh
python -m pip install -r requirements.txt
python digital_communication.py
```

The simulation writes `ber_results.csv` and `ber_curve.png` to the working directory. It assumes ideal synchronization and models noise at the symbol decision stage.

## Implementation

The website uses HTML, CSS, JavaScript, and Canvas. The downloadable simulation uses Python, NumPy, and Matplotlib. The live site is hosted on Cloudflare Pages.
