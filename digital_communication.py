"""Coherent BPSK over AWGN: normalized symbol-level simulation, not RF hardware."""
import csv
import math
import numpy as np
import matplotlib.pyplot as plt

SEED = 42
N_BITS = 200_000
rng = np.random.default_rng(SEED)
rows = []
for db in np.arange(-2, 11, 2):
    gamma = 10.0 ** (db / 10.0)
    bits = rng.integers(0, 2, N_BITS)
    symbols = 2 * bits - 1  # Eb = 1; one bit per BPSK symbol
    sigma = np.sqrt(1.0 / (2 * gamma))
    received = symbols + rng.normal(0, sigma, N_BITS)
    detected = (received >= 0).astype(int)
    errors = np.count_nonzero(detected != bits)
    ber = errors / N_BITS
    theoretical = 0.5 * math.erfc(math.sqrt(gamma))
    rows.append([int(db), int(errors), N_BITS, ber, theoretical])
    print(f"Eb/N0={db:2} dB | errors={errors:6} | BER={ber:.6g} | theory={theoretical:.6g}")

with open('ber_results.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['eb_n0_db', 'errors', 'n_bits', 'ber_measured', 'ber_theory'])
    writer.writerows(rows)

data = np.array(rows)
plt.semilogy(data[:, 0], data[:, 4], '-', label='BPSK theory')
nonzero = data[:, 3] > 0
plt.semilogy(data[nonzero, 0], data[nonzero, 3], 'o', label='Simulation')
if np.any(~nonzero):
    plt.semilogy(data[~nonzero, 0], 3 / data[~nonzero, 2], 'v', label='Zero errors: approx. 95% upper bound 3/N')
plt.xlabel('Eb/N0 (dB)')
plt.ylabel('Bit error rate')
plt.title('Coherent BPSK over AWGN | seed=42 | 200,000 bits/point')
plt.grid(True, which='both', alpha=0.3)
plt.legend()
plt.tight_layout()
plt.savefig('ber_curve.png', dpi=200)
print('Saved ber_results.csv and ber_curve.png. Zero observed errors do not imply zero true BER.')
plt.show()
