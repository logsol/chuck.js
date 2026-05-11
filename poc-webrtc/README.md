# chuck.js WebRTC POC

Isolated test of WebRTC DataChannels (UDP-like, unreliable) as an alternative
to Socket.IO (TCP) for the game's networking. Does not touch the chuck.js code.

## Run

```
cd poc-webrtc
npm install
npm start
```

Open two browser tabs:

- http://localhost:1235/?transport=webrtc
- http://localhost:1235/?transport=socketio

Use **A/D** or **←/→** to move, **Space** to jump. The blue box is yours; yellow
boxes are other connected clients (open more tabs to add players).

The right-hand panel shows live RTT, packet rate, last received sequence
number, and number of detected sequence gaps (= packets the unreliable channel
silently dropped).

Every connection also streams its stats to the server once per second. The
server writes everything to `runs/<timestamp>.jsonl` (one file per server
start). Use the **phase buttons** on the UI before/after changing network
conditions so the analyzer can group samples per phase.

After a test session, summarize with:

```
node analyze.js
```

This prints a per-(transport, phase) table of RTT percentiles, receive rate,
and seq gap deltas — making the comparison quantitative instead of eyeball.

## What to look for

Baseline on localhost (no packet loss): both transports show single-digit
millisecond RTT and zero gaps. WebRTC's RTT may be a hair higher due to DTLS
overhead. That's fine — the point of the comparison is **under loss**.

Add packet loss via Chrome DevTools (Network → "Add custom profile" with
download/upload throttling and packet loss) **or** via `tc netem` on Linux:

```
sudo tc qdisc add dev lo root netem loss 5% delay 50ms
# … run the test …
sudo tc qdisc del dev lo root
```

Expected difference under 5% loss:

| Metric                | Socket.IO            | WebRTC unreliable      |
|-----------------------|----------------------|------------------------|
| RTT median            | rises slightly       | rises slightly         |
| RTT 95th percentile   | spikes wildly (HoL)  | stays close to median  |
| Seq gaps              | ≈ 0 (TCP retransmits)| matches loss rate      |
| Box motion smoothness | stutters             | smooth (skips a frame) |

The Socket.IO tab will stutter visibly because TCP holds back all later
packets until the dropped one is retransmitted. The WebRTC tab will drop a
worldUpdate here and there but every other update arrives on time.

## What this POC does NOT include

- TURN server (only STUN — works on localhost/LAN; real internet may need
  TURN for symmetric NATs)
- Reconnection / connection-loss handling
- Auth / encryption beyond WebRTC's built-in DTLS
- chuck.js's actual protocol (it mimics the *shape* — 14Hz broadcasts, input
  events, ping/pong — not the message format)

## Decision after running

If WebRTC clearly outperforms under packet loss → write the integration plan
that swaps chuck.js's Socket.IO game-command stream for an unreliable
DataChannel (keeping Socket.IO or a reliable channel for join/leave/round
control).

If the difference is marginal → the reconciliation-based approach already in
the game is probably good enough, and the integration cost isn't justified.
